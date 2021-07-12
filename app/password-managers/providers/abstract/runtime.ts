import { URL } from 'url';

export default abstract class PasswordManager {

  protected static getOrigin(url: string) {
    return new URL(url).hostname;
  }
}
