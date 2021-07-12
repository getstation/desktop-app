import onePassword from './providers/onePassword/type';

export type Account = {
  id: string,
  title: string,
  username: string,
  password?: string,
  avatar?: string,
};

export interface IProviderRuntime {
  setSession(credentials: object): void,
  hasValidSession(): boolean,
  isValidCredentials(credentials: object): Promise<boolean>,
  getAccounts(): Promise<Account[]>,
  getAccountById(id: string): Promise<Account>,
}

export type ProviderRuntime = IProviderRuntime;

export type Provider = {
  id: string,
  name: string,
  idKey: string,
  masterPasswordKey: string,
};

export type ProviderWithRuntime = Provider & {
  runtime: ProviderRuntime,
};

export type Providers = {
  [id: string]: ProviderWithRuntime,
};

export type PasswordManager = {
  providerId: string,
  providerName: string,
  id: string,
  email: string,
} & onePassword;
