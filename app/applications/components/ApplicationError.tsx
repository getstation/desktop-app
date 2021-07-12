import { Button, Style, ThemeTypes as Theme } from '@getstation/theme';
// @ts-ignore: no declaration file
import * as networkErrors from 'chromium-net-errors';
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
  crashed: boolean,
  errorCode: any,
  errorDescription: any,
  webView: any,
  applicationName: Maybe<string>,
  tabUrl: string,
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
export default class ApplicationLoadingContainer extends React.PureComponent<Props, {}> {
  hasError = () => {
    if (this.props.crashed) return true;
    return typeof this.props.errorCode === 'number';
  }

  handleReloadClick() {
    if (this.props.webView && this.props.webView.isReady()) this.props.webView.reload();
  }

  renderErrorMessage = () => {
    const { crashed, errorCode, errorDescription, tabUrl } = this.props;
    const errorObject = this.hasError() ? networkErrors.createByCode(errorCode) : null;

    if (!crashed && errorObject) {
      return (
        <>
          <div>{errorObject.message} ({errorCode}:{errorDescription})</div>
          <div>URL: {tabUrl}</div>
        </>
      );
    }
    return null;
  }

  render() {
    const { classes, applicationName } = this.props;

    return (
      <div className={classes!.container}>
        { this.hasError() &&
          <div>
            <div>We can't load {applicationName}...</div>
            {this.renderErrorMessage()}
            <Button
              btnStyle={Style.SECONDARY}
              className={classes!.button}
              onClick={() => this.handleReloadClick()}
            >
              Try reloading
            </Button>
          </div>
        }
      </div>
    );
  }
}
