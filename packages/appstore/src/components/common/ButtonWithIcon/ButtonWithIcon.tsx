import { Button, Icon, IconSymbol, ButtonProps } from '@getstation/theme';
import * as React from 'react';
import { createUseStyles } from 'react-jss';
import { colors } from '@src/theme';

const useStyles = createUseStyles({
  button: {
    backgroundColor: [colors.stationBlue, '!important'],
    boxShadow: '0 2px 4px 0 rgba(22, 77, 156, 0.5)',
    fontSize: 12,
    '& span': {
      display: 'flex',
      alignItems: 'center',
      whiteSpace: 'nowrap',
    },
    padding: [0, 15 , 0 , 12],
  },
  icon: {
    display: 'inline-block',
    backgroundPosition: 'center',
    marginBottom: 1,
  },
});

export type IButtonWithIconProps = {
  label: string;
  icon: IconSymbol;
} & ButtonProps;

export const ButtonWithIcon = (
  { label, icon, ...props }: IButtonWithIconProps,
) => {
  const classes = useStyles();

  return (
    <Button
      className={classes!.button}
      {...props}
    >
      <Icon
        className={classes!.icon}
        symbolId={icon}
        size={18}
      />
      {label}
    </Button>
  );
};
