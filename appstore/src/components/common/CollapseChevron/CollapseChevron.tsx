import { Icon, IconSymbol } from '@getstation/theme';
import * as React from 'react';
import { createUseStyles } from 'react-jss';
import { colors } from '@src/theme';

export type CollapseChevronProps = {
  onClick: () => void,
};

const useStyles = createUseStyles({
  collapseChevron: {
    top: 0,
    right: 0,
    width: '100%',
    height: '100%',
    position: 'absolute',
    textAlign: 'center',
    zIndex: 1,
    '& > svg': {
      position: 'absolute',
      top: '40%',
      right: 30,
      transform: 'translateX(50%) rotate(-90deg)',
      '& > path': {
        fill: colors.blueGray100,
        opacity: 0.5,
      },
    },
  },
});

const CollapseChevron = (props: CollapseChevronProps) => {
  const classes = useStyles(props);

  const { onClick } = props;

  return (
    <div className={classes!.collapseChevron} onClick={onClick}>
      {/* todo: add ARROW_DOWN icon */}
      <Icon symbolId={IconSymbol.ARROW_BACK} size={28}/>
    </div>
  );
};

export default CollapseChevron;
