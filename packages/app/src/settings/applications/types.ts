import * as Immutable from 'immutable';

/****** Selector related types ******/

export type PasswordManagerLink = {
  instanceId: string,
  providerId: string,
};

export type Extension = {
  id: string,
  manifestURL: string,
  name: string,
  added: boolean,
  iconUrl: string,
};

export type Instance = {
  id: string,
  name: string,
  logoUrl: string,
  needConfiguration: boolean,
  passwordManagerLink?: PasswordManagerLink,
};

export type Instances = Immutable.Iterable<number, Instance>;
