import { Button, Style } from '@getstation/theme';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import { Provider } from '../types';

export interface Classes {
  button: string,
}

export interface Props {
  classes?: Classes,
  providers: Provider[],
  onAdd: (provider: Provider) => void,
}

export interface State {
}

export interface OverridableProps {
}

const styles = () => ({
  button: {
    width: '100%',
  },
});

@injectSheet(styles)
export default class AddPasswordManager extends React.PureComponent<Props & OverridableProps, State> {

  render() {
    const { classes, providers, onAdd } = this.props;

    const passwordManagers = providers.map((provider) => {
      const { id, name } = provider;

      return (
        <Button
          key={id}
          onClick={() => onAdd(provider)}
          btnStyle={Style.SECONDARY}
          className={classes!.button}
        >
          Connect {name}
        </Button>
      );
    });

    return (
      <div>
        {passwordManagers}
      </div>
    );
  }
}
