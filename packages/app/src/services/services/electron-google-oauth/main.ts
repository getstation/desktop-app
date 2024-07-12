import { google } from 'googleapis';
import { people_v1 } from 'googleapis/build/src/apis/people/v1';
import { Credentials } from 'google-auth-library';
import ElectronGoogleOAuth2 from '@getstation/electron-google-oauth2';
import log from 'electron-log';

import { RPC } from '../../lib/types';
import { ElectronGoogleOAuthService, ElectronGoogleSignInResponse } from './interface';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

export class ElectronGoogleOAuthServiceImpl extends ElectronGoogleOAuthService implements RPC.Interface<ElectronGoogleOAuthService> {
  async signIn(scopes: string[], forceAddSession?: boolean): Promise<ElectronGoogleSignInResponse> {

    const client = new ElectronGoogleOAuth2(CLIENT_ID, CLIENT_SECRET, scopes, { successRedirectURL: 'https://getstation.com/' });
    return client.openAuthWindowAndGetTokens(forceAddSession)
      .then(async (tokens) => {
        try {
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
        }
        catch (err) {
          log.error(`Google profile request error ${err}`);
          return this.parseToken(tokens);
       }
      });
  }

  private parseToken(tokens: Credentials): ElectronGoogleSignInResponse {
    try {
      //vk: id_token format https://developers.google.com/identity/gsi/web/reference/js-reference#credential
      const decodedStr = Buffer.from(tokens.id_token!.split('.')[1], 'base64').toString()
      const tokenPayload = JSON.parse(decodedStr);

      return { 
        tokens, 
        profile: {
          names: [
            {
              metadata: {
                source: {
                  id: tokenPayload.sub,
                }
              },
              displayName: tokenPayload.name,
              givenName: tokenPayload.given_name,
              familyName: tokenPayload.family_name,
            }
          ],
          emailAddresses: [
            {
              type: '',
              value: tokenPayload.email,
            }
          ],
          photos: [
            {
              url: tokenPayload.picture,
            }
          ]
        } 
      };
    }
    catch (err) {
      log.error(`Parse token error ${err}`);
      return { 
        tokens, 
        profile: {
          names: [
            {
              displayName: 'unknown',
            }
          ],
          emailAddresses: [
            {
              type: '',
              value: 'unknown',
            }
          ]
        } 
      };
    };
  }
}
