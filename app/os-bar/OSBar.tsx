import * as classNames from 'classnames';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import DockNavigationButtons from '../dock-navigation/components/DockNavigationButtons';
import TrafficLightsContainer from '../dock/components/TrafficLightsContainer';

export interface Classes {
  container: string,
  navigation: string,
}

export interface Props {
  classes?: Classes,
  themeGradient: string,
  title: string,
  onDoubleClick: () => any,
  onClose: () => any,
  canGoBack?: boolean,
  canGoForward?: boolean,
  onGoBack?: () => any,
  onGoForward?: () => any,
}

const styles = () => ({
  container: {
    backgroundColor: 'transparent',
  },
  navigation: {
    margin: [-2, 0, -0, 10],
  },
});

@injectSheet(styles)
export default class OSBar extends React.PureComponent<Props, {}> {
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
    const { title, onClose, onDoubleClick, classes, canGoBack, canGoForward } = this.props;

    return (
      <div className={classNames('l-osbar', classes!.container)} onDoubleClick={onDoubleClick}>
        <TrafficLightsContainer onClose={onClose} />

        <div className={classes!.navigation}>
          <DockNavigationButtons
            canGoBack={canGoBack}
            canGoForward={canGoForward}
            onGoBack={this.handleGoBack}
            onGoForward={this.handleGoForward}
          />
        </div>

        {title &&
        <span
          className="l-osbar--title"
        >
          {title}
        </span>
        }
      </div>
    );
  }
}
