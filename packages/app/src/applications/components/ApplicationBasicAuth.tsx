import { Button, Style, ThemeTypes as Theme } from '@getstation/theme';
import Maybe from 'graphql/tsutils/Maybe';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';

export interface Classes {
  container: string,
  title: string,
  host: string,
  realm: string,
  form: string,
  input: string,
  button: string,
}

export interface Props {
  classes?: Classes,
  applicationIcon: Maybe<string>,
  performBasicAuth: (username: string, password: string) => any,
  authInfoHost: string,
  authInfoRealm: string,
}

export interface State {
  username: string,
  password: string,
}

const styles = (_theme: Theme) => ({
  container: {
    width: 240,
    color: 'white',
    textAlign: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 300,
    marginBottom: 5,
  },
  host: {
    fontStyle: 'italic',
  },
  realm: {
    margin: '40px 0 20px',
    fontSize: 17,
  },
  form: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  input: {
    width: '100%',
    border: 0,
    padding: 10,
    color: 'white',
    backgroundColor: 'rgba(255, 255, 255, .3)',
    fontSize: 15,
    borderRadius: 3,
    '&::-webkit-input-placeholder': {
      color: '#CCC',
    },
    '&:first-of-type': {
      marginBottom: 10,
    },
  },
  button: {
    width: '100%',
    marginTop: 20,
  },
});

@injectSheet(styles)
export default class BasicAuth extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      username: '',
      password: '',
    };
  }

  handleBasicAuth(event: Event) {
    event.preventDefault();
    const { username, password } = this.state;
    this.props.performBasicAuth(username, password);
    this.setState({ username: '', password: '' });
  }

  handleUsernameChange(event: Event) {
    this.setState({ username: event.target.value });
  }

  handlePasswordChange(event: Event) {
    this.setState({ password: event.target.value });
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes!.container}>
        <div className={classes!.title}>Authentication</div>

        <div className={classes!.host}>
          {this.props.authInfoHost}
        </div>

        <div className={classes!.realm}>
          {this.props.authInfoRealm}
        </div>

        <form className={classes!.form} onSubmit={e => this.handleBasicAuth(e)}>
          <input
            className={classes!.input}
            type="text"
            name="login"
            placeholder="Login"
            value={this.state.username}
            onChange={e => this.handleUsernameChange(e)}
            autoFocus={true}
          />

          <input
            className={classes!.input}
            type="password"
            name="password"
            placeholder="Password"
            value={this.state.password}
            onChange={e => this.handlePasswordChange(e)}
          />

          <Button
            className={classes!.button}
            btnStyle={Style.SECONDARY}
            type="submit"
          >
            Connect
          </Button>
        </form>
      </div>
    );
  }
}
