import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import { compose } from 'redux';

import { Modal, ThemeTypes } from '@getstation/theme';
import { oc } from 'ts-optchain';
import { withGetApplicationById } from '../queries@local.gql.generated';

export interface Classes {
  modalBody: string,
  body: string,
  note: string,
  sampleSettingNotifications: string,
}

export interface InjectedProps {
  loading: boolean | null,
  applicationName: string,
  applicationIcon: string,
  themeColor: string,
}

export interface OwnProps {
  applicationId: string,
  classes?: Classes,
  onContinue: () => void,
  onCancel: () => void,
}

export type Props = InjectedProps & OwnProps;

@injectSheet((theme: ThemeTypes) => ({
  modalBody: {
    paddingBottom: '10px !important',
  },
  body: {
    textAlign: 'center',
  },
  note: {
    color: theme.colors.gray.middle,
  },
  sampleSettingNotifications: {
    margin: '15px',
  },
}))
class AskAuthorizeNotificationsApplicationView extends React.PureComponent<Props> {
  render() {
    const { classes, applicationName, applicationIcon, themeColor, loading, onContinue, onCancel } = this.props;

    if (loading) return null;

    return (
      <Modal
        title={`🔔 You just received your 1st notification from ${applicationName}`}
        onContinue={onContinue}
        continueContent={'Yes, I need those'}
        onCancel={onCancel}
        cancelContent={'No, let me focus'}
        applicationIcon={applicationIcon}
        themeColor={themeColor}
        onClickOutside={onContinue}
        classNameModalBody={classes!.modalBody}
      >
        <div className={classes!.body}>
          <p>Would you like to allow {applicationName} to send you more ?</p>
        <br/>
        <p className={classes!.note}>This can be changed later in the app’s menu by hovering over the app icon.</p>
        <img className={classes!.sampleSettingNotifications} src="static/illustrations/illustrations--notifications.svg"/>
        </div>
      </Modal>
    );
  }
}

const connector = compose(
  withGetApplicationById<OwnProps, InjectedProps>({
    options: (props) => ({ variables: { applicationId: props.applicationId } }),
    props: ({ data }) => ({
      loading: !data || data.loading,
      applicationName: oc(data).application.manifestData.name()!,
      applicationIcon: oc(data).application.manifestData.interpretedIconURL()!,
      themeColor: oc(data).application.manifestData.theme_color()!,
    }),
  }),
);

export default connector(AskAuthorizeNotificationsApplicationView);
