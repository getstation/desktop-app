import { SDK } from '@getstation/sdk';
import { Button, Icon, IconSymbol, Size, Style } from '@getstation/theme';
import * as decode from 'jwt-decode';
import memoizee = require('memoizee');
import * as React from 'react';
import injectSheet from 'react-jss';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getIconPath } from '../../helpers';
import { removeToken, requestAddToken } from '../duck.renderer';
import { RemoveTokensAction, RequestAddTokensAction, State, Tokens } from '../types';

export interface Classes {
  container: string,
  title: string,
  logo: string,
  description: string,
  itemWrapper: string,
  item: string,
}

export type StateProps = {
  classes?: Classes,
  tokens?: Tokens,
};

export type DispatchProps = {
  addAccount: () => void,
  removeAccount: (accessToken: string) => void,
};

export type OwnProps = {
  sdk: SDK,
};

export type Props = StateProps & DispatchProps & OwnProps;

const styles = {
  container: {
    marginBottom: 20,
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    display: 'inline-block',
    width: 20,
    height: 20,
    marginRight: 7,
    borderRadius: 10,
    '& img': {
      width: 20,
      borderRadius: 10,
    },
  },
  description: {
    display: 'flex',
    alignItems: 'center',
  },
  itemWrapper: {
    margin: [20, 0],
  },
  item: {
    marginBottom: 5,
    '& button': {
      marginLeft: 30,
    },
  },
};

export class GDriveSearchSettingsImpl extends React.PureComponent<Props> {

  render() {
    const { classes } = this.props;
    const tokens = this.props.tokens ? Object.entries(this.props.tokens) : [];

    return (
      <div className={classes!.container}>
        <div className={classes!.title}>
          <div className={classes!.logo}>
            <img src={getIconPath('gdrive')} />
          </div>
          GOOGLE DRIVE
        </div>

        <p className={classes!.description}>
          <Icon symbolId={IconSymbol.SEARCH} size={25} />
          {tokens.length > 0 ?
            <span>The files of these accounts are accessible via the Quick-Switch</span>
            :
            <span>Connect a Google Drive account and your files will be <b>directly accessible</b> from within the Quick-Switch</span>
          }
        </p>

        <div className={classes!.itemWrapper}>
          {
            tokens.map(([key, t]) => {
              const user = getDecodedIdToken(t.id_token!);
              const isExpired = !user || t.expired;
              return <div
                key={t.access_token!}
                className={classes!.item}
              >
                <span>{isExpired ? <i>Expired account</i> : user.email}</span>
                <Button
                  btnStyle={Style.SECONDARY}
                  btnSize={Size.XSMALL}
                  onClick={() => {
                    this.props.removeAccount(key);
                    if (isExpired) this.props.addAccount();
                  }}
                >
                  {isExpired ? 'Refresh account' : 'Remove'}
                </Button>
              </div>;
            })
          }
        </div>

        <Button
          btnStyle={Style.SECONDARY}
          btnSize={Size.XSMALL}
          onClick={this.props.addAccount}
        >
          {tokens.length === 0 ? 'Connect Google Drive' : 'Add an account'}
        </Button>
      </div>
    );
  }
}

const getDecodedIdToken = memoizee((idToken: string) => idToken ? decode<any>(idToken) : null);

const GDriveSearchSettings = connect<StateProps, DispatchProps, OwnProps>(
  (state: State) => ({
    tokens: state.tokens,
  }),
  (dispatch, ownProps) => bindActionCreators({
    addAccount: () => {
      // TODO use side effect lib
      ownProps.sdk.ipc.publish({ type: 'REQUEST_ADD_TOKENS' } as RequestAddTokensAction);
      return requestAddToken();
    },
    removeAccount: (key: string) => {
      // TODO use side effect lib
      ownProps.sdk.ipc.publish({ type: 'REMOVE_TOKENS', key } as RemoveTokensAction);
      return removeToken(key);
    },
  }, dispatch)
)(injectSheet(styles)(GDriveSearchSettingsImpl));

export default GDriveSearchSettings;
