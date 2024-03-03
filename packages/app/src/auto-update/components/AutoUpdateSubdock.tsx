import { Button, ThemeTypes as Theme } from '@getstation/theme';
import * as remote from '@electron/remote';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';

const releaseNotesHTML = require('!!raw-loader!../../app/resources/release-notes.html').default;

export interface Classes {
  container: string,
  header: string,
  logo: string,
  title: string,
  description: string,
  body: string,
  content: string,
  newVersion: string,
}

export interface Props {
  classes?: Classes,
  updateAvailable: boolean,
  releaseName: string,
  onClickQuitAndInstall: () => any,
}

const styles = (theme: Theme) => ({
  container: {
    position: 'relative',
  },
  header: {
    padding: 20,
    borderBottom: '1px solid rgba(255, 255, 255, .1)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  logo: {
    width: 40,
  },
  title: {
    marginTop: 30,
    ...theme.fontMixin(23),
  },
  description: {
    opacity: .4,
  },
  body: {
    padding: 20,
    '& button': {
      width: '100%',
      marginTop: 20,
    },
  },
  content: {
    '& h2': {
      margin: [10, 0],
      ...theme.fontMixin(13, 'bold'),
      color: 'rgba(255, 255, 255, .4)',
      textTransform: 'uppercase',
    },
    '& ul': {
      marginBottom: 40,
    },
    '& li': {
      listStyleType: 'disc',
      marginLeft: 18,
      ...theme.fontMixin(13),
      marginBottom: 5,
    },
  },
  newVersion: {
    fontWeight: 600,
    fontSize: 13,
    textAlign: 'center',
  },
});

@injectSheet(styles)
export default class AutoUpdateSubdock extends React.PureComponent<Props, {}> {
  render() {
    const { classes, updateAvailable, releaseName, onClickQuitAndInstall } = this.props;

    return (
      <div className={classes!.container}>
        <div className={classes!.header}>
          <img className={classes!.logo} src="static/illustrations/illustration--updates.svg" alt="" />
          <h1 className={classes!.title}>What's new on {remote.app.name}?</h1>
          <p className={classes!.description}>
            You're now on version {remote.app.getVersion()}
          </p>
        </div>

        <div className={classes!.body}>
          { updateAvailable ?
            <div className={classes!.newVersion}>
              <p>A new version is available 🎉</p>
              <p>({releaseName})</p>
              <Button
                onClick={onClickQuitAndInstall}
              >
                Quit to install the latest version
              </Button>
            </div>
            :
            <div className={classes!.content} dangerouslySetInnerHTML={{ __html: releaseNotesHTML }} />
          }
        </div>
      </div>
    );
  }
}
