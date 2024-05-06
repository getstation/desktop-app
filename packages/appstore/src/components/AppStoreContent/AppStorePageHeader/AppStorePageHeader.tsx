import * as React from 'react';
import injectSheet from 'react-jss';

import styles, { AppStorePageHeaderClasses } from './styles';

export interface AppStorePageHeaderProps {
  classes?: AppStorePageHeaderClasses,
  title: string,
  subTitle: string,
  isIconDisplayed?: boolean,
  iconUrl?: string,
}

@injectSheet(styles)
class AppStorePageHeader extends React.PureComponent<AppStorePageHeaderProps, {}> {

  render() {
    const { classes, title, subTitle, iconUrl, isIconDisplayed = false } = this.props;

    return (
      <div className={classes!.pageHeader}>
        <div className={classes!.content}>
          {isIconDisplayed &&
            <div className={classes!.iconContainer}>
              <img className={classes!.icon} src={iconUrl} alt="Logo"/>
            </div>}
          <div className={classes!.description}>
            <h1 className={classes!.title}>{title}</h1>
            <div className={classes!.subTitle}>{subTitle}</div>
          </div>
        </div>
        <div>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default AppStorePageHeader;
