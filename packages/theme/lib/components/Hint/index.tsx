import * as React from 'react';
import injectSheet, { WithSheet } from 'react-jss';
import { Icon, IconSymbol } from '../Icon';
import { Tooltip } from '../Tooltip';

export enum STYLE {
  LIGHT,
  DARK,
}

interface Classes {
  container: string;
  tooltip: string;
  hint: string;
}

interface OwnProps {
  classes?: Classes;
  tooltip: string;
  style?: STYLE;
  size?: number;
  children: any;
}

const styles = {
  container: {
    display: 'inline-flex',
    alignItems: 'center',
  },
  tooltip: {
    marginTop: 5,
    marginLeft: 5,
  },
  hint: {
    width: 'initial',
    maxWidth: 250,
  },
};

type Props = OwnProps & WithSheet<typeof styles, {}>;

class HintImpl extends React.PureComponent<Props, {}> {
  static defaultProps = {
    style: STYLE.LIGHT,
    size: 15,
  };

  style: Object;

  constructor(props: Props) {
    super(props);

    this.style = {
      [STYLE.LIGHT]: 'rgba(255, 255, 255, .5)',
      [STYLE.DARK]: 'rgba(0, 0, 0, .5)',
    };
  }

  render() {
    const { classes, tooltip, style, size, children } = this.props;

    return (
      <div className={classes!.container}>
        <div>{children}</div>
        <Tooltip className={classes!.tooltip} tooltip={tooltip} hintClassname={classes!.hint}>
          <Icon symbolId={IconSymbol.HINT} color={this.style[style!]} size={size} />
        </Tooltip>
      </div>
    );
  }
}

export const Hint = injectSheet(styles)(HintImpl);
