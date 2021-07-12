import { google } from 'googleapis';
import { Schema$Person } from 'googleapis/build/src/apis/plus/v1';
import ElectronGoogleOAuth2 from '@getstation/electron-google-oauth2';
import { RPC } from '../../lib/types';
import { ElectronGoogleOAuthService } from './interface';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

export class ElectronGoogleOAuthServiceImpl extends ElectronGoogleOAuthService implements RPC.Interface<ElectronGoogleOAuthService> {
  async signIn(scopes: string[], forceAddSession?: boolean) {
    const client = new ElectronGoogleOAuth2(CLIENT_ID, CLIENT_SECRET, scopes);
    return client.openAuthWindowAndGetTokens(forceAddSession)
      .then(async (tokens) => {
        const response = await google.plus('v1').people.get({
          userId: 'me',
          auth: client.oauth2Client,
        });
        return { tokens, profile: response.data as Schema$Person };
      });
  }
}
