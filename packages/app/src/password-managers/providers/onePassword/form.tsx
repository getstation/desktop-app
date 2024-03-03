import { Button, Input, InputType, Style, ThemeTypes as Theme } from '@getstation/theme';
// @ts-ignore: no declaration file
import * as isBlank from 'is-blank';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import { AddPasswordManagerAction, ConfigurationStep } from '../../duck';
import Providers from '../../providers';
import { Provider } from '../../types';

export interface Classes {
  buttonsContainer: string,
  marginBottom: string,
  error: string,
  onboard: string,
}

export interface Props {
  classes?: Classes,
  configurationProcess: AddPasswordManagerAction,
  onConnect: (provider: Provider, payload: object) => any,
  onCancel: (provider: Provider) => any,
  error: string,
}

export interface OverridableProps {
}

export interface State {
  id: string,
  domain: string,
  email: string,
  secretKey: string,
  masterPassword: string,
  errors: any,
}

const styles = (theme: Theme) => ({
  onboard: {
    marginBottom: 8,
    fontSize: '12px',
    color: 'rgba(255,255,255,1)',
    textAlign: 'left',
    fontStyle: 'italic',
    fontWeight: 600,
    '& a': {
      color: 'rgba(255,255,255,0.6)',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 30,
    '& button': {
      width: '48%',
    },
  },
  marginBottom: {
    marginBottom: 15,
  },
  error: {
    marginBottom: 15,
    ...theme.fontMixin(12, 'bold'),
    color: theme.colors.error,
  },
});

@injectSheet(styles)
export default class OnePasswordForm extends React.PureComponent<Props & OverridableProps, State> {
  static onePasswordDomains = ['.1password.com', '.1password.ca', '1password.eu'];

  constructor(args: any) {
    super(args);
    this.state = {
      id: '',
      domain: '',
      email: '',
      secretKey: '',
      masterPassword: '',
      errors: {},
    };

    this.onSubmitCredentials = this.onSubmitCredentials.bind(this);
  }

  static trimCredentials(credentials: any) {
    const domainOnly = credentials.domain.replace(/^https?:\/\//, '').toLowerCase().split('/')[0];
    const credentialsWithDomainOnly = Object.assign({}, credentials, { domain: domainOnly, id: domainOnly });
    return Object
      .entries(credentialsWithDomainOnly)
      .map(([k, v]: any[]) => [k, v.trim()])
      .reduce((result, [k, v]) => {
        result[k] = v;
        return result;
      }, {});
  }

  // tslint:disable-next-line:function-name
  UNSAFE_componentWillUpdate(nextProps: Readonly<Props>) {
    const { configurationProcess: { step } } = this.props;

    if (step === ConfigurationStep.Test && nextProps.configurationProcess.step === ConfigurationStep.Error) {
      this.setState({ masterPassword: '' });
    }
  }

  onSubmitCredentials() {
    const { errors, ...credentials } = this.state;
    const cleanCredentials = OnePasswordForm.trimCredentials(credentials);

    if (this.isValidFormatCredentials(cleanCredentials)) {
      this.props.onConnect(Providers.onePassword, cleanCredentials);
    }
  }

  isValidFormatCredentials(credentials: any) {
    // tslint:disable-next-line:max-line-length
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const { domain, email, secretKey, masterPassword } = credentials;

    const validDomain = !isBlank(domain) && OnePasswordForm.onePasswordDomains.some(opDomain => domain.endsWith(opDomain));
    const validEmail = !isBlank(email) && emailRegex.test(email.toLowerCase());
    const validSecretKey = !isBlank(secretKey) && secretKey.length >= 34 && secretKey.split('-')[0].length === 2;
    const validMasterPassword = !isBlank(masterPassword);

    const isValidCredentialsFormat = validDomain && validEmail && validSecretKey && validMasterPassword;

    const errors: any = {};

    if (!validDomain) errors.domain = 'Invalid 1Password domain format';
    if (!validEmail) errors.email = 'Invalid email format';
    if (!validSecretKey) errors.secretKey = 'Invalid Secret Key format';
    if (!validMasterPassword) errors.masterPassword = 'Master Password required';

    if (!isValidCredentialsFormat) this.setState({ errors });

    return isValidCredentialsFormat;
  }

  render() {
    const { classes, error, onCancel } = this.props;

    return (
      <div>
        <div className={classes!.onboard}>
          👉
          <a
            href="http://faq.getstation.com/login-and-passwords/how-to-use-1password-integration"
            target="_blank"
          >
            Detailed instructions on 1Password
          </a>
        </div>
        { error &&
          <div className={classes!.error}>{error}</div>
        }
        <Input
          type={InputType.TEXT}
          label={'Domain'}
          className={classes!.marginBottom}
          autoFocus={true}
          error={this.state.errors.domain}
          placeholder={'domain.1password.com'}
          value={this.state.domain}
          onChange={(event: any) => this.setState({ id: event.target.value, domain: event.target.value })}
        />

        <Input
          type={InputType.TEXT}
          label={'Email'}
          className={classes!.marginBottom}
          error={this.state.errors.email}
          placeholder={'your@email.com'}
          value={this.state.email}
          onChange={(event: any) => this.setState({ email: event.target.value })}
        />

        <Input
          type={InputType.TEXT}
          label={'Secret Key'}
          className={classes!.marginBottom}
          error={this.state.errors.secretKey}
          placeholder={'XX-XXXXXX-XXXXXX-XXXXXX'}
          value={this.state.secretKey}
          onChange={(event: any) => this.setState({ secretKey: event.target.value.toUpperCase() })}
        />

        <Input
          type={InputType.PASSWORD}
          label={'Master Password'}
          className={classes!.marginBottom}
          error={this.state.errors.masterPassword}
          placeholder={'******'}
          value={this.state.masterPassword}
          onChange={(event: any) => this.setState({ masterPassword: event.target.value })}
        />

        <div className={classes!.buttonsContainer}>
          <Button
            btnStyle={Style.SECONDARY}
            onClick={() => {
              onCancel(Providers.onePassword);
            }}
          >
            Cancel
          </Button>
          <Button
            btnStyle={Style.PRIMARY}
            onClick={this.onSubmitCredentials}
          >
            Log in
          </Button>
        </div>
      </div>
    );
  }
}
