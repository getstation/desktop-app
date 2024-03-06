import * as React from 'react';
import injectSheet from 'react-jss';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import * as uuid from 'uuid';
import { flowRight as compose } from 'lodash';
import { findApplicationByName } from '@src/api';
import {
  ApiResponse,
  ApplicationCreated,
  AppRequestData,
  setApiResponse,
  Steps,
  submitAppRequest,
  Visibility,
} from '@src/app-request/duck';
import { getApiResponse, getApplicationCreated } from '@src/app-request/selectors';
import { ApplicationsAvailable } from '@src/graphql/queries';
import { State } from '@src/state';
import withCustomAppRequestMode, { WithCustomAppRequestModeStatus } from '@src/HOC/withCustomAppRequestMode';
import withSearchString, { WithSearchStringProps } from '@src/HOC/withSearchString';
import AppStorePageCategoryTitle
  from '@src/components/AppStoreContent/AppStorePageCategoryTitle/AppStorePageCategoryTitle';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { isValidColor } from '@src/shared/validators/color-validator';
import { isValidUrl } from '@src/shared/validators/url-validator';
import { appDataValidator } from '@src/shared/validators/app-data-validator';

import ComponentSteps from './AppRequestSteps/steps';
import styles, { AppRequestClasses } from './styles';

enum CustomAppFormOpenedVia {
  FloatingButton = 'floating-action-button',
  EmptySearchButton = 'empty-search-action-button',
}

interface IState {
  isVisible: boolean,
  appRequestVisibleOrigin?: CustomAppFormOpenedVia,
  appRequestTooltipVisible: boolean,
  step: Steps,
  animAppearDirection: boolean,
  animExitDirection: boolean,
  request: Partial<AppRequestData>,
  similarApplications?: ApplicationsAvailable[],
  formSessionId?: string,
  appNameError?: string,
  errorInputColor?: string,
  errorLogoURL?: string,
  errorSigninURL?: string,
}

interface IOwnProps {
  classes?: AppRequestClasses,
  onAddApplication: (applicationId: string, manifestURL: string) => void,
  btnSize: number,
  exitFlow: (isShouldRefetchCustomApps: boolean, appName?: string) => void,
}

interface IStateProps {
  apiResponse?: ApiResponse,
  applicationCreated?: ApplicationCreated,
}

interface IDispatchProps {
  submit: typeof submitAppRequest,
  setApiResponse: typeof setApiResponse,
}

type Props = IOwnProps & IStateProps & IDispatchProps & WithCustomAppRequestModeStatus & WithSearchStringProps;

@injectSheet(styles)
class AppRequestImpl extends React.Component<Props, IState> {

  static defaultState = {
    isVisible: false,
    appRequestTooltipVisible: false,
    step: Steps.AppName,
    animAppearDirection: true,
    animExitDirection: true,
    similarApplications: undefined,
    formSessionId: undefined,
    appNameError: undefined,
    errorInputColor: undefined,
    errorLogoURL: undefined,
    errorSigninURL: undefined,
    request: {
      name: '',
      themeColor: '',
      logoURL: '',
      signinURL: '',
      scope: '',
      visibility: Visibility.Private,
    },
  };

  constructor(props: Props) {
    super(props);

    this.state = AppRequestImpl.defaultState;

    this.onCancel = this.onCancel.bind(this);
    this.onSetAppName = this.onSetAppName.bind(this);
    this.onAddApplication = this.onAddApplication.bind(this);
    this.onSubmitAppData = this.onSubmitAppData.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.handleInstallApplicationAfterAdd = this.handleInstallApplicationAfterAdd.bind(this);
  }

  // tslint:disable-next-line function-name
  UNSAFE_componentWillUpdate(nexProps: Props, nextState: IState) {
    const { isVisible } = this.state;

    if (nextState.step === Steps.Exit) {
      this.props.exitFlow(false);
    }

    if (nexProps.appRequestIsOpen && !isVisible) {
      this.setState({
        isVisible: true,
        appRequestVisibleOrigin: CustomAppFormOpenedVia.EmptySearchButton,
      });
    }
  }

