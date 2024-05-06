import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';

export interface Classes {
  backgroundLogo: string,
}

export interface Props {
  classes?: Classes,
}

const illustration = require('../../app/resources/illustration--half-logo.svg');

const styles = {
  backgroundLogo: {
    position: 'absolute',
    bottom: 8,
    right: 10,
    width: 298,
    height: 488,
    zIndex: -1,
  },
};

@injectSheet(styles)
export default class BackgroundLogo extends React.PureComponent<Props, {}> {
  render() {
    const { classes } = this.props;

    return <img src={illustration} className={classes!.backgroundLogo} alt="Station logo" />;
  }
}
