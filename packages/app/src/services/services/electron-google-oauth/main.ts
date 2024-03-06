import { google } from 'googleapis';
import { people_v1 } from 'googleapis/build/src/apis/people/v1';
import ElectronGoogleOAuth2 from '@getstation/electron-google-oauth2';
import { RPC } from '../../lib/types';
import { ElectronGoogleOAuthService } from './interface';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

export class ElectronGoogleOAuthServiceImpl extends ElectronGoogleOAuthService implements RPC.Interface<ElectronGoogleOAuthService> {
  async signIn(scopes: string[], forceAddSession?: boolean) {

    const client = new ElectronGoogleOAuth2(CLIENT_ID, CLIENT_SECRET, scopes, { successRedirectURL: 'https://getstation.com/' });
    return client.openAuthWindowAndGetTokens(forceAddSession)
      .then(async (tokens) => {

        const service = google.people({
            version: 'v1',
            auth: client.oauth2Client,
        });

        const response = await service.people.get({
            resourceName: 'people/me',
            personFields: 'names,emailAddresses,photos',
            sources: ['READ_SOURCE_TYPE_PROFILE'],
        });

        return { tokens, profile: response.data as people_v1.Schema$Person };
      });
  }
}
