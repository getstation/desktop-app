import { Icon, IconSymbol, Tooltip } from '@getstation/theme';
import * as React from 'react';
import { createUseStyles } from 'react-jss';
import { colors } from '@src/theme';
import classNames from 'classnames';

const useStyles = createUseStyles({
  main: {
    height: 20,
    width: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.blueGray30,
    borderRadius: 2,
    position: 'relative',
    outline: 'none',
  },
  icon: {
    opacity: 0.8,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    '& path': {
      fill: colors.blueGray100,
    },

    '&.disabled': {
      opacity: 0.2,
    },
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: colors.blueGray10,
    color: colors.blueGray100,
    borderRadius: 3,
    letterSpacing: '0.5px',
    fontSize: 10,
    whiteSpace: 'nowrap',
    top: '-125%',
    padding: [3, 4],
    boxShadow: `0 2px 4px 1px rgba(0, 0, 0, 0.08), 0 0 0 0.5px ${colors.blueGray30}`,
  },
});

type SquaredIconProps = {
  icon: IconSymbol,
  tooltip?: string,
  size?: number,
  onClick: () => void,
  disabled?: boolean,
};

const SquaredIcon: React.FunctionComponent<SquaredIconProps> = (
  { icon: symbolId, tooltip, size = 24, onClick, disabled }
) => {
  const classes = useStyles();

  const [showTooltip, setShowTooltip] = React.useState(false);

  return (
    <button
      className={classes!.main}
      onClick={onClick}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      disabled={disabled}
    >
      {
        tooltip &&
        showTooltip &&
        <Tooltip className={classes!.tooltip}>{tooltip}</Tooltip>
      }
      <Icon
        symbolId={symbolId}
        size={size}
        className={classNames(classes!.icon, { disabled })}
      />
    </button>
  );
};

export default SquaredIcon;
