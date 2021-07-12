import * as React from 'react';
import injectSheet from 'react-jss';
import * as _ from 'lodash';
import * as classNames from 'classnames';
import AppStoreApplication from '@src/components/AppStoreContent/AppStoreApplicationItem/AppStoreApplication';
import { ContextEnvPlatform } from '@src/app';
import { allAppsCategoriesList } from '@src/shared/constants/constants';
import AppStorePageCategoryTitle
  from '@src/components/AppStoreContent/AppStorePageCategoryTitle/AppStorePageCategoryTitle';
import AppStorePreloader from '@src/components/AppStorePreloader/AppStorePreloader';

import styles, { AppStoreAllAppsListClasses } from './styles';
import { MinimalApplication } from '../../../../../app/applications/graphql/withApplications';
export interface AppStoreAllAppsProps {
  classes?: AppStoreAllAppsListClasses,
  categoryName: string,
  applicationsByCategory: Record<string, MinimalApplication[]>,
  appStoreContext: number,
  prevCategoryName: string,
  nextCategoryName: string,
  isPrevButtonShowed: boolean,
  isNextButtonShowed: boolean,
  onPrevCategory: () => void,
  onNextCategory: () => void,
  smoothScrollToTop: () => void,
  onAddApplication: (applicationId: string, manifestURL: string) => any,
}

@injectSheet(styles)
class AppStoreAllAppsList extends React.PureComponent<AppStoreAllAppsProps> {
  render() {
    const {
      classes,
      categoryName,
      appStoreContext,
      prevCategoryName,
      nextCategoryName,
      isPrevButtonShowed,
      isNextButtonShowed,
      onAddApplication,
      onPrevCategory,
      onNextCategory,
      smoothScrollToTop,
      applicationsByCategory,
    } = this.props;

    const apps = applicationsByCategory[categoryName] || [];

    const alternate = (appStoreContext !== ContextEnvPlatform.Browser);
    const renderPageContent = apps && !!apps.length;
    const currentCategory = allAppsCategoriesList.find(category => category.title === categoryName);

    return (
      <React.Fragment>
        {!renderPageContent ?
          <AppStorePreloader isAnimationStopped={!!renderPageContent}/>
          :
          <div className={classes!.container}>
            <AppStorePageCategoryTitle
              title={categoryName}
              iconUrl={`/static/all-apps-sprite.svg${currentCategory && currentCategory.icon}`}
            />

            <ul className={classes!.resultsContent}>
              {apps && apps.map(app => {
                return <AppStoreApplication
                  key={app.id}
                  application={app}
                  isExtension={app.isChromeExtension}
                  appStoreContext={appStoreContext}
                  alternate={alternate}
                  onAddApplication={onAddApplication}
                  marginBottom={20}
                  isCategoryNameDisplayed={false}
                />;
              })}
            </ul>

            {!!apps && !!apps.length &&
            <div className={classes!.resultsNav}>
              {<div
                className={classNames(
                  classes!.resultsNavPrevCategoryBtn,
                  { isHidden: !isPrevButtonShowed }
                )}
                onClick={onPrevCategory}
              >
                {prevCategoryName}
              </div>}
              <div className={classes!.resultsNavScrollBtnContainer} onClick={smoothScrollToTop}>
                <svg className={classes!.resultNavScrollBtnIcon}>
                  <use xlinkHref={`/static/all-apps-sprite.svg#i--scroll-to-top`}/>
                </svg>
              </div>
              {<div
                className={classNames(
                  classes!.resultsNavNextCategoryBtn,
                  { isHidden: !isNextButtonShowed }
                )}
                onClick={onNextCategory}
              >
                {nextCategoryName}
              </div>}
            </div>
            }
          </div>
        }
      </React.Fragment>
    );
  }
}

export default AppStoreAllAppsList;