  componentDidMount() {
    const { searchStringAfterEnterPress } = this.props;

    this.setState({
      step: Steps.AppName,
      request: { ...AppRequestImpl.defaultState.request, name: searchStringAfterEnterPress || '' },
      formSessionId: uuid.v4(),
    });
  }

  async onSetAppName(name: string) {
    this.setState({
      animAppearDirection: false,
      animExitDirection: false,
    });
    const similarApplications = await findApplicationByName(name.trim());
    if (similarApplications.length > 0) {
      return this.setState(
        (prevState, _) => ({
          request: { ...prevState.request, name },
          step: Steps.Disambiguation,
          similarApplications,
        })
      );
    }

    this.setState(
      (prevState, _) => ({
        request: { ...prevState.request, name },
        step: Steps.AppData,
        similarApplications: undefined,
      })
    );
  }

  onAddApplication(
    applicationId: ApplicationsAvailable['id'],
    manifestURL: ApplicationsAvailable['bxAppManifestURL']
  ) {
    const { onAddApplication } = this.props;

    onAddApplication(applicationId, manifestURL);
    this.setState({ step: Steps.Exit });
  }

  handleChangeThemeColor = (themeColor :string) => {
    const { errorInputColor } = this.state;
    const error = errorInputColor && isValidColor(themeColor) ? '' : errorInputColor;

    this.setState({
      ...this.state,
      request: {
        ...this.state.request,
        themeColor,
      },
      errorInputColor: error,
    });
  }

  handleChangeLogoURL = (logoURL: string) => {
    const { errorLogoURL } = this.state;
    const error = errorLogoURL && isValidUrl(logoURL) ? '' : errorLogoURL;

    this.setState({
      ...this.state,
      request: {
        ...this.state.request,
        logoURL,
      },
      errorLogoURL: error,
    });
  }

  handleChangeSigninUrl = (signinURL :string) => {
    const { errorSigninURL } = this.state;
    const error = errorSigninURL && isValidUrl(signinURL) ? '' : errorSigninURL;

    this.setState({
      ...this.state,
      request: {
        ...this.state.request,
        signinURL,
      },
      errorSigninURL: error,
    });
  }

  onSubmitAppData() {
    const { themeColor, logoURL, signinURL, visibility } = this.state.request;
    const { submit } = this.props;
    const { errorInputColor, errorLogoURL, errorSigninURL } = appDataValidator(themeColor!, logoURL!, signinURL!, visibility!);

    this.props.setApiResponse(ApiResponse.Pending);

    if (errorInputColor || errorLogoURL || errorSigninURL) {
      return this.setState({
        ...this.state,
        errorInputColor,
        errorLogoURL,
        errorSigninURL,
      });
    }

    const scope = new URL(signinURL!).origin;

    this.setState(
      (prevState, _) => ({
        request: { ...prevState.request, logoURL, signinURL, themeColor, scope },
        animExitDirection: true,
      }),
      () => {
        this.setState({ step: Steps.Confirmation });
        const { request } = this.state;
        submit(request as AppRequestData);
      }
    );
  }

  updateAnimationAndStepStates = (
    animAppearDirection: boolean,
    animExitDirection: boolean,
    backToStep: Steps
  ) => {
    return this.setState({ animAppearDirection, animExitDirection },
      () => this.setState({ step: backToStep }));
  }

  onCancel(backToStep: Steps) {
    switch (backToStep) {
      case Steps.AppName:
        return this.updateAnimationAndStepStates(false, false, backToStep);
      case Steps.Disambiguation:
        return this.updateAnimationAndStepStates(true, false, backToStep);
      default:
        this.setState({ animExitDirection: true },
          () => this.setState({ step: backToStep }));
    }
  }

  onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.keyCode === 27) {
      e.stopPropagation();
    }
  }

  handleInstallApplicationAfterAdd() {
    const { onAddApplication, applicationCreated } = this.props;
    this.props.exitFlow(true);
    onAddApplication(applicationCreated!.id, applicationCreated!.bxAppManifestURL);
    location.reload();
  }

  getCurrentStep = () => {
    const { apiResponse } = this.props;
    const { request: { name, logoURL, visibility, themeColor }, step, similarApplications } = this.state;

    switch (step) {
      case Steps.AppName:
        return (
            <CSSTransition
              key={Steps.AppName}
              in={true}
              appear={true}
              timeout={500}
              classNames="fade"
            >
              <ComponentSteps.AppName
                name={name!}
                onNext={this.onSetAppName}
                animAppearDirection={this.state.animAppearDirection}
                animExitDirection={this.state.animExitDirection}
              />
            </CSSTransition>
        );
      case Steps.Disambiguation:
        return (
          <CSSTransition
            key={Steps.Disambiguation}
            in={true}
            appear={true}
            timeout={500}
            classNames="fade"
          >
            <ComponentSteps.Disambiguation
              appName={name!}
              similarApplications={similarApplications!}
              onCancel={() => this.onCancel(Steps.AppName)}
              onAddApplication={this.onAddApplication}
              onNext={() => this.updateAnimationAndStepStates(true, true, Steps.AppData)}
              animAppearDirection={this.state.animAppearDirection}
              animExitDirection={this.state.animExitDirection}
            />
          </CSSTransition>
        );
      case Steps.AppData:
        return (
          <CSSTransition
            key={Steps.AppData}
            in={true}
            appear={true}
            timeout={500}
            classNames="fade"
          >
            <ComponentSteps.AppData
              appName={this.state.request.name!}
              logoURL={this.state.request.logoURL!}
              themeColor={this.state.request.themeColor!}
              signinURL={this.state.request.signinURL!}
              visibility={visibility!}
              errorInputColor={this.state.errorInputColor}
              errorLogoURL={this.state.errorLogoURL}
              errorSigninURL={this.state.errorSigninURL}
              handleChangeThemeColor={this.handleChangeThemeColor}
              handleChangeLogoURL={this.handleChangeLogoURL}
              handleChangeSigninUrl={this.handleChangeSigninUrl}
              onCancel={() => similarApplications ?
                this.onCancel(Steps.Disambiguation) : this.onCancel(Steps.AppName)
              }
              onSubmit={this.onSubmitAppData}
              animExitDirection={this.state.animExitDirection}
            />
          </CSSTransition>

        );
      case Steps.Confirmation:
        return (
          <CSSTransition
            key={Steps.Confirmation}
            in={true}
            appear={true}
            timeout={500}
            classNames="fade"
          >
            <ComponentSteps.Confirmation
              name={name!}
              logoURL={logoURL!}
              themeColor={themeColor!}
              visibility={visibility!}
              onCancel={() => this.props.exitFlow(true, name)}
              apiResponse={apiResponse!}
              installApplicationAfterAdd={this.handleInstallApplicationAfterAdd}
            />
          </CSSTransition>

        );
      default: return <React.Fragment/>;
    }
  }

  render() {
    const { classes } = this.props;
    const { step } = this.state;

    return (
      <div className={classes!.stepperContainer}>
        {step !== Steps.Confirmation && <AppStorePageCategoryTitle
          title={'Add a custom app'}
        />}
        <TransitionGroup>
          {this.getCurrentStep()}
        </TransitionGroup>
      </div>
    );
  }
}

const AppRequest = connect<IStateProps, IDispatchProps, IOwnProps>(
  (state: State) => ({
    apiResponse: getApiResponse(state),
    applicationCreated: getApplicationCreated(state),
  }),
  (dispatch: Dispatch) => bindActionCreators(
    {
      submit: submitAppRequest,
      setApiResponse,
    },
    dispatch,
  ),
)(AppRequestImpl);

export default compose(withCustomAppRequestMode, withSearchString)(AppRequest);
