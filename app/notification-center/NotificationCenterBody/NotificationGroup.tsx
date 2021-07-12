import { Icon, IconSymbol } from '@getstation/theme';
import Maybe from 'graphql/tsutils/Maybe';
import * as Immutable from 'immutable';
import * as React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { oc } from 'ts-optchain';
import AppIcon from '../../dock/components/AppIcon';
import { getNotificationId } from '../../notifications/get';
import { ImmutableNotification } from '../../notifications/types';
import NotificationItem from '../components/NotificationItem';
import { withGetApplication } from '../queries@local.gql.generated';

type InjectedProps = {
  applicationName: Maybe<string>,
  icon: Maybe<string>,
  badge: Maybe<string>,
  themeColor?: Maybe<string>,
  label: Maybe<string>,
  loading?: boolean,
};

type OwnProps = {
  icon: string,
  applicationId?: string,
  notifications: Immutable.List<ImmutableNotification>,
  onNotificationClick: (notificationId: string) => void,
  markAsRead: (notificationId: string) => void,
  toggleVisibility: () => void,
};

export type Props = OwnProps & InjectedProps;

class NotificationGroup extends React.PureComponent<Props> {
  markAsReadGroup = () => {
    this.props.notifications.forEach((notification: ImmutableNotification) => {
      this.props.markAsRead(getNotificationId(notification));
    });
  }

  render() {
    const { loading, notifications, icon, themeColor, badge, applicationName, label } = this.props;

    if (loading) return null;

    return (
      <div
        className="l-notification-group"
      >
        <div className="l-notification-group__title">
          <div className="l-notification-item__image-wrapper">
            <AppIcon
              imgUrl={icon!}
              themeColor={themeColor!}
            />
            {badge &&
            <span className="l-dock__app__acco  unt">
                    <span style={{ backgroundImage: `url(${badge})` }}/>
                  </span>
            }
          </div>
          <span className="l-notification-group__title-text">
                  <span>{applicationName}</span>
                  <small>{label}</small>
                </span>
          <span className="l-notification-group__title-actions">
                  <Icon
                    symbolId={IconSymbol.MARK_READ}
                    size={24}
                    onClick={this.markAsReadGroup}
                    color="white"
                  />
                </span>
        </div>
        <TransitionGroup>
          {notifications.toSeq().map((notification: ImmutableNotification) =>
            <CSSTransition
              key={getNotificationId(notification)}
              classNames="notification"
              timeout={{ enter: 500, exit: 300 }}
            >
              <NotificationItem
                notification={notification}
                markAsRead={this.props.markAsRead}
                onNotificationClick={this.props.onNotificationClick}
                toggleVisibility={this.props.toggleVisibility}
              />
            </CSSTransition>
          )
          }
        </TransitionGroup>
      </div>
    );
  }
}

const connector = withGetApplication<OwnProps, InjectedProps>({
  options: (props) => ({ variables: { applicationId: props.applicationId! } }),
  props: ({ data, ownProps }) => {
    const application = oc(data).application;
    const manifest = application.manifestData;

    return {
      loading: !data || data.loading,
      applicationName: manifest.name(),
      icon: manifest.interpretedIconURL() || ownProps.icon,
      badge: application.iconURL(),
      label: manifest.bx_multi_instance_config.instance_wording(),
      themeColor: manifest.theme_color(),
    };
  },
});

const ConnectedNotificationGroup = connector(NotificationGroup);

const NotificationGroupManager = (props: Props) => {
  if (props.applicationId) {
    return (
      <ConnectedNotificationGroup
        icon={props.icon}
        applicationId={props.applicationId}
        notifications={props.notifications}
        onNotificationClick={props.onNotificationClick}
        markAsRead={props.markAsRead}
        toggleVisibility={props.toggleVisibility}
      />
    );
  }
  return (
    <NotificationGroup
      icon={props.icon}
      notifications={props.notifications}
      onNotificationClick={props.onNotificationClick}
      markAsRead={props.markAsRead}
      toggleVisibility={props.toggleVisibility}
      applicationName={props.applicationName}
      badge={props.badge}
      label={props.label}
      loading={false}
      themeColor={props.themeColor}
    />
  );
};

export default NotificationGroupManager;
