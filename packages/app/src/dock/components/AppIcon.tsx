import * as React from 'react';
// @ts-ignore no declaration file
import injectSheet from 'react-jss';
import { createStyles, ThemeTypes } from '@getstation/theme';

interface Props {
  classes?: any,
  imgUrl?: string,
  themeColor?: string,
  size?: number,
}

const styles = (theme: ThemeTypes) => createStyles({
  container: {
    position: 'relative',
    width: (props: Props) => props.size || 30,
    height: (props: Props) => props.size || 30,
    borderRadius: 100,
    backgroundColor: (props: Props) => props.themeColor,
    overflow: 'hidden',
    flexShrink: 0,
  },
  icon: {
    position: 'absolute',
    width: '100%',
    transform: 'scale(1.2)',
  },
});

class AppIcon extends React.PureComponent<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const { classes, imgUrl } = this.props;

    return (
      <div className={classes.container}>
      {
        imgUrl ?
        <img className={classes.icon} src={imgUrl} alt="" />
        :
        <span>&nbsp;</span>
      }
      </div>
    );
  }
}

export default injectSheet(styles)(AppIcon) as React.ComponentType<Props>;
