import * as React from 'react';
// @ts-ignore : react-jss has no ts definitions
import injectSheet from 'react-jss';
import classNames from 'classnames';

// STYLE

export interface Classes {
  container: string,
  picture: string,
}

const styles = {
  container: (props: Props) => ({
    height: props.size || 34,
    width: props.size || 34,
  }),
  picture: (props: Props) => ({
    border: `2px solid ${props.borderColor || 'white'}`,
    width: props.size || 34,
    height: props.size || 34,
    borderRadius: 100,
    marginTop: -2,
  }),
};

// PROPS

interface Props {
  item: RoundedItem,
  /**
   * Outer classname.
   */
  className?: string,
  style?: React.CSSProperties,
  size?: number,
  borderColor?: string,
}

export interface RoundedItem {
  name: string,
  picture: string,
}

// COMPONENT

const RoundPictureImpl = ({
  className,
  classes,
  item,
  style,
}: Props & { classes: Classes }) => (
  <div className={classNames(classes.container, className)} style={style}>
    <img className={classes!.picture} src={item.picture} alt={item.name} />
  </div>
);

export const RoundPicture = injectSheet(
  // @ts-ignore
  styles
)(RoundPictureImpl) as React.ComponentType<Props>;
