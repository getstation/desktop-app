import { GradientType, InjectedProps as withGradientProps, withGradient } from '@getstation/theme';
import { withApollo, WithApolloClient } from 'react-apollo';
import * as remote from '@electron/remote';
import * as Immutable from 'immutable';
// @ts-ignore: no declaration file
import { validate as validateEmail } from 'isemail';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import ui from 'redux-ui';
import {
  MinimalApplication,
  Props as WithMyApplicationsProps,
} from '../applications/graphql/withApplications';
import { isDarwin } from '../utils/process';
import { appStoreStepFinished, startOnboarding } from './duck';
import Presenter from './Presenter';

import {
  withGetDefaultApplicationsForOnboarding,
  withInstallApplication,
  InstallApplicationMutationVariables,
  withOnboardingDone,
} from './queries@local.gql.generated';

import { OnboardingType } from '../ui/types';
import { manifestToMinimalApplication, search } from '../../manifests';

export interface DispatchFromProps {
  onClickLogin: typeof startOnboarding,
  onAppStoreStepFinished: typeof appStoreStepFinished,
}

export interface UIProp {
  step: number,
  emails: string[],
  loginButtonDisabled: boolean,
  loginError?: string,
  showWelcomeBack: boolean,
  onboardingSessionId: string,
  onboardingType: OnboardingType,
}

export interface UIProps {
  ui: UIProp,
  updateUI: (uiState: Object) => any
}

type InstallApplicationInput = InstallApplicationMutationVariables['input'];

type InstallApplicationProps = {
  installApplication: (input: InstallApplicationInput) => Promise<void>,
};

type OnboardingDoneProps = {
  onboardingDone: (nbInstalledApps: number) => Promise<void>,
};

export type Props =
  StateToProps
  & DispatchFromProps
  & UIProps
  & InstallApplicationProps
  & OnboardingDoneProps
  & WithMyApplicationsProps<MinimalApplication>
  & withGradientProps
  & WithApolloClient<{}>;

interface State {
  isWindowFocused: boolean,
  searchInputValue: string,
  currentSearchedApplicationsResult: MinimalApplication[] | null,
}

class OnboardingImpl extends React.PureComponent<Props, State> {
  public win: Electron.BrowserWindow;

  constructor(props: Props) {
    super(props);

    this.win = remote.getCurrentWindow();

    this.state = {
      isWindowFocused: this.win.isFocused(),
      searchInputValue: '',
      currentSearchedApplicationsResult: null,
    };

    this.updateEmails = this.updateEmails.bind(this);
    this.handleSearchInputValue = this.handleSearchInputValue.bind(this);
    this.getApplications = this.getApplications.bind(this);
    this.handleMinimizeWindow = this.handleMinimizeWindow.bind(this);
    this.handleCloseWindow = this.handleCloseWindow.bind(this);
    this.handleExpandWindow = this.handleExpandWindow.bind(this);
  }

  componentDidMount() {
    this.onFocus = () => {
      this.setState({ isWindowFocused: true });
    };

    this.onBlur = () => {
      this.setState({ isWindowFocused: false });
    };

    this.win.on('focus', this.onFocus);
    this.win.on('blur', this.onBlur);
  }

  async componentDidUpdate(_: Props, prevState: State) {
    // here. we are re-implementing what a `AppolloReact.Query` would
    // have done better than us, but given the fact that the data displayed in
    // `applications` are coming from 3 different queries depending on conditions
    // it would have required a big refactor
    // todo: do the big refactor that combines the 3 different queries
    // better-todo: augnent the `search` API query to combine the 3 different queries
    if (this.state.searchInputValue !== prevState.searchInputValue) {
      if (this.state.searchInputValue === '') {
        // reset the currentSearchedApplicationsResult to display default results
        this.setState({ currentSearchedApplicationsResult: null });
      } else {
        this.updateSearchedApplications(this.state.searchInputValue);
      }
    }
  }

  async updateSearchedApplications(term: string) {
    const applications = search(term);
    this.setState({
      currentSearchedApplicationsResult: applications,
    });
  }

  componentWillUnmount() {
    this.win.removeListener('focus', this.onFocus);
    this.win.removeListener('blur', this.onBlur);
  }

  onFocus() { }

  onBlur() { }

  updateEmails(emails: string[]) {
    const { updateUI } = this.props;
    return updateUI({
      emails,
    });
  }

  getApplications(): MinimalApplication[] {
    const {
      applications,
    } = this.props;

    if (!applications) return [];

    if (this.state.searchInputValue !== '' && this.state.currentSearchedApplicationsResult) {
      return this.state.currentSearchedApplicationsResult;
    }

    return applications;
  }

  handleSearchInputValue(value: string) {
    this.setState({ searchInputValue: value });
  }

  handleCloseWindow() {
    remote.getCurrentWindow().close();
  }

  handleMinimizeWindow() {
    this.win.minimize();
  }

  handleExpandWindow() {
    this.win.setFullScreen(!this.win.isFullScreen());
  }

  render() {
    const {
      onClickLogin, onAppStoreStepFinished, firstName,
      installApplication, onboardingDone,
      ui: { step, emails, loginButtonDisabled, loginError, showWelcomeBack },
    } = this.props;
    const { isWindowFocused, searchInputValue } = this.state;

    return (
      <Presenter
        applications={this.getApplications()}
        onClickLogin={onClickLogin}
        error={loginError}
        showWelcomeBack={showWelcomeBack}
        firstName={firstName}
        step={step}
        onAppStoreStepFinished={onAppStoreStepFinished}
        onboardingDone={onboardingDone}
        emails={emails}
        onEmailsChange={this.updateEmails}
        loginButtonDisabled={loginButtonDisabled}
        privacyPoliciesLink={'https://github.com/getstation/desktop-app/wiki/FAQ#-data--privacy'}
        isWindowFocused={isWindowFocused}
        onCloseWindow={this.handleCloseWindow}
        onMinimizeWindow={this.handleMinimizeWindow}
        onExpandWindow={this.handleExpandWindow}
        isDarwin={isDarwin}
        validateEmail={validateEmail}
        searchInputValue={searchInputValue}
        handleSearchInputValue={this.handleSearchInputValue}
        installApplication={installApplication}
      />
    );
  }
}

const Onboarding = compose(
  withInstallApplication({
    props: ({ mutate }): InstallApplicationProps => {
      const installApplication = async (input: InstallApplicationInput): Promise<void> => {
        mutate && await mutate({ variables: { input } });
      };
      return { installApplication };
    },
  }),
  withOnboardingDone({
    props: ({ mutate }) => {
      const onboardingDone = async (nbInstalledApps: number, onboardeeId?: string): Promise<void> => {
        mutate && await mutate({ variables: { nbInstalledApps, onboardeeId } });
      };
      return { onboardingDone };
    },
  }),
  withGetDefaultApplicationsForOnboarding({
    props:({ data }) => ({
      applications: !!data && data.applications,
    }),
  }),
  withApollo,
  connect<{}, DispatchFromProps, {}>(
    (state: Immutable.Map<string, any>) => ({}),
    dispatch => bindActionCreators(
      {
        onAppStoreStepFinished: appStoreStepFinished,
      },
      dispatch
    )
  ),
  ui({
    key: 'onboarding',
    state: {
      onboardingType: OnboardingType.Undefined,
      step: 0,
      emails: ['', '', ''],
      loginButtonDisabled: false,
      loginError: undefined,
      showWelcomeBack: false,
      onboardingSessionId: undefined,
    },
  }),
  withGradient(GradientType.normal)
)(OnboardingImpl);

export default Onboarding;
