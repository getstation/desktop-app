import { Button, Size } from '@getstation/theme';
//import { remote } from 'electron';
import { shell as remoteShell } from '@electron/remote';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';

export interface Classes {
  container: string,
  item: string,
  title: string,
  settingName: string,
  button: string,
}

export interface Props {
  classes?: Classes,
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
  button: {
    marginTop: 10,
  },
};

@injectSheet(styles)
export default class SettingsOpenSourceInfo extends React.PureComponent<Props, {}> {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes!.container}>
        <div className={classes!.item}>
          <p className={classes!.settingName}>open source info</p>
          <label>
            This software is maintained by the open source community. If you’re a developer and want to contribute, check our Github.
          </label>
          <p>
            <Button
              onClick={() => remoteShell.openExternal('https://github.com/getstation/desktop-app')}
              className={classes!.button}
              btnSize={Size.XXSMALL}
            >
              Open Github
            </Button>
          </p>
        </div>
      </div>
    );
  }
}
