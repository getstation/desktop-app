import * as React from 'react';
import injectSheet from 'react-jss';
import { ThemeTypes } from '../../types';
import svg, { SvgSymbol as IconSymbol } from './svg';
import classNames = require('classnames');

export { SvgSymbol as IconSymbol } from './svg';

export interface IconOwnProps {
  classes?: {
    icon: string,
  },
  symbolId: IconSymbol,
  width?: number,
  height?: number,
  size?: number | string,
  color?: string,
}
export type IconProps = React.HTMLProps<SVGSVGElement> & IconOwnProps;

const styles = (theme: ThemeTypes) => ({
  icon: {
    width: ((props: IconProps) => props.width || props.size) as any,
    height: ((props: IconProps) => props.height || props.size) as any,
    fill: ((props: IconProps) => props.color || theme.icons.color.base) as any,
  },
});

export class IconImpl extends React.PureComponent<IconProps, {}> {
  render() {
    const { classes, symbolId } = this.props;
    const svgProps = { ...this.props };
    [
      'classes', 'symbolId', 'width', 'height', 'size', 'color', 'className', 'sheet', 'theme',
    ].forEach(prop => {
      if (prop in svgProps) delete (svgProps as any)[prop];
    });

    const SvgComponent = svg[symbolId];

    return (
      <SvgComponent className={classNames(classes!.icon, this.props.className)} {...svgProps} />
    );
  }
}

export const Icon = injectSheet(styles)(IconImpl) as typeof IconImpl;
