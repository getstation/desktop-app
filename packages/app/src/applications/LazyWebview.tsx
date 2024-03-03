import * as React from 'react';
import ElectronWebview, { ElectronWebviewProps } from '../common/components/ElectronWebview';

export interface Props extends ElectronWebviewProps {
  loading: boolean,
  webviewRef(ref: ElectronWebview): void,
}

class LazyWebview extends React.PureComponent<Props, {}> {

  props: Props;
  webview: ElectronWebview;

  static renderNoWebview() {
    return (
      <div
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        Webviews disabled because <code> STATION_NO_WEBVIEWS </code> is set
      </div>
    );
  }

  componentDidMount() {
    if (process.env.STATION_NO_WEBVIEWS) {
      // Simulate domReady
      setTimeout(
        () => {
          if (this.props.onDomReady) {
            this.props.onDomReady(new Event('ready'));
          }
        },
        1000
      );
    }
  }

  render() {
    if (process.env.STATION_NO_WEBVIEWS) {
      return LazyWebview.renderNoWebview();
    }
    if (!this.props.initialSrc || this.props.loading) {
      return null;
    }
    return (
      <ElectronWebview
        {...this.props}
        ref={this.props.webviewRef}
      />
    );
  }
}

export default LazyWebview;
