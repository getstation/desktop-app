import * as React from 'react';
import injectSheet from 'react-jss';

import styles, { AppStorePageCategoryTitleClasses } from './styles';

export interface AppStorePageCategoryTitleProps {
  classes?: AppStorePageCategoryTitleClasses,
  title: string,
  subTitle?: string,
  iconUrl?: string,
}

@injectSheet(styles)
class AppStorePageCategoryTitle extends React.PureComponent<AppStorePageCategoryTitleProps, {}> {

  render() {
    const { classes, title, subTitle, iconUrl } = this.props;

    return (
      <React.Fragment>
        <div className={classes!.categoryTitle}>
          {!!iconUrl && <svg className={classes!.categoryIcon}>
            <use xlinkHref={iconUrl}/>
          </svg>}
          <div className={classes!.categoryName}>{title}</div>
        </div>
        {!!subTitle && <div className={classes!.categorySubtitle}>{subTitle}</div>}
      </React.Fragment>
    );
  }
}

export default AppStorePageCategoryTitle;
