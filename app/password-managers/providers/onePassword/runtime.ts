import {
  getItem,
  getItems,
  getSessionToken,
  isValidSession,
  LoginItem,
  Session,
} from '1password-node';
import { remote } from 'electron';
import { join } from 'path';

import { logger } from '../../../api/logger';
import {
  Account,
  IProviderRuntime,
  ProviderRuntime,
} from '../../types';
import Abstract from '../abstract/runtime';

const binaryFolderPath = join(remote.app.getPath('userData'), 'Resources', '1PasswordCLI', 'op');

class OnePassword extends Abstract implements IProviderRuntime {
  private session: Session;

  public async setSession(credentials: any) {
    this.session = await getSessionToken(credentials, binaryFolderPath);
  }

  public hasValidSession() {
    if (!this.session) return false;

    return isValidSession(this.session);
  }

  public async isValidCredentials(credentials: object) {
    try {
      await this.setSession(credentials);
      return true;
    } catch (e) {
      logger.notify(e);
      return false;
    }
  }

  public async getAccounts() {
    const accounts = await getItems(this.session);

    return await Promise.all(accounts
      .map(async (account: any) => {
        return {
          id: account.uuid,
          title: `${account.title} — ${account.vault.name}`,
          username: account.username,
          avatar: account.vault.avatarUrl,
        };
      }));
  }

  public async getAccountById(id: string): Promise<Account> {
    const account = await getItem(this.session, id) as LoginItem;

    return {
      id: account.uuid,
      title: `${account.title} — ${account.vault.name}`,
      username: account.username,
      password: account.password,
      avatar: account.vault.avatarUrl,
    };
  }
}

export default <ProviderRuntime>new OnePassword();
