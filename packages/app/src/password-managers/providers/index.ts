import { Providers } from '../types';
import onePasswordRuntime from './onePassword/runtime';
import onePasswordForm from './onePassword/form';

const providers: Providers = {
  onePassword: {
    id: 'onePassword',
    name: '1Password',
    idKey: 'domain',
    masterPasswordKey: 'masterPassword',
    runtime: onePasswordRuntime,
  },
};

export const ProvidersForm = {
  onePassword: onePasswordForm,
};

export default providers;
