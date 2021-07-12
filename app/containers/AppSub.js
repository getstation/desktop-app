import { GradientType, withGradient } from '@getstation/theme';
import classNames from 'classnames';
import { remote } from 'electron';
import PropTypes from 'prop-types';
import React from 'react';
import injectSheet from 'react-jss';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleMaximize } from '../app/duck';
import { getFocus } from '../app/selectors';
import Application from '../applications/Application';
import PureClassTabContent from '../applications/PureClassTabContent';
import { getApplicationById } from '../applications/selectors';
import Dialogs from '../dialogs/Dialogs';
import DownloadToaster from '../dl-toaster/DownloadToaster';
import OSBar from '../os-bar/OSBar';
import { attach } from '../subwindows/duck';
import { executeWebviewMethodForCurrentTab } from '../tab-webcontents/duck';
import { canTabGoBack, canTabGoForward, getTabApplicationId, getTabTitle } from '../tabs/get';
import { getTabById } from '../tabs/selectors';
import { isDarwin } from '../utils/process';
import ConfirmResetApplication from '../applications/components/ConfirmResetApplication';

const styles = () => ({
  container: {
    backgroundImage: props => props.themeGradient,
  }
});

@connect(
  (state, ownProps) => {
    const tab = getTab(state, ownProps.subData);
    return {
      application: getApplication(state, ownProps.subData),
      tab,
      focus: getFocus(state),
      canGoBack: tab ? canTabGoBack(tab) : false,
      canGoForward: tab ? canTabGoForward(tab) : false,
    };
  },
  (dispatch, ownProps) => bindActionCreators({
    onToggleMaximize: toggleMaximize,
    onCloseSubwindow: () => attach(getSubDataTabId(ownProps.subData)),
    onGoBack: () => executeWebviewMethodForCurrentTab('go-back'),
    onGoForward: () => executeWebviewMethodForCurrentTab('go-forward'),
  }, dispatch)
)
@injectSheet(styles)
class AppSub extends React.PureComponent {
  static propTypes = {
    subData: PropTypes.shape({
      tabId: PropTypes.string,
    }),
    onToggleMaximize: PropTypes.func,
    application: PropTypes.object,
    tab: PropTypes.object,
    focus: PropTypes.number,
    onCloseSubwindow: PropTypes.func,
    classes: PropTypes.object,
    themeGradient: PropTypes.string,
    canGoBack: PropTypes.bool,
    canGoForward: PropTypes.bool,
    onGoBack: PropTypes.func,
    onGoForward: PropTypes.func,
  };

  componentDidMount() {
    this.currentWindowId = remote.getCurrentWindow().id;
  }

  render() {
    // Here application (and tab) can be undefined because tab can have been deleted in main window
    // while this one was detaching.
    // This means there is a `close` event in the pipe that will close this window.
    if (!this.props.application) return null;
    return (
      <div className={classNames('l-container', 'l-nodock', this.props.classes.container)}>
        {isDarwin &&
        <OSBar
          title={getTabTitle(this.props.tab)}
          onDoubleClick={this.props.onToggleMaximize}
          onClose={this.props.onCloseSubwindow}
          canGoBack={this.props.canGoBack}
          canGoForward={this.props.canGoForward}
          onGoBack={this.props.onGoBack}
          onGoForward={this.props.onGoForward}
        />
        }
        <div className="l-appcontainer">
          <PureClassTabContent isVisible>
            <Application
              application={this.props.application}
              tab={this.props.tab}
              focus={this.props.focus === this.currentWindowId}
            />
          </PureClassTabContent>
        </div>
        <ConfirmResetApplication applicationId={this.props.application.get('applicationId')}/>
        <DownloadToaster />
        <Dialogs />
      </div>
    );
  }
}

const getApplication = (state, subData) => {
  if (!subData) return undefined;
  const tab = getTab(state, subData);
  if (!tab) return undefined;
  return getApplicationById(state, getTabApplicationId(tab));
};

const getTab = (state, subData) => {
  if (!subData) return undefined;
  const { tabId } = subData;
  return getTabById(state, tabId);
};

const getSubDataTabId = (subData) => {
  if (!subData) return undefined;
  const { tabId } = subData;
  return tabId;
};

export default withGradient(GradientType.normal)(AppSub);
