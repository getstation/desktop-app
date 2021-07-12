import * as React from 'react';
import injectSheet from 'react-jss';
import { CSSTransition } from 'react-transition-group';
import { graphql } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import AppStorePageCategoryTitle
  from '@src/components/AppStoreContent/AppStorePageCategoryTitle/AppStorePageCategoryTitle';
import AppName from '@src/components/AppStoreContent/AppStoreRequestEdit/AppName/AppName';
import AppData from '@src/components/AppStoreContent/AppStoreRequest/AppRequestSteps/AppData/AppData';
import AppDelete from '@src/components/AppStoreContent/AppStoreRequestEdit/AppDelete/AppDelete';
import AppRequestStepsButtons
  from '@src/components/AppStoreContent/AppStoreRequest/AppRequestStepsButtons/AppRequestStepsButtons';
import { scrollToTop } from '@src/shared/functions/scroll-to-top';
import withSelectedCustomApp, { WithSelectedCustomAppProps } from '@src/HOC/withSelectedCustomApp';
import { appDataValidator } from '@src/shared/validators/app-data-validator';
import { isValidName } from '@src/shared/validators/name-validator';
import { isValidColor } from '@src/shared/validators/color-validator';
import { isValidUrl } from '@src/shared/validators/url-validator';
import { Visibility } from '@src/app-request/duck';
import { AppDataValidationErrors } from '@src/shared/constants/constants';
import { UPDATE_APPLICATION_FROM_RECIPE } from '@src/graphql/schemes/updateApplicationFromRecipe';
import { MutateUpdateApplicationFromRecipeProps } from '@src/graphql/types/mutateUpdateApplicationFromRecipe';
import styles, { AppRequestEditClasses } from '@src/components/AppStoreContent/AppStoreRequestEdit/styles';

export interface ApplicationRecipe {
  name: string,
  themeColor: string,
  bxIconURL: string,
  startURL: string,
  scope: string,
}

interface IOwnProps {
  classes?: AppRequestEditClasses,
  exitFlow: (isShouldRefetchCustomApps: boolean) => void,
  handleRequestError: () => void,
}

interface IState {
  name: string,
  themeColor: string,
  logoURL: string,
  signinURL: string,
  appNameError?: string,
  errorInputColor?: string,
  errorLogoURL?: string,
  errorSigninURL?: string,
}

type Props = IOwnProps
  & WithSelectedCustomAppProps
  & MutateUpdateApplicationFromRecipeProps;

@injectSheet(styles)
class AppRequestEdit extends React.PureComponent<Props, IState> {

  constructor(props: Props) {
    super(props);
    this.state = {
      name: props.app.name,
      logoURL: props.app.iconURL,
      themeColor: props.app.themeColor,
      signinURL: props.app.startURL,
      appNameError: undefined,
      errorInputColor: undefined,
      errorLogoURL: undefined,
      errorSigninURL: undefined,
    };
  }

  componentDidMount() {
    scrollToTop();
  }

  handleChangeName = (name: string) => {
    const error = isValidName(name) ? '' : AppDataValidationErrors.AppName;

    this.setState({
      ...this.state,
      name,
      appNameError: error,
    });
  }

  handleChangeThemeColor = (themeColor: string) => {
    const error = isValidColor(themeColor) ? '' : AppDataValidationErrors.AppColor;

    this.setState({
      ...this.state,
      themeColor,
      errorInputColor: error,
    });
  }

  handleChangeLogoURL = (logoURL: string) => {
    const error = isValidUrl(logoURL) ? '' : AppDataValidationErrors.AppLogo;

    this.setState({
      ...this.state,
      logoURL,
      errorLogoURL: error,
    });
  }

  handleChangeSigninUrl = (signinURL: string) => {
    const error = isValidUrl(signinURL) ? '' : AppDataValidationErrors.AppUrl;

    this.setState({
      ...this.state,
      signinURL,
      errorSigninURL: error,
    });
  }

  onSubmit = () => {
    const { id, category } = this.props.app;
    const { name, themeColor, logoURL, signinURL } = this.state;

    if (!isValidName(name)) {
      return this.setState({
        ...this.state,
        appNameError: AppDataValidationErrors.AppName,
      });
    }

    const { errorInputColor, errorLogoURL, errorSigninURL } = appDataValidator(themeColor, logoURL, signinURL, Visibility.Private);

    if (errorInputColor || errorLogoURL || errorSigninURL) {
      return this.setState({
        ...this.state,
        errorInputColor,
        errorLogoURL,
        errorSigninURL,
      });
    }

    const applicationRecipe: ApplicationRecipe = {
      name,
      themeColor,
      bxIconURL: logoURL,
      startURL: signinURL,
      scope: new URL(signinURL!).origin,
    };

    this.props.mutateUpdateApplicationFromRecipe({
      variables: {
        applicationId: id,
        applicationRecipe,
      },
    })
      .then(() => {
        this.props.exitFlow(true);
      })
      .catch(() => this.props.handleRequestError());
  }

  render() {
    const { classes, exitFlow } = this.props;
    const { name, logoURL, themeColor, signinURL, appNameError, errorInputColor, errorLogoURL, errorSigninURL } = this.state;

    return (
      <React.Fragment>
        <div className={classes!.stepperContainer}>
        <AppStorePageCategoryTitle title={'Edit my custom app'}/>
          <CSSTransition
            key={'AppRequestEdit'}
            in={true}
            appear={true}
            timeout={500}
            classNames="fade"
          >
            <div className={classes!.transitionWrapper}>
              <AppName
                name={name}
                nameError={appNameError}
                handleChangeName={this.handleChangeName}
              />
              <div className={classes!.componentWrapper}>
                <AppData
                  appName={name}
                  logoURL={logoURL}
                  themeColor={themeColor}
                  signinURL={signinURL}
                  isControlsVisible={false}
                  handleChangeThemeColor={this.handleChangeThemeColor}
                  handleChangeLogoURL={this.handleChangeLogoURL}
                  handleChangeSigninUrl={this.handleChangeSigninUrl}
                  errorInputColor={errorInputColor}
                  errorLogoURL={errorLogoURL}
                  errorSigninURL={errorSigninURL}
                />
              </div>
              <AppDelete />
              <div className={classes!.componentWrapper}>
                <AppRequestStepsButtons
                  onCancelBtnText={'Cancel'}
                  onCancel={() => exitFlow(false)}
                  onContinueBtnText={'Save changes'}
                  onContinue={this.onSubmit}
                />
              </div>
            </div>
          </CSSTransition>
      </div>
      </React.Fragment>
    );
  }
}

export default compose(
  withSelectedCustomApp,
  graphql(UPDATE_APPLICATION_FROM_RECIPE, { name: 'mutateUpdateApplicationFromRecipe' }),
)(AppRequestEdit);
