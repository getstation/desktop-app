import { GradientType, SlideX, ThemeTypes, withGradient } from '@getstation/theme';
import * as classNames from 'classnames';
// @ts-ignore: no declaration file
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import { MinimalApplication } from '../applications/graphql/withApplications';
import TrafficLights from '../dock/components/TrafficLights';
import { OnboardingDockIcon } from './components/OnboardingDockIcon';
import OnboardingStepAppStore from './components/OnboardingStepAppStore';

import {
  InstallApplicationMutationVariables,
  Platform,
} from './queries@local.gql.generated';

export interface Classes {
  container: string,
  section: string,
  sectionHeader: string,
  trafficLights: string,
  illustration: string,
  onboardingDock: string,
  hideOnboardingDock: string,
  onboardingDockAppIcon: string,
}

type InstallApplicationInput = InstallApplicationMutationVariables['input'];

export interface Props {
  classes?: Classes,
  applications: MinimalApplication[],
  themeGradient: string,
  error?: string,
  showWelcomeBack?: boolean,
  firstName?: string,
  step: number,
  emails: string[],
  loginButtonDisabled?: boolean,
  privacyPoliciesLink: string,
  onClickLogin: () => any,
  onAppStoreStepFinished: (
    appsSelectedCount: number,
  ) => void,
  onEmailsChange: (emails: string[]) => any,
  isWindowFocused: boolean,
  onCloseWindow: () => any,
  onMinimizeWindow: () => any,
  onExpandWindow: () => any,
  isDarwin: boolean,
  validateEmail: (email: string) => boolean,
  searchInputValue: string,
  handleSearchInputValue: (value: string) => any,
  installApplication: (input: InstallApplicationInput) => Promise<void>,
  onboardingDone: (nbInstalledApps: number, onboardeeId: string | undefined) => Promise<void>,
}

interface State {
  selectedApplications: (MinimalApplication & { position?: DOMRect })[],
  isLoading: boolean,
}

const styles = (theme: ThemeTypes) => ({
  container: {
    display: 'flex',
    position: 'absolute',
    top: 0,
    left: 0,
    ...theme.mixins.size('100%'),
    zIndex: 101,
  },
  section: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexDirection: 'column',
    width: 490,
    height: '100%',
    backgroundColor: 'white',
  },
  sectionHeader: {
    padding: [60, 60, 0, 60],
    width: '100%',
  },
  trafficLights: {
    position: 'fixed',
    top: 0,
    left: 0,
  },
  illustration: {
    flex: 1,
    backgroundImage: (props: Props) =>
      `url("static/illustrations/illustration--onboarding@2x.png"), ${props.themeGradient}`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
  },
  onboardingDock: {
    width: 60,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, .8)',
    padding: [60, 15, 20],
    transition: '300ms ease-in-out',
  },
  hideOnboardingDock: {
    width: 0,
    padding: 0,
  },
});

@injectSheet(styles)
class Presenter extends React.PureComponent<Props, State> {

  static defaultProps = {
    step: 0,
    loginButtonDisabled: false,
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      selectedApplications: [],
      isLoading: false,
    };

    this.handleApplicationSelect = this.handleApplicationSelect.bind(this);
    this.handleSubmitAppStore = this.handleSubmitAppStore.bind(this);
  }

  handleApplicationSelect(
    application: MinimalApplication,
    iconRef: any,
  ) {
    const { selectedApplications } = this.state;

    const { id } = application;

    if (selectedApplications.find((app: MinimalApplication) => app.id === id)) {
      this.setState({
        selectedApplications: Array.from(selectedApplications).filter((app: any) => app.id !== id),
      });
      return;
    }

    if (selectedApplications.length > 14) return;

    const newSelectedApplications = Array.from(selectedApplications);
    newSelectedApplications.push({ ...application, position: iconRef.getBoundingClientRect() });
    this.setState({ selectedApplications: newSelectedApplications });
  }

  async handleSubmitAppStore() {
    const {
      installApplication,
      onboardingDone,
    } = this.props;
    this.setState({ isLoading: true });

    const selectedApps = this.state.selectedApplications.map(app => ({
      id: undefined,
      application: app,
      configuration: {},
    }));

    const apps = selectedApps;

    for (const app of apps) {
      await installApplication({
        manifestURL: app.application.bxAppManifestURL,
        context: {
          id: app.application.id,
          platform: Platform.PlatformAppstore,
          onboardeeApplicationAssignment: undefined,
        },
        configuration: app.configuration,
      });
    }

    await onboardingDone(apps.length, undefined);
  }

  renderDockIcons = () => {
    const { classes } = this.props;
    const { selectedApplications } = this.state;

    return (
      <div className={classNames(classes!.onboardingDock, { [classes!.hideOnboardingDock]: selectedApplications.length === 0 })}>
        {selectedApplications.map((app, index: number) =>
          <OnboardingDockIcon
            key={app.id}
            application={app}
            indexPosition={index}
            onRemove={this.handleApplicationSelect}
          />
        )}
      </div>
    );
  }

  render() {
    const {
      classes, applications, step,
      isWindowFocused, onCloseWindow, onMinimizeWindow,
      onExpandWindow, isDarwin, searchInputValue, handleSearchInputValue,
    } = this.props;

    const { selectedApplications, isLoading } = this.state;

    return (
      <div className={classes!.container}>
        <div id="portal-powered-by-station" />
        {isDarwin &&
          <div className={classes!.trafficLights}>
            <TrafficLights
              focused={isWindowFocused}
              handleClose={onCloseWindow}
              handleMinimize={onMinimizeWindow}
              handleExpand={onExpandWindow}
              allHover={true}
            />
          </div>
        }

        <div className={classes!.section}>
          <div className={classes!.sectionHeader}>
            <img src="static/logos/station-logo-full-black.svg" alt="" />
          </div>

          <SlideX step={step}>
            <OnboardingStepAppStore
              onHandleApplicationSelect={this.handleApplicationSelect}
              onValidSubmit={this.handleSubmitAppStore}
              applications={applications.slice(0, 10)}
              selectedApplications={selectedApplications}
              searchInputValue={searchInputValue}
              handleSearchInputValue={handleSearchInputValue}
              isLoading={isLoading}
            />
          </SlideX>
        </div>

        <div className={classes!.illustration}>
          {this.renderDockIcons()}
        </div>
      </div>
    );
  }
}

export default withGradient(GradientType.normal)(Presenter);
