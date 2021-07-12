import { Icon, IconSymbol } from '@getstation/theme';
import * as classNames from 'classnames';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import {
  getNotificationBody,
  getNotificationDateFromNow,
  getNotificationId,
  getNotificationTitle,
  isNotificationFull,
} from '../../notifications/get';
import { ImmutableNotification } from '../../notifications/types';

export interface Classes {
  item: string,
  markAsReadIcon: string,
  iconWrapper: string,
}

export interface Props {
  classes?: Classes,
  notification: ImmutableNotification,
  markAsRead(notificationId: string): void,
  toggleVisibility(): any,
  onNotificationClick(notificationId: string): void
}

@injectSheet({
  iconWrapper: {
    display: 'inline-block',
    width: 24,
    height: 24,
  },
  markAsReadIcon: {
    visibility: 'hidden',
    borderRadius: '50%',
    '&:hover': {
      fill: 'white !important',
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
  },
  item: {
    '&:hover $markAsReadIcon': {
      visibility: 'visible',
    },
  },
})
class NotificationItem extends React.PureComponent<Props, {}> {

  handleClickMarkAsRead = (e: React.MouseEvent<any>) => {
    const notificationId = getNotificationId(this.props.notification);
    e.stopPropagation();
    e.preventDefault();
    this.props.markAsRead(notificationId);
  }

  handleClick = () => {
    const notificationId = getNotificationId(this.props.notification);
    this.props.onNotificationClick(notificationId);
    this.props.toggleVisibility();
  }

  render() {
    const { notification, classes } = this.props;
    const body = getNotificationBody(notification);

    return (
      <div
        className={classNames(
          classes!.item,
          'l-notification-item',
          { 'l-notification-item-compact': !isNotificationFull(notification) })
        }
        onClick={this.handleClick}
      >
        <div className="l-notification-item__container">
          <div className="l-notification-item__content">
            <span className="l-notification-item__title">
              {getNotificationTitle(notification)}
            </span>
            {body &&
              `— ${body}`
            }
          </div>

          <div className="l-notification-item__footer">
            <span>{getNotificationDateFromNow(notification)}</span>
          </div>
        </div>
        <span className={classes!.iconWrapper}>
          <Icon
            className={classes!.markAsReadIcon}
            symbolId={IconSymbol.CHECKMARK}
            onClick={this.handleClickMarkAsRead}
            size="24px"
            color={'rgba(255, 255, 255, 0.6)'}
          />
        </span>
      </div>
    );
  }
}

export default NotificationItem;
