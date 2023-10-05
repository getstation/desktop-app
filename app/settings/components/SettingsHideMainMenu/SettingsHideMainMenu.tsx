import { Switcher } from '@getstation/theme';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import { compose } from 'redux';
import { withGetHideMainMenuStatus, withEnableHideMainMenu } from './queries@local.gql.generated';

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
  isHideMainMenu: boolean,
  onHideMainMenu: (hide: boolean) => any
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
class SettingsHideMainMenu extends React.Component<Props, {}> {
  render() {
    const { classes, loading, isHideMainMenu } = this.props;

    const handleSwitcherChange = (e: React.ChangeEvent<HTMLInputElement>) =>
      this.props.onHideMainMenu(e.target.checked);
    return (
      <div className={classes!.container}>
        <div className={classes!.item}>
          <p className={classes!.settingName}>main menu</p>
          <Switcher
            disabled={loading} // if no data yet we disable
            checked={isHideMainMenu}
            onChange={handleSwitcherChange}
          />
          <div className={classes!.label}>
            Hide main menu
          </div>
        </div>
      </div>
    );
  }
}

const connect = compose(
  withGetHideMainMenuStatus({
    props: ({ data }) => ({
      loading: !data || data.loading,
      isHideMainMenu: !!data && Boolean(data.hideMainMenu),
    }),
  }),
  withEnableHideMainMenu({
    props: ({ mutate }) => ({
      onHideMainMenu: (hide: boolean) => mutate && mutate({ variables: { hide } }),
    }),
  }),
);

export default connect(SettingsHideMainMenu);
