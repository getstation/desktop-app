import { Button, Style, ThemeTypes as Theme } from '@getstation/theme';
import Maybe from 'graphql/tsutils/Maybe';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';

export interface Classes {
  container: string,
  button: string,
}

export interface Props {
  classes?: Classes,
  applicationName: Maybe<string>,
  canGoBack: boolean,
  onGoBack: () => void,
  onClickResetApplication: () => void,
  onDidMount: () => void,
}

const styles = (_theme: Theme) => ({
  container: {
    color: 'white',
    textAlign: 'center',
  },
  button: {
    width: '100%',
    marginTop: 20,
  },
});

@injectSheet(styles)
export default class ApplicationAboutBlank extends React.PureComponent<Props, {}> {
  static defaultProps = {
    onDidMount: () => {},
  };

  componentDidMount() {
    this.props.onDidMount();
  }

  handleClickResetApplication = () => {
    this.props.onClickResetApplication();
  }

  handleClickGoBack = () => {
    this.props.onGoBack();
  }

  render() {
    const { classes, applicationName, canGoBack } = this.props;


    console.log(`ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ  ApplicationAboutBlank`);

    

    return (
      <div className={classes!.container}>
        <div>
          <div>Something went wrong with {applicationName}, you navigated on a blank page</div>
          <Button
            btnStyle={Style.SECONDARY}
            className={classes!.button}
            onClick={canGoBack ? this.handleClickGoBack : this.handleClickResetApplication}
          >
            {canGoBack ? 'Go Back' : 'Reset application'}
          </Button>
        </div>
      </div>
    );
  }
}
