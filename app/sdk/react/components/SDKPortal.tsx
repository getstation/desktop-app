import * as React from 'react';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { withSDK } from '../../context';
import { BxSDK } from '../../index';

interface Props {
  id: string,
  sdk: BxSDK
  onComponentsChanged?: (n: number) => void;
}

interface State {
  components?: React.ComponentClass[],
}

export class SDKPortalDest extends React.PureComponent<Props, State> {

  private subscription: Subscription;
  private observable: Observable<React.ComponentClass[]>;

  constructor(props: Props) {
    super(props);
    this.state = {};
    this.observable = props.sdk.react.provider.portals.get(props.id);
  }

  componentDidMount() {
    const { onComponentsChanged } = this.props;
    onComponentsChanged && onComponentsChanged(0);
    this.subscription = this.observable.subscribe((value) => {
      onComponentsChanged && onComponentsChanged(value.length);
      this.setState({
        components: value,
      });
    });
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  render() {
    if (this.state.components) {
      return this.state.components.map((c, i) => React.createElement(c, { key: i.toString() }));
    }
    return null;
  }
}

export default withSDK()(SDKPortalDest);
