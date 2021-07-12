import * as React from 'react';
import * as _ from 'lodash';
import * as classNames from 'classnames';
import injectSheet from 'react-jss';
import AppStoreAllAppsList from '@src/components/AppStoreContent/AppStoreAllAppsList/AppStoreAllAppsList';
import { allAppsCategoriesList } from '@src/shared/constants/constants';
import withBurgerMenuStatus, { WithBurgerMenuStatus } from '@src/HOC/withBurgerMenuStatus';
import { scrollToTop } from '@src/shared/functions/scroll-to-top';

import styles, { AppStoreAllAppsClasses } from './styles';
import { MinimalApplication } from '../../../../../app/applications/graphql/withApplications';

const { flowRight: compose } = _;

export interface AppStoreAllAppsProps {
  classes?: AppStoreAllAppsClasses,
  appStoreContext: number,
  onAddApplication: (applicationId: string, manifestURL: string) => any,
  allCategories: string[],
  applicationsByCategory: Record<string, MinimalApplication[]>,
}

export type AppStoreAllAppsComponentProps = AppStoreAllAppsProps & WithBurgerMenuStatus;

export interface AppStoreAllAppsState {
  selectedCategory?: string | undefined,
  isDropDownOpen?: boolean,
}

class AppStoreAllApps extends React.PureComponent<AppStoreAllAppsComponentProps, AppStoreAllAppsState> {
  constructor(props: AppStoreAllAppsProps) {
    super(props);

    this.state = {
      selectedCategory: _.first(this.props.allCategories),
      isDropDownOpen: false,
    };
  }

  componentDidMount() {
    scrollToTop();
  }

  componentDidUpdate(prevProps: AppStoreAllAppsComponentProps) {
    if (_.isEqual(prevProps, this.props)) {
      return;
    }
    if (this.props.allCategories && this.props.allCategories.length) {
      this.setState({ selectedCategory: _.first(this.props.allCategories) });
    }
    if (prevProps.isBurgerOpen !== this.props.isBurgerOpen && this.props.isBurgerOpen) {
      this.setState({ isDropDownOpen: false });
    }
  }

  getPrevCategoryName = () => {
    const currentCategoryIndex: number = _.indexOf(this.props.allCategories, this.state.selectedCategory);
    return currentCategoryIndex ? this.props.allCategories[currentCategoryIndex - 1] : '';
  }

  getNextCategoryName() {
    const currentCategoryIndex: number = _.indexOf(this.props.allCategories, this.state.selectedCategory);
    return this.props.allCategories[currentCategoryIndex + 1];
  }

  onSelectCategory = (selectedCategory: string) => {
    scrollToTop();
    this.setState({ selectedCategory });
  }

  onPrevCategory = () => {
    const prevCategoryName = this.getPrevCategoryName();
    if (prevCategoryName) {
      scrollToTop();
      this.setState({ selectedCategory: prevCategoryName });
    }
  }

  onNextCategory = () => {
    const nextCategoryName = this.getNextCategoryName();
    if (nextCategoryName) {
      scrollToTop();
      this.setState({ selectedCategory: nextCategoryName });
    }
  }

  smoothScrollToTop = () => {
    window.scroll({ top: 0, left: 0, behavior: 'smooth' });
  }

  toggleMenu = () => {
    this.setState({ isDropDownOpen: !this.state.isDropDownOpen });
  }

  render() {
    const { classes, allCategories, applicationsByCategory, appStoreContext, onAddApplication } = this.props;
    const { selectedCategory } = this.state;
    const renderPageContent = allCategories && !!allCategories.length;
    const isPrevButtonShowed = !!this.getPrevCategoryName();
    const isNextButtonShowed = !!this.getNextCategoryName();

    return (
      <React.Fragment>
        {renderPageContent &&
          <section className={classes!.allAppsSection}>
            <div className={classes!.categoriesContainer}>
              <ul className={classes!.categoriesList}>
                {allCategories.map(categoryName => {
                  const category = allAppsCategoriesList.find(item => item.title === categoryName);
                  return (
                    <li
                      className={classNames(
                        classes!.categoriesItem,
                        { isActive: categoryName === selectedCategory }
                      )}
                      key={categoryName}
                      onClick={() => this.onSelectCategory(categoryName)}
                    >
                      {<svg className={classes!.categoryIcon}>
                        <use xlinkHref={`/static/all-apps-sprite.svg${category && category.icon}`} />
                      </svg>}
                      <div className={classes!.categoryText}>{categoryName}</div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/*Start of the dropdown-menu for categories list that is displayed till 1024px*/}
            <div className={classes!.dropDown} onClick={this.toggleMenu}>
              <div className={classes!.dropDownTitleContainer}>
                <div className={classes!.dropDownTitle}>Categories</div>
                {<svg className={classNames(classes!.dropDownIcon, { isActive: this.state.isDropDownOpen })}>
                  <use xlinkHref={`/static/all-apps-sprite.svg#i--dropdown-arrow`} />
                </svg>}
              </div>

              <ul className={classNames(classes!.dropDownCategoriesList, { isActive: this.state.isDropDownOpen })}>
                {allCategories.map(categoryName => {
                  return (
                    <li
                      className={classNames(
                        classes!.dropDownCategoriesItem,
                        { isActive: categoryName === selectedCategory }
                      )}
                      key={categoryName}
                      onClick={() => this.onSelectCategory(categoryName)}
                    >
                      <div className={classes!.categoryText}>{categoryName}</div>
                    </li>
                  );
                })}
              </ul>
            </div>
            {/*End of the dropdown-menu for categories list that is displayed till 1024px*/}

            {!!allCategories && allCategories.length &&
              <AppStoreAllAppsList
                categoryName={selectedCategory}
                applicationsByCategory={applicationsByCategory}
                appStoreContext={appStoreContext}
                isPrevButtonShowed={isPrevButtonShowed}
                isNextButtonShowed={isNextButtonShowed}
                prevCategoryName={this.getPrevCategoryName()}
                nextCategoryName={this.getNextCategoryName()}
                onPrevCategory={this.onPrevCategory}
                onNextCategory={this.onNextCategory}
                smoothScrollToTop={this.smoothScrollToTop}
                onAddApplication={onAddApplication}
                first={50}
              />
            }
          </section>
        }
      </React.Fragment>
    );
  }
}

export default compose(withBurgerMenuStatus, injectSheet(styles))(AppStoreAllApps);
