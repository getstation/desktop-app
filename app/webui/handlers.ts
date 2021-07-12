import multiInstanceConfigurator from '../applications/multi-instance-configuration/webui/handler';
import appstore from '../../appstore/handler';
import { ProtocolHandler } from './types';

export default [
  multiInstanceConfigurator,
  appstore,
] as ProtocolHandler[];
