import { Icon, IconSymbol, ThemeTypes as Theme } from '@getstation/theme';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import * as log from 'electron-log';
import { logger } from '../../api/logger';

import ApplicationBasicAuth from './ApplicationBasicAuth';
import ApplicationError from './ApplicationError';
import ApplicationLoading from './ApplicationLoading';
import ApplicationAboutBlank from './ApplicationAboutBlank';
import Maybe from 'graphql/tsutils/Maybe';

export interface Classes {
  container: string,
  container2: string,
  icon: string,
  iconContainer: string,
  unhappyIcon: string
}

export interface OwnProps {
  ready: boolean,
  applicationId: string,
  applicationName: Maybe<string>,
  applicationIcon: Maybe<string>,
  manifestURL: Maybe<string>,

  crashed: boolean,
  errorCode: any,
  errorDescription: any,

  classes?: Classes,
  themeGradient: string,
  tabUrl: string,

  email: Maybe<string>,
  promptBasicAuth?: boolean,
  performBasicAuth: (username: string, password: string) => any,
  authInfoHost: any,
  authInfoRealm: any,

  canGoBack: boolean,
  webView: any,

  goBack: () => void,
  onChooseAccount: any,
  onApplicationRemoved: () => any,
  askResetApplication: () => void,
}

export interface StateProps {

}

export type Props = OwnProps & StateProps;

const styles = (theme: Theme) => {
  const smallIcon = (props: Props) => props.promptBasicAuth;
  const stopAnimation = (props: Props) => props.crashed || props.promptBasicAuth;

  return ({
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      position: 'fixed',
      top: 0,
      left: theme.dock.size,
      right: 0,
      backgroundImage: (props: Props) => props.themeGradient,
      zIndex: 100,
      padding: '10px',
    },
    container2: {
      display: 'flex',
      width: '100%',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255, 0.1)',
      borderRadius: '3px',
      height: '100%',
      color: 'white',
      fontSize: '14px',
    },
    iconContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: (props: Props) => smallIcon(props) ? 80 : 160,
      height: (props: Props) => smallIcon(props) ? 80 : 160,
      marginBottom: 30,
      borderRadius: 100,
      backgroundColor: 'rgba(255, 255, 255, .3)',
      position: 'relative',
    },
    icon: {
      width: (props: Props) => smallIcon(props) ? 60 : 120,
      height: (props: Props) => smallIcon(props) ? 60 : 120,
      animation: (props: Props) => stopAnimation(props) ? 'none' : '3s ease-in-out 0s infinite pulsation',
    },
    unhappyIcon: {
      opacity: 0.8,
      position: 'absolute',
      bottom: '-16px',
      right: '-16px',
    },
    '@keyframes pulsation': {
      '0%': { transform: 'scale(1)' },
      '50%': { transform: 'scale(1.2)' },
      '100%': { transform: 'scale(1)' },
    },
  });
};

@injectSheet(styles)
class ApplicationContainer extends React.PureComponent<Props, {}> {

  handleNavigateAboutBlank = () => {
    const { manifestURL, applicationName } = this.props;

    log.debug(`'${applicationName}' navigate on about:blank page`);
    logger.notify(
      new Error('about:blank page'),
      { metaData: { manifestURL } },
    );
  }

  render() {
    const {
      classes, ready, crashed, errorCode, errorDescription, webView, promptBasicAuth,
      applicationName, applicationIcon, email, performBasicAuth, authInfoHost, authInfoRealm,
      tabUrl, canGoBack, goBack,
      askResetApplication, manifestURL,
    } = this.props;

    const hasError = crashed || typeof errorCode === 'number';
    const isAboutBlank = tabUrl === 'about:blank';

    if (ready && !hasError && !promptBasicAuth && !isAboutBlank) return null;

    return (
      <div className={classes!.container}>
        <div className={classes!.container2}>
          <div className={classes!.iconContainer}>
            { this.props.applicationIcon &&
            <img className={classes!.icon} src={this.props.applicationIcon} alt="Icon"/>
            }
            {
              crashed &&
              <Icon
                size={96}
                symbolId={IconSymbol.UNHAPPY}
                className={classes!.unhappyIcon}
              />
            }
          </div>

          { !ready &&
            <ApplicationLoading
              manifestURL={manifestURL}
              applicationName={applicationName}
              applicationIcon={applicationIcon}
              email={email}
            />
          }

          {tabUrl === 'about:blank' &&
            <ApplicationAboutBlank
              onDidMount={this.handleNavigateAboutBlank}
              applicationName={applicationName}
              canGoBack={canGoBack}
              onGoBack={goBack}
              onClickResetApplication={askResetApplication}
            />
          }

          {
            <ApplicationError
              tabUrl={tabUrl}
              crashed={crashed}
              errorCode={errorCode}
              errorDescription={errorDescription}
              webView={webView}
              applicationName={applicationName}
            />
          }

          { promptBasicAuth &&
            <ApplicationBasicAuth
              applicationIcon={applicationIcon}
              performBasicAuth={performBasicAuth}
              authInfoHost={authInfoHost}
              authInfoRealm={authInfoRealm}
            />
          }
        </div>
      </div>
    );
  }
}

export default ApplicationContainer;
