import { SDK } from '@getstation/sdk';
import { StorageChanges } from '@getstation/sdk/lib/storage/event';
import { equals } from 'ramda';
import { fromEventPattern, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, take, tap } from 'rxjs/operators';
import { flatten } from '../helpers';
import SlackTeam from './search/slack-team';

class SlackSearch {
  public static instance: null | SlackSearch;
  private static readonly teams: Map<string, SlackTeam> = new Map();
  private static readonly errors: Subject<Error> = new Subject();
  private static readonly addedTeams: Subject<[string, SlackTeam]> = new Subject();
  private readonly sdk: SDK;
  private querySubscription?: Subscription;
  private tokensSubscription?: Subscription;

  constructor(sdk: SDK) {
    this.sdk = sdk;
  }

  static async activate(sdk: SDK): Promise<Observable<Error>> {
    if (!this.instance) {
      this.instance = new this(sdk);
      await this.instance.manageTeams();
      await this.instance.process();
    }
    return this.errors.asObservable();
  }

  static deactivate() {
    if (this.instance) {
      this.instance.close();
      this.instance = null;
    }
  }

  static async getTeam(teamId: string): Promise<SlackTeam> {
    const team = SlackSearch.teams.get(teamId);

    if (team) return team;

    return this.addedTeams
      .pipe(
        filter(t => t[0] === teamId),
        take(1),
        map(([_, newTeam]) => newTeam)
      )
      .toPromise();
  }

  static findTeamByDomain(domain: string) {
    for (const [, team] of SlackSearch.teams.entries()) {
      if (team.teamDomain === domain) {
        return team;
      }
    }

    return undefined;
  }

  private static setTeam(teamId: string, team: SlackTeam) {
    SlackSearch.teams.set(teamId, team);
    this.addedTeams.next([teamId, team]);
  }

  public close() {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }

    if (this.tokensSubscription) {
      this.tokensSubscription.unsubscribe();
    }

    SlackSearch.teams.forEach((team, teamId, teams) => {
      team.close();
      teams.delete(teamId);
    });
  }

  public async process() {
    let cancelRunningQuery: (() => void) | null = null;

    // @ts-ignore: rxjs conflicts when use symlink in dev
    this.querySubscription = this.sdk.search.query
      .pipe(
        tap((query) => {
          if (cancelRunningQuery) {
            cancelRunningQuery();
            cancelRunningQuery = null;
          }
          if (query.value) {
            this.sdk.search.results.next({ loading: 'Slack' });
          } else {
            this.sdk.search.results.next({ results: [] });
          }
        }),
        filter(query => Boolean(query.value)), // ignore empty query
        distinctUntilChanged(),
        debounceTime(150)
      )
      .subscribe(
        async (query) => {
          let cancelled = false;
          cancelRunningQuery = () => { cancelled = true; };

          await this.manageTeams();
          if (cancelled) return;

          const results = this.getResults(query.value);
          this.sdk.search.results.next({ results });
        },
        e => SlackSearch.errors.next(e)
      );

    this.tokensSubscription = this.observeTokens()
      .subscribe(() => this.manageTeams());
  }

  private observeTokens(): Observable<Record<string, string>> {
    const onChanged = this.sdk.storage.onChanged;

    return fromEventPattern(
      onChanged.addListener.bind(onChanged),
      onChanged.removeListener.bind(onChanged)
    )
      .pipe(
        map((changes: StorageChanges) =>
          changes.tokens && changes.tokens.newValue),
        distinctUntilChanged((a: Record<string, string>, b: Record<string, string>) => equals(a, b))
      );
  }

  private getResults(query: string) {
    const results = Array
      .from(SlackSearch.teams)
      .map(([_, team]) => team.search(query));

    return flatten(results);
  }

  private async manageTeams() {
    const { storage } = this.sdk;

    // Detect new teams
    const tokens = await storage.getItem('tokens');

    if (!tokens) return;

    // On Bx side, Slack instances are stored by subdomain like that:
    // {
    //   selectedTeam: 'stationworld'
    //   tokens: {
    //     stationworld: 'xxx-xxx',
    //   }
    // }
    // We instantiate SlackTeams from the Bx subdomain but use the Team ID
    // as entry point

    const teamDomains = Object.keys(tokens);
    const processedTeams: string[] = [];

    for (const teamDomain of teamDomains) {
      const existingTeam = SlackSearch.findTeamByDomain(teamDomain);

      if (existingTeam) {
        processedTeams.push(existingTeam.teamId);
      } else {
        const team = new SlackTeam(this.sdk, teamDomain, tokens[teamDomain]);

        const wsErrors$ = await team.process();
        wsErrors$.subscribe(SlackSearch.errors);

        SlackSearch.setTeam(team.teamId, team);
        processedTeams.push(team.teamId);
      }
    }

    // Remove deleted teams
    SlackSearch.teams.forEach((team, teamId, teams) => {
      if (!processedTeams.includes(teamId)) {
        team.close();
        teams.delete(teamId);
      }
    });
  }
}

export default SlackSearch;
