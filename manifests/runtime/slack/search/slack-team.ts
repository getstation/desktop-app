import { SDK, search } from '@getstation/sdk';
/*
  We forked the Slack library for @getstation/slack since we need to use
  the browser version (the worker is a renderer process) and we are in a node context.
*/
// @ts-ignore
import * as slack from '@getstation/slack';
import * as Fuse from 'fuse.js';
import * as join from 'join-array';
import { Observable, Subject } from 'rxjs';
import * as WS from 'ws';
import { flatten } from '../../helpers';
import WebSocketClient from '../../utils/websocket';
import { getOpenHandler, urlForResource } from '../resources';

class SlackTeam {

  static fuseOptions = {
    keys: ['additionalSearchString', 'label'],
    shouldSort: true,
    threshold: 0.2,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    tokenize: true,
  };

  public readonly teamDomain;
  public teamId: string;
  public teamName: string;
  public data: Map<string, search.SearchResultItem>;
  public imsMapper: Map<string, string> = new Map();
  private readonly errors: Subject<Error>;
  private readonly token;
  private sdk: SDK;
  private ws: WS;
  private selfUser: any;

  constructor(sdk: SDK, teamDomain: string, token: string) {
    this.sdk = sdk;
    this.data = new Map();
    this.teamDomain = teamDomain;
    this.token = token;
    this.errors = new Subject();
  }

  private static getAdditionnalSearchString(user: any): string {
    if (!Boolean(user.profile)) return '';
    const { profile: { display_name_normalized, real_name_normalized, first_name, last_name } } = user;
    return [display_name_normalized, real_name_normalized, first_name, last_name].join(' ');
  }

  public get(resourceId: string): search.SearchResultItem | undefined {
    if (this.data.has(resourceId)) {
      return this.data.get(resourceId)!;
    }

    if (this.imsMapper.has(resourceId)) {
      return this.data.get(this.imsMapper.get(resourceId)!)!;
    }

    return undefined;
  }

  async process(): Promise<Observable<Error>> {
    const { start } = slack.rtm;
    const data = await start({ token: this.token });

    const { url, users, ims, channels, groups, self, team: { id, name } } = data;

    this.createWebSocketConnection(url);

    this.teamName = name;
    this.teamId = id;

    this.selfUser = self;
    for (const im of ims) { this.imsMapper.set(im.id, im.user); }
    for (const user of users) { this.upsertUser(user); }
    for (const channel of channels) { this.upsertChannel(channel); }
    for (const group of groups) { this.upsertGroup(group); }

    this.upsertChannel({ name: 'All Unreads', id: 'unreads', is_channel: true });
    this.upsertChannel({ name: 'Threads', id: 'threads', is_channel: true });

    return this.errors.asObservable();
  }

  public search(query: string): search.SearchResultItem[] {
    const fuse = new Fuse(Array.from(this.data.values()), SlackTeam.fuseOptions);
    return fuse.search<search.SearchResultItem>(query).slice(0, 10);
  }

  public close() {
    this.ws.close();
  }

  private upsertUser(user: any) {
    if (user.deleted) {
      this.deleteRecord(user.id);
      return;
    }

    this.upsertRecord(
      user.id,
      {
        category: `Slack: ${this.teamName}`,
        label: user.profile.real_name,
        context: `Slack > ${this.teamName}`,
        imgUrl: user.profile.image_48,
        onSelect: this.onSelectRecord(user.id),
        additionalSearchString: SlackTeam.getAdditionnalSearchString(user),
        manifestURL: this.sdk.search.id,
        url: urlForResource(this.teamDomain, user.id),
        meta: {
          first_name: user.profile.first_name,
        },
      });
  }

