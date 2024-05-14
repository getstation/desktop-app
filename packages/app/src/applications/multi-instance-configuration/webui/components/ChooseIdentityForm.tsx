import { Button, Size, Style } from '@getstation/theme';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import { identitiesStyle, IdentitiesStylesType } from './styles';

export interface Props {
  help?: string,
  instanceTypeWording?: string,
  name: string,
  onRequestSignin: () => void,
  onAccountChosen: (accountId: string) => void,
  classes?: IdentitiesStylesType,
}

interface State {
  identities: {
    type: string
    id: string,
    email: string,
    imageURL: string,
  }[]
}

@injectSheet(identitiesStyle)
export default class ChooseIdentityForm extends React.PureComponent<Props, State> {
  static defaultProps = {
    help: 'Choose an account',
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      identities: [],
    };
  }

  onClickAccount = (accountId: string) => {
    this.props.onAccountChosen(accountId);
  }

  onClickRequestSignin = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    this.props.onRequestSignin();
  }

  onIdentitiesChanged = (_: any, identities: any) => {
    this.setState({
      identities,
    });
  }

  UNSAFE_componentWillMount() {
    window.bxApi.identities.addIdentitiesChangeListener(this.onIdentitiesChanged);
  }

  componentWillUnmount() {
    window.bxApi.identities.removeIdentitiesChangeListener(this.onIdentitiesChanged);
  }

  render() {
    const { instanceTypeWording, name, help, classes } = this.props;
    const { identities } = this.state;

    return (
      <div>
        <div className={this.props.classes!.help}>
          {help}
        </div>
        <ul className={classes!.accountContainer}>
          {identities.map(account =>
            <li
              key={account.id}
              className={classes!.account}
              onClick={() => this.onClickAccount(account.id)}
            >
              <div className={classes!.accountDetail}>
                <img
                  className={classes!.accountImage}
                  src={account.imageURL}
                  alt={account.email}
                />
                <span className={classes!.accountEmail}>{account.email}</span>
              </div>
            </li>
          )}

          <div className={classes!.subContainer}>
            <Button
              btnSize={Size.NORMAL}
              btnStyle={Style.PRIMARY}
              onClick={this.onClickRequestSignin}
            >
              Add a new {instanceTypeWording === 'instance' ? `instance of ${name}` : instanceTypeWording}
            </Button>
          </div>
        </ul>
      </div>
    );
  }
}
