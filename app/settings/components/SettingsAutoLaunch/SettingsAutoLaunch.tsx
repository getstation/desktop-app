import { Switcher } from '@getstation/theme';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import { compose } from 'redux';
import { withGetAutolaunchStatus, withEnableAutoLaunch } from './queries@local.gql.generated';

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
  isAutoLaunchEnabled: boolean,
  onEnableAutoLaunch: (enabled: boolean) => any
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
class SettingsAutoLaunch extends React.Component<Props, {}> {
  render() {
    const { classes, loading, isAutoLaunchEnabled } = this.props;

    const handleSwitcherChange = (e: React.ChangeEvent<HTMLInputElement>) =>
      this.props.onEnableAutoLaunch(e.target.checked);
    return (
      <div className={classes!.container}>
        <div className={classes!.item}>
          <p className={classes!.settingName}>auto launch</p>
          <Switcher
            disabled={loading} // if no data yet we disable
            checked={isAutoLaunchEnabled}
            onChange={handleSwitcherChange}
          />
          <div className={classes!.label}>
            Launch Station on login
          </div>
        </div>
      </div>
    );
  }
}

const connect = compose(
  withGetAutolaunchStatus({
    props: ({ data }) => ({
      loading: !data || data.loading,
      isAutoLaunchEnabled: !!data && Boolean(data.autoLaunchEnabled),
    }),
  }),
  withEnableAutoLaunch({
    props: ({ mutate }) => ({
      onEnableAutoLaunch: (enabled: boolean) => mutate && mutate({ variables: { enabled } }),
    }),
  }),
);

export default connect(SettingsAutoLaunch);
