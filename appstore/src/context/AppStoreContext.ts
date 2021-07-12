import * as React from 'react';

import { ContextEnvPlatform } from './types';

export const AppStoreContext = React.createContext<ContextEnvPlatform | undefined>(undefined);
