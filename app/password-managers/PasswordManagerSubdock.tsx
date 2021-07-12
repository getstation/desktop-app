import * as Immutable from 'immutable';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { ThemeTypes as Theme } from '@getstation/theme';
import AddPasswordManager from './components/AddPasswordManager';
import ConfigurePasswordManager from './components/ConfigurePasswordManager';
import ListPasswordManagers from './components/ListPasswordManagers';
import { addPasswordManager, AddPasswordManagerAction, ConfigurationStep, removePasswordManager } from './duck';
import Providers from './providers/';
import { getConfigurationProcess, getPasswordManager, getProviderJS } from './selectors';
import { PasswordManager, Provider } from './types';

interface Classes {
  container: string,
  title: string,
}

export interface Props {
  classes?: Classes,
  configurationProcess: AddPasswordManagerAction,
  canConfigure: boolean,
  canAddPasswordManager: boolean,
  passwordManagers: any,
  provider: Provider,
  onConnect: (provider: Provider, payload: object) => void,
  onCancel: (provider: Provider) => void,
  onLogout: (passwordManager: object) => void,
  onAdd: (provider: Provider) => void,
}

export interface OverridableProps {
}

@injectSheet((theme: Theme) => ({
  container: {
    padding: 20,
    borderTop: '1px solid rgba(255, 255, 255, .1)',
  },
  title: {
    ...theme.fontMixin(12, 'bold'),
    marginBottom: 15,
  },
}))
class PasswordManagerSubdockImpl extends React.PureComponent<Props & OverridableProps, {}> {
  render() {
    const {
      classes,
      canConfigure,
      configurationProcess,
      canAddPasswordManager,
      passwordManagers,
      provider,
      onConnect,
      onCancel,
      onLogout,
      onAdd,
    } = this.props;

    const providers = Object.values(Providers);

    return (
      <div className={classes!.container}>
        <div className={classes!.title}>Password Managers</div>

        { canConfigure &&
        <ConfigurePasswordManager
          provider={provider}
          configurationProcess={configurationProcess}
          onConnect={onConnect}
          onCancel={onCancel}
        />
        }

        <ListPasswordManagers passwordManagers={passwordManagers} onLogout={onLogout} />

        { canAddPasswordManager &&
          <AddPasswordManager providers={providers} onAdd={onAdd} />
        }
      </div>
    );
  }
}

const PasswordManagerSubdock = connect<any, any, OverridableProps>(
  (state: Immutable.Map<string, any>) => ({
    configurationProcess: getConfigurationProcess(state),
    canConfigure: getConfigurationProcess(state).step !== ConfigurationStep.NotStarted,
    canAddPasswordManager: getConfigurationProcess(state).step === ConfigurationStep.NotStarted && !getPasswordManager(state),
    passwordManagers: getPasswordManager(state) ? [getPasswordManager(state)] : [],
    provider: getProviderJS(state),
  }),
  (dispatch: Dispatch<any>) => bindActionCreators({
    onLogout: (passwordManager: PasswordManager) => removePasswordManager({ passwordManager }),
    onAdd: provider => addPasswordManager({
      step: ConfigurationStep.Credentials,
      provider,
    }),
    onConnect: (provider, credentials) => addPasswordManager({ step: ConfigurationStep.Test, provider, payload: credentials }),
    onCancel: provider => addPasswordManager({
      step: ConfigurationStep.Cancel,
      provider,
    }),
  }, dispatch)
)(PasswordManagerSubdockImpl);

export default PasswordManagerSubdock;
