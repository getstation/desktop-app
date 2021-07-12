import { Button, Size } from '@getstation/theme';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';

export interface Classes {
  container: string,
  item: string,
  title: string,
  settingName: string,
  checkbox: string,
  label: string,
  button: string,
}

export interface Props {
  classes?: Classes,
  onClickOpenProcessManager: () => void,
}

const styles = {
  container: {
    maxWidth: '600px',
    paddingTop: '10px',
    paddingBottom: '10px',
  },
  item: {
  },
  settingName: {
    marginBottom: 8,
    textTransform: 'uppercase',
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkbox: {
    '-webkit-appearance': 'checkbox',
    marginRight: 10,
    marginBottom: 20,
    borderRadius: 2,
    width: 14,
    height: 14,
  },
  label: {
  },
  button: {
    marginTop: 10,
  },
};

@injectSheet(styles)
export default class SettingsDeveloperTools extends React.PureComponent<Props, {}> {
  render() {
    const { classes, onClickOpenProcessManager } = this.props;

    return (
      <div className={classes!.container}>
        <div className={classes!.item}>
          <p className={classes!.settingName}>developer tools</p>
          <Button
            onClick={() => onClickOpenProcessManager()}
            className={classes!.button}
            btnSize={Size.XXSMALL}
          >
            Open Process Manager
          </Button>
        </div>
      </div>
    );
  }
}
