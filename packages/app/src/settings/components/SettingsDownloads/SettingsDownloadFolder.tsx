import { Switcher, Button, Size, ThemeTypes as Theme } from '@getstation/theme';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import { compose } from 'redux';
import { isDarwin } from '../../../utils/process';
import { withGetPromptDownloadStatus, withEnablePromptDownload } from './queries@local.gql.generated';

export interface Classes {
  container: string,
  settingName: string,
  button: string,
  label: string,
  downloadFolderSection: string,
  downloadFolderVal: string,
  settings: string,
  promptDownloadSection: string,
  settingsValue: string,
}

export type ClassesProps = {
  classes: Classes,
};

export interface QueryProps{
  promptDownloadEnabled: boolean,
}

export interface MutationProps{
  togglePromptDownload: (enabled: boolean) => void,
}

export type OwnProps = {
  onBrowseClick: () => void,
  onDownloadLocationClick: () => void,
  currentDownloadFolder?: string,
};

export type Props = ClassesProps & QueryProps & MutationProps & OwnProps;

const styles = (_theme: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '600px',
    paddingTop: '10px',
    paddingBottom: '10px',
    '& > *': {
      marginBottom: '10px',
    },
  },
  settings:{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'start',
  },
  settingName: {
    marginBottom: 8,
    textTransform: 'uppercase',
    fontSize: 14,
    fontWeight: 'bold',
  },
  label: {
  },
  downloadFolderSection:{
    display: 'flex',
    justifyContent: 'start',
  },
  downloadFolderVal: {
    cursor: 'pointer',
    marginLeft: '10px',
    lineHeight: '18px',
    display: 'inline',
    fontSize: 12,
    opacity: 0.5,
    transition: 'all 250ms ease-out',
    '&:hover': {
      opacity: 0.9,
    },
  },
  promptDownloadSection:{
    display: 'flex',
  },
  settingsValue:{
    marginLeft: 'auto',
  },
  button: {
    float: 'right',
  },
});

@injectSheet(styles)
class SettingsDownloadFolder extends React.PureComponent<Props> {

  render() {
    const { classes, onBrowseClick, currentDownloadFolder, onDownloadLocationClick, promptDownloadEnabled } = this.props;
    const onTogglePromptDownload = (event: React.ChangeEvent<HTMLInputElement>) => this.props.togglePromptDownload(event.target.checked);
    return (
      <section className={classes!.container} >
        <section className={classes!.settings}>
          <p className={classes!.settingName}>downloads</p>
          <section className={classes!.downloadFolderSection}>
            <label className={classes!.label}>Location:</label>
            <code
              title={`Reveal in ${isDarwin ? 'Finder' : 'Explorer'}`}
              className={classes!.downloadFolderVal}
              onClick={onDownloadLocationClick}
            >
              {currentDownloadFolder}
            </code>
            <aside className={classes!.settingsValue}>
              <Button
                onClick={onBrowseClick}
                className={classes!.button}
                btnSize={Size.XXSMALL}
              >
                Change
              </Button>
            </aside>
          </section>
        </section>
        <section className={classes!.promptDownloadSection}>
          <label className={classes!.label}>Ask where to save each file before downloading</label>
          <aside className={classes!.settingsValue}>
            <Switcher checked={promptDownloadEnabled} onChange={onTogglePromptDownload} />
          </aside>
        </section>
      </section>
    );
  }
}

const connect = compose(
  withGetPromptDownloadStatus({
    props:({ data }) => ({
      promptDownloadEnabled: !!data && data.promptDownloadEnabled,
    }),
  }),
  withEnablePromptDownload({
    props:({ mutate }): MutationProps => ({
      togglePromptDownload: (enabled: boolean) => mutate && mutate({ variables: { enabled } }),
    }),
  }),
);

export default connect(SettingsDownloadFolder) as React.ComponentType<OwnProps>;
