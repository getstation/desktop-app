import Maybe from 'graphql/tsutils/Maybe';
import * as React from 'react';
// @ts-ignore
import injectSheet from 'react-jss';

export interface Classes {
  container: string,
  icon: string,
  content: string,
}

export interface Props {
  classes?: Classes,
  applicationName: Maybe<string>,
  manifestURL: Maybe<string>,
  email: Maybe<string>,
  applicationIcon: Maybe<string>,
}

const styles = {
  container: {
    maxWidth: 500,
    textAlign: 'center',
  },
  content: {
    color: 'white',
    fontSize: 13,
  },
};

@injectSheet(styles)
export default class Loading extends React.PureComponent<Props, {}> {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes!.container}>
        <div className={classes!.content}>
          <p><strong>Wait while we load {this.props.applicationName}...</strong></p>

          { this.props.email &&
          <span>You are logged in as {this.props.email}</span>
          }
        </div>
      </div>
    );
  }
}
