import * as React from 'react';
import injectSheet from 'react-jss';
import { graphql } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import * as classNames from 'classnames';
import { Icon, IconSymbol } from '@getstation/theme';
import { ContextEnvPlatform } from '@src/app';
import { Application } from '@src/graphql/queries';
import withActiveScreenName, { WithActiveScreenNameProps } from '@src/HOC/withActiveScreenName';
import withSearchString, { WithSearchStringProps } from '@src/HOC/withSearchString';
import {
  customAppsCategories,
  customAppsMode,
  screenNames,
  applicationNameMaxWidth,
} from '@src/shared/constants/constants';
import { SET_SEARCH_STRING } from '@src/graphql/schemes/search';
import { SET_ACTIVE_SCREEN_NAME } from '@src/graphql/schemes/activeScreenName';
import { SET_CUSTOM_APP_REQUEST_MODE } from '@src/graphql/schemes/customAppRequestMode';
import { SET_SELECTED_CUSTOM_APP } from '@src/graphql/schemes/selectedCustomApp';
import { MutateSetSearchStringProps } from '@src/graphql/types/mutateSetSearchString';
import { MutateSetActiveScreenNameProps } from '@src/graphql/types/mutateSetActiveScreenName';
import { MutateSetCustomAppRequestModeProps } from '@src/graphql/types/mutateSetCustomAppRequestMode';
import { MutateSetSelectedCustomAppProps } from '@src/graphql/types/mutateSetSelectedCustomApp';

import AppStoreApplicationLogo from './AppStoreApplicationLogo/AppStoreApplicationLogo';
import styles, { AppStoreApplicationClasses } from './styles';

export type AppStoreApplicationProps = {
  classes?: AppStoreApplicationClasses,
  application: Application,
  appStoreContext: number,
  onAddApplication: (applicationId: string, manifestURL: string) => any,
  isExtension?: boolean,
  alternate?: boolean,
  marginBottom?: number,
  isCategoryNameDisplayed?: boolean,
};

export type AppStoreApplicationState = {
  isAnimationStopped: boolean,
  appNameWidth: number,
};

export type Props = WithActiveScreenNameProps
  & WithSearchStringProps
  & AppStoreApplicationProps
  & MutateSetSearchStringProps
  & MutateSetActiveScreenNameProps
  & MutateSetCustomAppRequestModeProps
  & MutateSetSelectedCustomAppProps;

@injectSheet(styles)
class AppStoreApplication extends React.PureComponent<Props, AppStoreApplicationState> {
  appNameRef: React.RefObject<HTMLDivElement>;

  constructor(props: Props) {
    super(props);
    this.state = {
      isAnimationStopped: true,
      appNameWidth: 0,
    };
    this.appNameRef = React.createRef();

    this.handleAddApplication = this.handleAddApplication.bind(this);
    this.toggleAnimation = this.toggleAnimation.bind(this);
  }

  componentDidMount() {
    this.setState({
      ...this.state,
      appNameWidth: this.appNameRef.current ? this.appNameRef.current.offsetWidth : this.state.appNameWidth,
    });
  }

  handleAddApplication() {
    const { application, appStoreContext } = this.props;
    const applicationId = appStoreContext === ContextEnvPlatform.LegacyBxApiApp ?
      application.previousServiceId :
      application.id;

    this.props.onAddApplication(applicationId, application.bxAppManifestURL);
    this.toggleAnimation(false);
  }

  toggleAnimation = (isAnimationStopped: boolean) => {
    this.setState({ isAnimationStopped });
  }

  enterEditApplicationFlow = () => {
    this.props.mutateSetSelectedCustomApp({
      variables: {
        app: this.props.application,
      },
    });
    this.props.mutateSetSearchString({
      variables: {
        searchString: '',
        searchStringAfterEnterPress: '',
        isEnterPressed: false,
      },
    });
    this.props.mutateSetCustomAppRequestMode({
      variables: {
        appRequestIsOpen: true,
        currentMode: customAppsMode.editMode,
      },
    });
  }

  render() {
    const { application, classes, isExtension, appStoreContext, isCategoryNameDisplayed = true } = this.props;
    const categoryName = !!application && !!application.category && application.category.name || null;
    const isCustom = categoryName === customAppsCategories.privateApps || application.isPrivate;
    const isShouldDisplayPopup = this.state.appNameWidth >= applicationNameMaxWidth;

    return (
      <li className={classes!.application}>
        <div className={classes!.applicationContent}>
          <AppStoreApplicationLogo
            iconURL={application.iconURL}
            themeColor={application.themeColor}
            isExtension={isExtension}
            isAnimationStopped={this.state.isAnimationStopped}
            toggleAnimation={this.toggleAnimation}
          />
          <div className={classes!.applicationDetails}>
            <div
              className={classNames(
                classes!.applicationNameContainer,
                { applicationNamePopup: isShouldDisplayPopup },
              )}
              ref={this.appNameRef}
            >
              <strong className={classes!.applicationName}>{application.name}</strong>
            </div>
            {isCategoryNameDisplayed && !!categoryName &&
              <div className={classes!.categoryName}>
                {categoryName}
              </div>
            }
          </div>
        </div>

        {
          (appStoreContext === ContextEnvPlatform.App ||
            appStoreContext === ContextEnvPlatform.LegacyBxApiApp) &&
          <div className={classes!.applicationControls}>
            {isCustom &&
            <div className={classes!.applicationControlsItem}>
              <Icon
                symbolId={IconSymbol.TRASH}
                size={34}
                className={classes!.action}
                onClick={this.enterEditApplicationFlow}
              />
            </div>
            }
            <Icon
              symbolId={IconSymbol.PLUS}
              size={34}
              className={classes!.action}
              onClick={() => this.handleAddApplication()}
            />
          </div>
        }
      </li>
    );
  }
}

export default compose(
  withSearchString,
  withActiveScreenName,
  graphql(SET_SEARCH_STRING, { name: 'mutateSetSearchString' }),
  graphql(SET_ACTIVE_SCREEN_NAME, { name: 'mutateSetActiveScreenName' }),
  graphql(SET_CUSTOM_APP_REQUEST_MODE, { name: 'mutateSetCustomAppRequestMode' }),
  graphql(SET_SELECTED_CUSTOM_APP, { name: 'mutateSetSelectedCustomApp' }),
)(AppStoreApplication);
