import * as React from 'react';
import { ThemeTypes as Theme } from '@getstation/theme';
import * as memoize from 'memoizee';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { delay } from 'redux-saga';
// @ts-ignore: no declaration file
import { updateUI } from 'redux-ui/transpiled/action-reducer';

import { orderedManifestsUrls } from '../../applications/selectors';
import { getUISettingsManifestURL } from '../../ui/selectors';
import { StationState } from '../../types';
import App from './App';

interface Classes {
  container: string,
  title: string,
}

type OwnProps = {
  classes?: Classes,
  onModalStateChanged: (isOpened: boolean) => void,
};

interface StateProps {
  manifestsUrls: string[],
  selectedManifestURL?: string,
}

interface DispatchProps {
  setSelectedManifestURL: (id?: string) => void,
  closeSettings: () => void,
}

type Props = OwnProps & StateProps & DispatchProps;

interface State {
  selectedManifestURL?: string,
}

const isModalOpened = (_state: State) => false;
// state.toRemove.instances.size > 0;

const getManifestsOrder = (manifestsUrls: string[]) =>
  manifestsUrls.reduce(
    (slug: string, manifestsUrl) =>
      slug + manifestsUrl,
    ''
  );

@injectSheet((theme: Theme) => ({
  container: {
  },
  title: {
    ...theme.titles.h1,
    marginBottom: 30,
  },
}))
class SettingsMyAppsImpl extends React.PureComponent<Props, State> {
  public state: State = {
    selectedManifestURL: undefined,
  };

  private readonly manifestURLsRef: Record<string, HTMLDivElement>;
  private mounted: boolean = false;

  constructor(props: Props) {
    super(props);

    this.manifestURLsRef = {};
  }

  /**
   * Attach the the nodeRef in a memoize way for performance reason
   * in render.
   */
  // tslint:disable-next-line
  refAttacher = memoize((manifestURL: string) => (node: HTMLDivElement) => {
    this.manifestURLsRef[manifestURL] = node;
  });

  componentDidMount() {
    this.mounted = true;

    setTimeout(
      () => this.scrollToSelectedManifestURL(),
      100
    );
  }

  componentDidUpdate(_: Props, prevState: State) {
    const isOpened = !isModalOpened(prevState) && isModalOpened(this.state);

    if (isOpened) {
      this.props.onModalStateChanged(true);
    }

    this.props.onModalStateChanged(false);
  }

  safeSetState(newState: Partial<State>) {
    if (this.mounted) {
      this.setState(newState as any);
    }
  }

  scrollToSelectedManifestURL = async () => {
    if (this.props.selectedManifestURL) {
      const manifestRef = this.manifestURLsRef[this.props.selectedManifestURL];

      if (manifestRef) {
        manifestRef.scrollIntoView({ behavior: 'smooth' });
        await delay(100);
        this.safeSetState({ selectedManifestURL: this.props.selectedManifestURL });
        await delay(1000);
        this.safeSetState({ selectedManifestURL: undefined });
      }
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    this.props.setSelectedManifestURL(undefined);
  }

  // tslint:disable-next-line:function-name
  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    const selectedManifestURL = nextProps.selectedManifestURL;

    if (selectedManifestURL) {
      const currentAppOrder = getManifestsOrder(this.props.manifestsUrls);
      const nextAppOrder = getManifestsOrder(this.props.manifestsUrls);

      if (currentAppOrder !== nextAppOrder) {
        setImmediate(() => this.scrollToSelectedManifestURL());
      }
    }
  }

  render() {
    const { classes, manifestsUrls } = this.props;

    const items = manifestsUrls.map(manifestURL => (
      <App
        key={manifestURL}
        manifestURL={manifestURL}
        attachAppRef={this.refAttacher(manifestURL)}
        closeSettings={this.props.closeSettings}
      />
    ));

    return (
      <div className={classes!.container}>
        <div className={classes!.title}>My Apps</div>

        <div>
          {items}
        </div>
      </div>
    );
  }
}

const SettingsMyApps = connect<StateProps, DispatchProps>(
  (state: StationState) => ({
    manifestsUrls: orderedManifestsUrls(state),
    selectedManifestURL: getUISettingsManifestURL(state),
  }),
  (dispatch) => bindActionCreators(
    {
      setSelectedManifestURL: (manifestURL?: string) =>
        updateUI('settings', 'selectedManifestURL', manifestURL),
      closeSettings: () => updateUI('settings', 'isVisible', false),
    },
    dispatch
  ),
  null,
  { withRef: true },
)(SettingsMyAppsImpl);

export default SettingsMyApps;
