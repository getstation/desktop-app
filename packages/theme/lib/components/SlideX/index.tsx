import * as React from 'react';
import injectSheet, { WithSheet } from 'react-jss';
import { IgnoreJSSNested } from '../../types';

interface OwnProps {
  step: number,
  alignItems?: 'start' | 'end',
}

const styles = {
  stepAnimationContainer: {
    overflowX: 'hidden',
    width: '100%',
  },
  stepAnimation: {
    transition: 'transform .6s',
    display: 'flex',
    alignItems: (
      ({ alignItems }: OwnProps) => alignItems === 'start' ? 'flex-start' : 'flex-end'
    ) as any,
    justifyContent: 'flex-start',
    width: '100%',
    transform: (({ step }: OwnProps) => step ? `translateX(-${step * 100}%)` : 'translateX(0)') as any,

    '& > *': {
      minWidth: '100%',
    },
  },
};

type Props = OwnProps & WithSheet<IgnoreJSSNested<typeof styles>, {}>;

class SlideXImpl extends React.PureComponent<Props, {}> {

  static defaultProps = {
    step: 0,
  };

  render() {
    const { classes, children } = this.props;

    return (
      <div className={classes!.stepAnimationContainer}>
        <div className={classes!.stepAnimation}>
          {children}
        </div>
      </div>
    );
  }
}

export const SlideX = injectSheet(styles as IgnoreJSSNested<typeof styles>)(SlideXImpl);