  private upsertGroup(channel: any) {
    if (channel.is_archived || !channel.is_group) {
      return;
    }

    // Private channel run like groups but have different name representation
    // @see https://api.slack.com/types/group ('Consider a group object the same thing as a private channel object')
    if (channel.is_mpim) {
      const members = channel.members
        .filter(memberId => memberId !== this.selfUser.id)
        .map(memberId => this.data.get(memberId))
        .filter(member => Boolean(member));

      // If you have groups that contains deactivated /deleted members we don't push the group
      if (members.length !== channel.members.length - 1) return; // @exp: -1 => remove self user

      const label = join({
        array: members.map(member => member.meta.first_name),
        separator: ', ',
        last: ' and ',
        max: 2,
        maxMessage: (missed: string) => `(${missed} more...)`,
      });

      this.upsertRecord(
        channel.id,
        {
          category: `Slack: ${this.teamName}`,
          label,
          context: `Slack > ${this.teamName}`,
          additionalSearchString: flatten(members.map(member => SlackTeam.getAdditionnalSearchString(member))),
          onSelect: this.onSelectRecord(channel.id),
          imgUrl: 'https://a.slack-edge.com/436da/marketing/img/meta/ios-144.png',
          manifestURL: this.sdk.search.id,
          url: urlForResource(this.teamDomain, channel.id),
        });
    } else {
      this.upsertRecord(
        channel.id,
        {
          category: `Slack: ${this.teamName}`,
          label: channel.name,
          context: `Slack > ${this.teamName}`,
          additionalSearchString: channel.name_normalized,
          onSelect: this.onSelectRecord(channel.id),
          imgUrl: 'https://a.slack-edge.com/436da/marketing/img/meta/ios-144.png',
          manifestURL: this.sdk.search.id,
          url: urlForResource(this.teamDomain, channel.id),
        });
    }
  }

  private upsertChannel(channel: any) {
    if (channel.is_archived || !channel.is_channel || channel.is_mpim) {
      return;
    }

    this.upsertRecord(
      channel.id,
      {
        category: `Slack: ${this.teamName}`,
        label: channel.name,
        context: `Slack > ${this.teamName}`,
        onSelect: this.onSelectRecord(channel.id),
        imgUrl: 'https://a.slack-edge.com/436da/marketing/img/meta/ios-144.png',
        manifestURL: this.sdk.search.id,
        url: urlForResource(this.teamDomain, channel.id),
      });
  }

  private onSelectRecord(id: string) {
    return async () => getOpenHandler(this.sdk)(urlForResource(this.teamDomain, id));
  }

  private upsertRecord(id: string, data: any) {
    const record = this.data.has(id) ?
      this.data.get(id) :
      // @ts-ignore: partial assignment with id only
      // and then assign complete search.SearchResultItem
      this.data.set(id, { resourceId: id }).get(id);

    this.data.set(id, { ...record, ...data });
  }

  private deleteRecord(id: string) {
    this.data.has(id) ?
      this.data.delete(id) :
      null;
  }

  private createWebSocketConnection(url: string) {
    this.ws = WebSocketClient.from(url);

    /*
    this.ws.on('open', (event: any) =>
      console.log({ type: 'open', response: event })
    );
    */

    this.ws.on('error', (error: Error) =>
      this.errors.next(error)
    );

    this.ws.on('message', async (event: any) => {
      // console.log({ type: 'message', response: JSON.parse(event) });
      const response = JSON.parse(event);
      switch (response.type) {
        case 'user_change':
          this.upsertUser(response.user);
          break;
        case 'channel_archive':
        case 'channel_deleted':
          this.deleteRecord(response.channel);
          break;
        case 'channel_unarchive':
          this.upsertChannel((await slack.channels.info({ token: this.token, channel: response.channel })).channel);
          break;
        case 'channel_created':
          this.upsertChannel((await slack.channels.info({ token: this.token, channel: response.channel.id })).channel);
          break;
        case 'group_unarchive':
        case 'group_open':
          this.upsertGroup((await slack.groups.info({ token: this.token, channel: response.channel })).group);
          break;
        case 'group_joined':
          this.upsertGroup((await slack.groups.info({ token: this.token, channel: response.channel.id })).group);
          break;
        case 'group_close':
        case 'group_archive':
        case 'group_left':
          this.deleteRecord(response.channel);
          break;
        default:
          break;
      }
    });

    this.ws.on('close', (event: any) => console.log(event));
  }
}

export default SlackTeam;
