import { Chooser, Input, Modal, ThemeTypes } from '@getstation/theme';
import * as Fuse from 'fuse.js';
// @ts-ignore: no declaration file
import * as isBlank from 'is-blank';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import { AccountsAction, AccountsStep } from '../duck';
import { Account, PasswordManager } from '../types';

export interface Classes {
  input: string,
  modalBody: string,
  body: string,
  noResults: string,
  chooser: string,
}

export interface Props {
  themeColor: string,
  classes?: Classes,
  applicationName: string,
  applicationManifestURL: string,
  applicationIcon: string,
  passwordManager: PasswordManager,
  process: AccountsAction,
  onSelect: (item: any) => any,
  onCancel: () => any,
}

export interface State {
  defaultQuery: string,
  query: string,
  accounts: Account[],
}

@injectSheet((theme: ThemeTypes) => ({
  input: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    boxSizing: 'border-box',
    marginTop: -10,
    padding: [0, 20, 10],
    backgroundColor: theme.colors.gray.light,
    zIndex: 1,
  },
  modalBody: {
    padding: '5px 0 !important',
  },
  body: {
    marginTop: 50,
    height: 180,
    '& input, input:hover:enabled, input:active:enabled': {
      backgroundColor: 'white',
    },
  },
  noResults: {
    ...theme.mixins.flexbox.containerCenter,
    height: '100%',
    boxSizing: 'border-box',
    padding: 60,
    ...theme.fontMixin(14, 500),
    lineHeight: '20px',
    color: theme.colors.gray.middle,
    textAlign: 'center',
  },
  chooser: {
    height: '100%',
    padding: [10, 20, 0],
    overflow: 'auto',
    boxSizing: 'border-box',
  },
}))
export default class AttachPasswordManagerItem extends React.PureComponent<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      defaultQuery: '',
      query: '',
      accounts: [],
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onSelect = this.onSelect.bind(this);
  }

  componentDidUpdate(prevProps: Readonly<Props>) {
    const { applicationName, process: { step, data } } = this.props;

    if (!(prevProps.process.step === AccountsStep.Load && step === AccountsStep.Loaded)) return;

    if (data) {
      const defaultQuery = applicationName;
      this.setState({ defaultQuery, accounts: data });
      this.search(defaultQuery);
    }
  }

  handleInputChange(event: any) {
    const query = event.target.value;
    this.setState({ query });
    this.search(query);
  }

  search(query: string) {
    const { process: { data } } = this.props;
    if (!data) return;

    const { defaultQuery } = this.state;
    const fuse = new Fuse(data, {
      keys: ['title', 'description'],
      shouldSort: true,
      threshold: 0.6,
    });

    if (isBlank(query)) {
      this.setState({ accounts: fuse.search(defaultQuery) });
    } else {
      this.setState({ accounts: fuse.search(query) });
    }
  }

  onCancel() {
    onCancel();
  }

  onSelect(account: Account) {
    onSelect(account);
  }

  render() {
    const { themeColor, classes, process, applicationName, applicationIcon, passwordManager: { providerName } } = this.props;
    const { query, accounts } = this.state;

    return (
      <Modal
        title={`Login with ${providerName}`}
        description={`Select your account to login to ${applicationName}`}
        onCancel={this.onCancel}
        applicationIcon={applicationIcon}
        themeColor={themeColor}
        classNameModalBody={classes!.modalBody}
        isLoading={process.step === AccountsStep.Load}
      >
        <div className={classes!.body}>
          <div className={classes!.input}>
            <Input
              autoFocus={true}
              type="search"
              placeholder="Search among your logins…"
              value={query}
              onChange={e => this.handleInputChange(e)}
            />
          </div>

          {accounts.length === 0 ?
            <div className={classes!.noResults}>
              😢 <br />
              Sorry, we couldn't find any accounts for "{query}"
            </div>
            :
            <Chooser
              className={classes!.chooser}
              items={accounts.map((account: Account) => ({ title: account.title, description: account.username, value: account }))}
              onSelect={this.onSelect}
            />
          }
        </div>
      </Modal>
    );
  }
}
