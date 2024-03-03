import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { BrowserXThemeProvider, GradientType, withGradient } from '@getstation/theme';
import { checkForUpdates, quitAndInstall } from '../auto-update/duck';
import { getReleaseName, isCheckingUpdate, isDownloadingUpdate, isUpdateAvailable } from '../auto-update/selectors';
import { areBetaIncludedInUpdates, getAppAutoLaunchEnabledStatus, getAppName, getAppVersion } from '../app/selectors';
import { enableAutoLaunch, includeBetaInUpdates } from '../app/duck';
import AboutWindowPresenter from './Presenter';
import { getThemeColors } from '../theme/selectors';

@connect(
  (state) => ({
    isDownloadingUpdate: isDownloadingUpdate(state),
    isCheckingUpdate: isCheckingUpdate(state),
    isUpdateAvailable: isUpdateAvailable(state),
    isAutoLaunchEnabled: Boolean(getAppAutoLaunchEnabledStatus(state)),
    areBetaIncludedInUpdates: Boolean(areBetaIncludedInUpdates(state)),
    releaseName: getReleaseName(state),
    themeColors: getThemeColors(state),
    appVersion: getAppVersion(state),
    appName: getAppName(state),
  }),
  (dispatch) => bindActionCreators({
    checkForUpdates,
    onEnableAutoLaunch: enable => enableAutoLaunch(enable),
    onIncludeBetaToUpdates: include => includeBetaInUpdates(include),
    quitAndInstall,
  }, dispatch)
)
class AboutWindowContainer extends React.PureComponent {

  static propTypes = {
    checkForUpdates: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.props.checkForUpdates();
  }

  render() {
    return (
      <BrowserXThemeProvider>
        <AboutWindowPresenter {...this.props} />
      </BrowserXThemeProvider>
    );
  }
}

export default withGradient(GradientType.normal)(AboutWindowContainer);
