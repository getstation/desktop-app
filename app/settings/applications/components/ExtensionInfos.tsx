import { IconSymbol, Size, ThemeTypes as Theme, ButtonIcon, Style } from '@getstation/theme';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import {
  StatusState,
  checkForUpdate,
} from '../../../chrome-extensions/duck';
import {
  ExtensionState,
} from '../../../chrome-extensions/types';

type Classes = {
  container: string,
  description: string,
  subtitle: string,
  update: string,
};

type DefaultProps = {
  classes: Partial<Classes>,
};

type Props = DefaultProps & {
  extensionState: ExtensionState,
  onCheckForUpdate: typeof checkForUpdate,
};

type State = {
  updateWording: string,
};

@injectSheet((theme: Theme) => ({
  container: {
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'column',
    paddingBottom: 10,
  },
  description: {
    fontSize: 12,
    marginLeft: 15,
    maxWidth: '75%',
  },
  subtitle: {
    ...theme.fontMixin(12, 600),
    margin: [20, 0, 10],
  },
  update: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
}))
class ExtensionInfos extends React.PureComponent<Props, State> {
  static defaultProps: DefaultProps = {
    classes: {},
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      updateWording: '',
    };

    this.checkForUpdate = this.checkForUpdate.bind(this);
  }

  componentDidMount() {
    this.updateWording(this.props);
  }

  // tslint:disable-next-line:function-name
  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    this.updateWording(nextProps);
  }

  updateWording(props: Props) {
    const {
      extensionState,
    } = props;

    const { status, extensionUpdate } = extensionState;

    switch (status) {
      case StatusState.Updatable:
        this.setState({
          updateWording: `An update (v${extensionUpdate!.version.number}) is available and will be applied when Station restarts`,
        });
        break;
      case StatusState.CheckingForUpdate:
        this.setState({
          updateWording: 'Checking for updates...',
        });
        break;
      case StatusState.Loaded:
        this.setState({
          updateWording: 'You have the most recent version',
        });
        break;
      default:
        break;
    }
  }

  checkForUpdate() {
    const {
      extensionState,
      onCheckForUpdate,
    } = this.props;

    const { extension } = extensionState;

    onCheckForUpdate(extension!);
  }

  render() {
    const {
      extensionState,
      classes,
    } = this.props;

    const { updateWording } = this.state;

    return (
      <div className={classes.container}>
        <div className={classes!.subtitle}>
          EXTENSION {extensionState && extensionState.extension && `V${extensionState.extension!.version.number}`}
        </div >
        <div className={classes!.update}>
          <ButtonIcon
            text={'Check for updates'}
            symbolId={IconSymbol.UPDATE}
            btnStyle={Style.SECONDARY}
            btnSize={Size.XSMALL}
            onClick={this.checkForUpdate}
          />
          <i className={classes.description}>{updateWording}</i>
        </div >

      </div>
    );
  }
}

export default ExtensionInfos;
