import * as React from 'react';
import injectSheet from 'react-jss';

export interface Props {
  classes?: any,
  handleClick: () => any,
  duration: string
}

@injectSheet((theme: any) => ({
  item: {
    color: theme.colors.gray.middle,
    fontSize: '12px',
    transition: 'all 250ms ease-in-out',
    cursor: 'pointer',
    '&:hover': {
      color: theme.colors.gray.dark,
    },
    margin: [4, 0],
  },
}))
class NotificationCenterSnoozePanelItem extends React.PureComponent<Props, {}> {

  render() {
    const { classes } = this.props;
    return (
      <li className={classes.item}>
        <a onClick={this.props.handleClick}>
          {this.props.duration}
        </a>
      </li>
    );
  }
}

export default NotificationCenterSnoozePanelItem;
