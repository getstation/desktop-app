import * as Immutable from 'immutable';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { getCurrentActiveTabProperty } from '../applications/utils';
import { executeWebviewMethodForCurrentTab } from '../tab-webcontents/duck';
import DockNavigationButtons from './components/DockNavigationButtons';

interface StateToProps {
  canGoBack: boolean,
  canGoForward: boolean,
}

interface DispatchFromProps {
  onGoBack: () => any,
  onGoForward: () => any,
}

type Props = StateToProps & DispatchFromProps;

class DockNavigationContainerImpl extends React.PureComponent<Props, {}> {
  constructor(props: Props) {
    super(props);

    this.handleGoBack = this.handleGoBack.bind(this);
    this.handleGoForward = this.handleGoForward.bind(this);
  }

  handleGoBack() {
    this.props.onGoBack();
  }

  handleGoForward() {
    this.props.onGoForward();
  }

  render() {
    return (
      <DockNavigationButtons
        canGoBack={this.props.canGoBack}
        canGoForward={this.props.canGoForward}
        onGoBack={this.handleGoBack}
        onGoForward={this.handleGoForward}
        showPopover={true}
      />
    );
  }
}

const DockNavigationContainer = connect<StateToProps, DispatchFromProps, {}>(
  (state: Immutable.Map<string, any>) => ({
    canGoBack: getCurrentActiveTabProperty(state, 'canGoBack'),
    canGoForward:getCurrentActiveTabProperty(state, 'canGoForward'),
  }),
  (dispatch: Dispatch<any>) => bindActionCreators(
    {
      onGoBack: () => executeWebviewMethodForCurrentTab('go-back'),
      onGoForward: () => executeWebviewMethodForCurrentTab('go-forward'),
    },
    dispatch
  )
)(DockNavigationContainerImpl);

export default DockNavigationContainer;
