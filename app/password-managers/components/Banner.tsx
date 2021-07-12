import { Button, Icon, IconSymbol, Size, Style, ThemeTypes as Theme } from '@getstation/theme';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import { PasswordManager, Provider } from '../types';

export interface Classes {
  container: string,
  headline: string,
  button: string,
  close: string,
}

export interface Props {
  classes?: Classes,
  applicationName: string,
  applicationId: string,
  passwordManager: PasswordManager,
  provider: Provider,
  onAddPasswordManager: () => void,
  onAttachPasswordManagerItem: () => void,
  onClose: () => void,
}

const styles = (theme: Theme) => ({
  container: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    boxSizing: 'border-box',
    padding: [20, 0],
    ...theme.fontMixin(13),
    color: 'rgba(0, 0, 0, .3)',
    backgroundColor: 'white',
    textAlign: 'center',
    boxShadow: '0 0 0 1px rgba(41,41,41,0.1), 0 0 40px 0 rgba(41,41,41,0.3)',
    zIndex: 3,
  },
  button: {
    marginLeft: 10,
  },
  close: {
    position: 'absolute',
    top: 5,
    right: 5,
    cursor: 'pointer',
    opacity: .3,
  },
});

@injectSheet(styles)
export default class Banner extends React.PureComponent<Props, {}> {
  render() {
    const {
      classes, applicationName, provider, passwordManager, onAddPasswordManager,
      onAttachPasswordManagerItem, onClose,
    } = this.props;

    const onClick = passwordManager ? onAttachPasswordManagerItem : onAddPasswordManager;

    return (
      <div className={classes!.container}>
        Do you want to auto fill {applicationName} credentials with {passwordManager ? provider.name : 'a password manager'}?

        <Button className={classes!.button} onClick={onClick} btnSize={Size.XSMALL} btnStyle={Style.TERTIARY}>
          Fill with {passwordManager ? provider.name : 'your password manager'}
        </Button>

        <span className={classes!.close} onClick={onClose}>
          <Icon symbolId={IconSymbol.CROSS} size={25} color={'#000'} />
        </span>
      </div>
    );
  }
}
