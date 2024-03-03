import { ChooserItem, ChooserItemStyle } from '@getstation/theme';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';

export interface Classes {
}

export interface Props {
  classes?: Classes,
  passwordManagers: any[],
  onLogout: (passwordManager: object) => void,
}

export interface State {
}

export interface OverridableProps {
}

const styles = () => ({
});

@injectSheet(styles)
export default class ListPasswordManagers extends React.PureComponent<Props & OverridableProps, State> {
  render() {
    const { passwordManagers, onLogout } = this.props;

    return (
      <ul>
        { passwordManagers.map(passwordManager => {
          const { providerName, email } = passwordManager;

          return (
            <ChooserItem
              style={ChooserItemStyle.SECONDARY}
              key={passwordManager.email}
              item={{
                title: providerName,
                description: email,
                value: '',
              }}
              onSelect={() => onLogout(passwordManager)}
              selectText={'Logout'}
            />
          );
        }) }
      </ul>
    );
  }
}
