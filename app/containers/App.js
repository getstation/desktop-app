import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// @ts-ignore: no declaration file
import { updateUI } from 'redux-ui/transpiled/action-reducer';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { isFullScreen, isKbdShortcutsOverlayVisible } from '../app/selectors';
import ShortcutsOverlay from '../app/components/ShortcutsOverlay';
import LoadingScreen from '../app/containers/LoadingScreen';
import { mainAppReady, setKbdShortcutsVisibility, toggleMaximize } from '../app/duck';
import ApplicationScene from '../applications/ApplicationScene';
import TransparentTitleBar from '../components/TransparentTitleBar';
import Dialogs from '../dialogs/Dialogs';
import DownloadToaster from '../dl-toaster/DownloadToaster';
import Dock from '../dock/Dock';
import Onboarding from '../onboarding/Onboarding';
import { isVisible } from '../onboarding/selectors';
import { getCursorIcon, getUISettingsActiveTabTitle, getUISettingsIsVisible } from '../ui/selectors';
import SettingsOverlay from '../settings/Container';
import SubdockItemDragLayer from '../subdock/components/SubdockItemDragLayer';
import LocationFragmentUpdater from './LocationFragmentUpdater';

@DragDropContext(HTML5Backend)
@connect(
  (state) => ({
    fullScreen: isFullScreen(state),
    kbdShortcutsOverlayVisibility: isKbdShortcutsOverlayVisible(state),
    isOnboardingVisible: isVisible(state),
    cursorIcon: getCursorIcon(state),
    settingsActiveTabTitle: getUISettingsActiveTabTitle(state),
    isSettingsVisible: getUISettingsIsVisible(state),
  }),
  (dispatch) => bindActionCreators({
    onToggleMaximize: toggleMaximize,
    onAppReady: mainAppReady,
    setKbdShortcutsVisibility,
    setSettingsActiveTabTitle: title => updateUI('settings', 'activeTabTitle', title),
    setSettingsVisibility: isVisible => updateUI('settings', 'isVisible', isVisible),
  }, dispatch)
)
export default class App extends React.PureComponent {
  static propTypes = {
    fullScreen: PropTypes.bool,
    onToggleMaximize: PropTypes.func,
    onAppReady: PropTypes.func,
    setKbdShortcutsVisibility: PropTypes.func,
    kbdShortcutsOverlayVisibility: PropTypes.bool,
    currentSlackKey: PropTypes.string,
    isOnboardingVisible: PropTypes.bool,
    cursorIcon: PropTypes.string,
    settingsActiveTabTitle: PropTypes.string,
    setSettingsActiveTabTitle: PropTypes.func,
    isSettingsVisible: PropTypes.bool,
    setSettingsVisibility: PropTypes.func,
  };

  componentDidMount() {
    this.props.onAppReady();

    // Fixes the drag and drop interactions over Webviews
    //
    // When the drag happens on an element that is over
    // a Webview (or an iframe) the mouse events will be catched
    // by the webview and weird things will happen:
    // - `dragover` will be (apparently) duplicated in `webview`
    //   and parent document
    // - in Electron 5, we won't receive the `drag` etc. events
    //   only `dragstart` go thru. See https://github.com/electron/electron/issues/18226
    //
    // The idea is to add the `pointer-events: none` to the webviews
    // when a dragging session starts. `pointer-events: none` will
    // (temporarly) prevent the webviews from catching mouse events.
    //
    // Inspired from https://www.gyrocode.com/articles/how-to-detect-mousemove-event-over-iframe-element/
    const handleWebviewsWithDragEvents = (disablePointer) => {
      const webviews = document.querySelectorAll('webview');
      webviews.forEach((webview) => {
        webview.style.pointerEvents = disablePointer ? 'none' : 'initial';
      });
    };
    window.addEventListener('dragstart', () => handleWebviewsWithDragEvents(true));
    window.addEventListener('dragend', () => handleWebviewsWithDragEvents(false));
  }

  render() {
    const { fullScreen, isOnboardingVisible, cursorIcon } = this.props;

    return (
      <div className={classNames('l-container', `cursor-${cursorIcon}`, { 'l-fullscreen': fullScreen })}>
        <TransparentTitleBar onDoubleClick={this.props.onToggleMaximize} />
        <div className="l-appcontainer">
          <Dock />
          <ApplicationScene />
        </div>
        {isOnboardingVisible &&
          <Onboarding />
        }
        <DownloadToaster />
        <Dialogs />
        <div id="portal-application-scene" />

        {this.props.kbdShortcutsOverlayVisibility &&
        <ShortcutsOverlay
          setVisibility={this.props.setKbdShortcutsVisibility}
        />
        }
        {this.props.isSettingsVisible &&
        <SettingsOverlay
          activeTabTitle={this.props.settingsActiveTabTitle}
          setActiveTabTitle={this.props.setSettingsActiveTabTitle}
          setVisibility={this.props.setSettingsVisibility}
        />
        }
        <LoadingScreen />

        <SubdockItemDragLayer dragType={'DND_SUBDOCK_ITEM_FAVORITES'} />
        <SubdockItemDragLayer dragType={'DND_SUBDOCK_ITEM_TABS'} />
        <LocationFragmentUpdater />
      </div>
    );
  }
}
