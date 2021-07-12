import { Button, Size, Style, Tooltip } from '@getstation/theme';
import * as classNames from 'classnames';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import { styles, StylesType } from './styles';

const isBlank = require('is-blank') as (v: any) => boolean;

export interface Props {
  placeholder?: string,
  domainSuffix: string,
  help?: string,
  onSubmit: (subdomain: string) => void,
  classes?: StylesType,
  withNavigationLink?: boolean,
  onClickNavigate?: () => void,
  navigateWording?: string,
  navigateHint?: string,
  largeInput?: boolean,
}

interface State {
  subdomainValue: string,
}

@injectSheet(styles)
export default class ChooseCommonForm extends React.PureComponent<Props, State> {

  static defaultProps = {
    help: 'Enter your subdomain',
  };

  textInput: React.RefObject<HTMLInputElement>;

  constructor(props: Props) {
    super(props);
    this.textInput = React.createRef<HTMLInputElement>();
    this.state = {
      subdomainValue: '',
    };
  }

  onInputChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ subdomainValue: event.target.value })

  onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isBlank(this.state.subdomainValue)) {
      this.props.onSubmit(this.state.subdomainValue);
    }
  }

  componentDidMount() {
    // focus on the input when mounting
    if (this.textInput.current) {
      this.textInput.current.focus();
    }
  }

  render() {
    const classes = this.props.classes!;
    return (
      <div>
        <div className={classes.help}>
          {this.props.help}
        </div>
        <form onSubmit={this.onFormSubmit}>
          <input
            tabIndex={-1}
            className={classNames(
              classes.input,
              this.props.largeInput ? classes.largeInput : '',
            )}
            type="text"
            autoFocus={true}
            placeholder={this.props.placeholder}
            value={this.state.subdomainValue}
            onChange={this.onInputChange}
            ref={this.textInput}
          />
          <span>
            {this.props.domainSuffix}
          </span>
          {this.props.withNavigationLink &&
            <Tooltip
              tooltip={this.props.navigateHint}
              offset="0, 4"
              placement="right"
              alternate={true}
            >
              <div
                className={classNames(classes.subContainer, classes.withPointer)}
                onClick={this.props.onClickNavigate}
              >
                {`👉${this.props.navigateWording}`}
              </div>
            </Tooltip>
          }

          <div className={classes.subContainer}>
            <Button
              btnSize={Size.XSMALL}
              btnStyle={Style.PRIMARY}
              type="submit"
            >
              Let's go!
            </Button>
          </div>
        </form>
      </div>
    );
  }
}
