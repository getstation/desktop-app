import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import { Provider } from '../types';
import { ProvidersForm } from '../providers';
import { AddPasswordManagerAction, ConfigurationStep } from '../duck';

export interface Classes {
}

export interface Props {
  classes?: Classes,
  provider: Provider,
  configurationProcess: AddPasswordManagerAction,
  onConnect: (provider: Provider, payload: object) => any,
  onCancel?: (provider: Provider) => any,
}

export interface OverridableProps {
}

const styles = () => ({
});

@injectSheet(styles)
export default class ConfigurePasswordManager extends React.PureComponent<Props & OverridableProps, {}> {
  render() {
    const {
      provider,
      configurationProcess,
      onConnect,
      onCancel,
    } = this.props;

    const ProviderForm = ProvidersForm[provider.id];
    const error = configurationProcess.step === ConfigurationStep.Error ? configurationProcess.payload : null;

    return (
      <ProviderForm
        configurationProcess={configurationProcess}
        onConnect={onConnect}
        onCancel={onCancel}
        error={error}
      />
    );
  }
}
