import { Switcher } from '@getstation/theme';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import { compose } from 'redux';
import { withGetMinimizeToTrayStatus, withEnableMinimizeToTray } from './queries@local.gql.generated';

export interface Classes {
  container: string,
  item: string,
  title: string,
  settingName: string,
  checkbox: string,
  label: string,
}

export interface Props {
  classes?: Classes
  isMinimizeToTray: boolean,
  onMinimizeToTray: (enabled: boolean) => any
  loading: boolean,
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
};

@injectSheet(styles)
class SettingsMinimizeToTray extends React.Component<Props, {}> {
  render() {
    const { classes, loading, isMinimizeToTray } = this.props;

    const handleSwitcherChange = (e: React.ChangeEvent<HTMLInputElement>) =>
      this.props.onMinimizeToTray(e.target.checked);
    return (
      <div className={classes!.container}>
        <div className={classes!.item}>
          <p className={classes!.settingName}>TRAY ICON</p>
          <Switcher
            disabled={loading} // if no data yet we disable
            checked={isMinimizeToTray}
            onChange={handleSwitcherChange}
          />
          <div className={classes!.label}>
            Minimize application to tray
          </div>
        </div>
      </div>
    );
  }
}

const connect = compose(
  withGetMinimizeToTrayStatus({
    props: ({ data }) => ({
      loading: !data || data.loading,
      isMinimizeToTray: !!data && Boolean(data.minimizeToTray),
    }),
  }),
  withEnableMinimizeToTray({
    props: ({ mutate }) => ({
      onMinimizeToTray: (enabled: boolean) => mutate && mutate({ variables: { enabled } }),
    }),
  }),
);

export default connect(SettingsMinimizeToTray);
