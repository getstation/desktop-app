import { Icon, IconSymbol, ThemeTypes } from '@getstation/theme';
import * as classNames from 'classnames';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import { MinimalApplication } from '../../applications/graphql/withApplications';
import AppIcon from '../../dock/components/AppIcon';

export interface IClasses {
  container: string,
  translated: string,
  removeAnimation: string,
  icon: string,
  closeOverlay: string,
}

export interface IProps {
  classes?: IClasses,
  application: MinimalApplication & { position?: DOMRect },
  indexPosition: number,
  onRemove?: (
    application: MinimalApplication,
    iconRef: React.RefObject<HTMLDivElement>,
  ) => any
}

export interface IState {
  translated: boolean,
  removeAnimation: boolean,
}

@injectSheet((theme: ThemeTypes) => ({
  container: {
    position: 'relative',
    marginBottom: 10,
    ...theme.mixins.size(30),
    borderRadius: 100,
    transition: 'all 400ms, transform 800ms cubic-bezier(0.4, 0.09, 0.3, 1.14)',
    cursor: (props: IProps) => props.onRemove ? 'pointer' : 'inherit',
    opacity: 1,
    '&:hover $closeOverlay': {
      opacity: 1,
    },
  },
  translated: {
    visibility: 'hidden',
    transform: ({ application: { position }, indexPosition }: IProps) =>
      position ? `translate(-${500 - position.x}px, ${position.y - (40 * indexPosition) - 60}px)` : 'initial',
  },
  removeAnimation: {
    opacity: 0,
    transform: 'scale(0)',
    height: 0,
    margin: 0,
  },
  icon: {
    ...theme.mixins.size(30),
    borderRadius: 100,
  },
  closeOverlay: {
    position: 'absolute',
    top: 0,
    ...theme.mixins.size(30),
    borderRadius: 100,
    backgroundColor: 'rgba(0, 0, 0, .5)',
    opacity: 0,
    transition: '300ms',
  },
}))
export class OnboardingDockIcon extends React.PureComponent<IProps, IState> {
  iconRef: React.RefObject<HTMLDivElement>;

  constructor(props: IProps) {
    super(props);

    this.state = {
      translated: true,
      removeAnimation: false,
    };

    this.iconRef = React.createRef();

    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      return this.setState({ translated: false });
    }, 100);
  }

  handleClick() {
    const { application, onRemove } = this.props;

    this.setState({ removeAnimation: true }, () =>
      setTimeout(
        () =>
          onRemove && onRemove(application, this.iconRef.current)
        , 1000,
      )
    );
  }

  render() {
    const { classes, application, onRemove } = this.props;

    const containerClasses = classNames(
      classes!.container,
      { [classes!.translated]: this.state.translated },
      { [classes!.removeAnimation]: this.state.removeAnimation },
    );

    return (
      <div ref={this.iconRef} className={containerClasses} onClick={onRemove ? this.handleClick : undefined}>
        <div className={classes!.icon}>
          <AppIcon imgUrl={application.iconURL} themeColor={application.themeColor} />
        </div>

        {onRemove && <div className={classes!.closeOverlay}>
          <Icon symbolId={IconSymbol.CROSS} size={30} />
        </div>}
      </div>
    );
  }
}
