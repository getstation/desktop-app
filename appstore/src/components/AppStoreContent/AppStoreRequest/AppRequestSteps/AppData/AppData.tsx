import { Hint, STYLE } from '@getstation/theme';
import { Visibility } from '@src/app-request/duck';
import * as React from 'react';
import injectSheet from 'react-jss';
import * as classNames from 'classnames';
import * as uuid from 'uuid';
import AppRequestStepsButtons
  from '@src/components/AppStoreContent/AppStoreRequest/AppRequestStepsButtons/AppRequestStepsButtons';
import AppRequestStepsInput
  from '@src/components/AppStoreContent/AppStoreRequest/AppRequestStepsInput/AppRequestStepsInput';
import { svgIconsURLs } from '@src/shared/constants/constants';

import styles, { IClasses } from './styles';

export interface IProps {
  classes?: IClasses,
  appName: string,
  logoURL: string,
  themeColor: string,
  signinURL: string,
  errorInputColor?: string,
  errorLogoURL?: string,
  errorSigninURL?: string,
  visibility?: Visibility,
  onCancel?: () => void,
  onSubmit?: () => void,
  animExitDirection?: boolean,
  isControlsVisible?: boolean,
  handleChangeThemeColor: (themeColor: string) => void,
  handleChangeLogoURL: (logoURL: string) => void,
  handleChangeSigninUrl: (signinURL: string) => void,
}

interface IState {
  selectedIconUrl: string,
  isSelectionShown: boolean,
}

@injectSheet(styles)
export default class AppData extends React.PureComponent<IProps, IState> {
  static defaultState = {
    selectedIconUrl: '',
    isSelectionShown: false,
  };

  selectIconsRef: React.RefObject<HTMLDivElement>;

  constructor(props: IProps) {
    super(props);

    this.state = AppData.defaultState;
    this.selectIconsRef = React.createRef();

    this.onChangeSigninURL = this.onChangeSigninURL.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.updateIconColorValue = this.updateIconColorValue.bind(this);
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  }

  onChangeSigninURL(value: string) {
    this.props.handleChangeSigninUrl(value);
  }

  onSubmit() {
    const { onSubmit } = this.props;
    onSubmit && onSubmit();
  }

  onCancel() {
    const { onCancel } = this.props;
    onCancel && onCancel();
  }

  updateIconColorValue(event: React.ChangeEvent<HTMLInputElement>) {
    this.props.handleChangeThemeColor(event.target.value);
  }

  handleOpenSelect = () => {
    this.setState({
      ...this.state,
      isSelectionShown: !this.state.isSelectionShown,
    });
  }

  handleChooseIcon = (iconUrl: string) => {
    this.setState({
      ...this.state,
      selectedIconUrl: iconUrl,
      isSelectionShown: false,
    });

    this.props.handleChangeLogoURL(iconUrl);
  }

  handleClickOutside = (e: Event) => {
    if (this.selectIconsRef.current && !this.selectIconsRef.current.contains(e.target as Node)) {
      this.setState({
        ...this.state,
        isSelectionShown: false,
      });
    }
  }

  render() {
    const {
      classes,
      appName,
      onCancel,
      visibility,
      isControlsVisible = true,
      themeColor,
      signinURL,
      errorInputColor,
      errorLogoURL,
      errorSigninURL,
    } = this.props;
    const { selectedIconUrl, isSelectionShown } = this.state;

    const selectIconOptions = svgIconsURLs.map((iconUrl: string) => {
      return (
        <div
          key={uuid.v4()}
          className={classes!.selectItem}
          onClick={() => this.handleChooseIcon(iconUrl)}
        >
          <img src={iconUrl} alt={'icon'} className={classes!.selectItemIcon}/>
        </div>
      );
    });
    const defaultIconUrl = svgIconsURLs[0];
    const selectedIcon = selectedIconUrl || defaultIconUrl;

    return (
      <div className={classes!.stepContainer}>
        { visibility !== Visibility.Public &&
          <React.Fragment>
            <div className={classes!.label}>App icon color</div>
            <div className={classes!.itemContainer}>
              {errorInputColor && <div className={classes!.subLabelError}>{errorInputColor}</div>}
              <div className={classes!.inputColorWrapper}>
                <div className={classes!.themeColorRender} style={{ background: themeColor || '#292929' }} />
                <input
                  className={classes!.inputColorText}
                  type="text"
                  value={themeColor}
                  placeholder={'#292929'}
                  onChange={this.updateIconColorValue}
                />
                <div className={classes!.colorWheelWrapper}>
                  <input className={classes!.inputColor} type="color" value={themeColor} onChange={this.updateIconColorValue} />
                  <img src="/static/color-wheel.svg" alt="color wheel"/>
                </div>
              </div>
            </div>
          </React.Fragment>
        }

        {visibility !== Visibility.Public &&
          <React.Fragment>
            <div className={classes!.label}>{appName} Logo</div>

            <div className={classes!.itemContainer}>
              {errorLogoURL && <div className={classes!.subLabelError}>{errorLogoURL}</div>}
                <div className={classes!.select}>
                  <div className={classes!.subLabel}><strong>Select an icon</strong></div>
                  <div
                    className={classes!.selectContainer}
                    ref={this.selectIconsRef}
                    onClick={this.handleOpenSelect}
                  >
                    <img src={selectedIcon} alt="icon" className={classes!.selectIcon}/>
                  </div>
                  <div
                    className={classNames(
                      classes!.selectList,
                      { isVisible: isSelectionShown }
                    )}
                  >
                    {selectIconOptions}
                  </div>
                </div>

            </div>
          </React.Fragment>
        }

        <Hint style={STYLE.DARK} tooltip={'Enter the URL of the page used to login into the app'}>
          <div className={classes!.label}>{appName} login URL</div>
        </Hint>

        <div className={classes!.inputContainer}>
          <AppRequestStepsInput
            placeholder={'https://website.com/login'}
            value={signinURL}
            maxLength={100}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.onChangeSigninURL(e.target.value)}
            error={errorSigninURL}
          />
        </div>

        {isControlsVisible &&
          <AppRequestStepsButtons
            onCancelBtnText={'Back'}
            onContinueBtnText={visibility === Visibility.Public ? 'Request' : 'Add'}
            onCancel={onCancel}
            onContinue={this.onSubmit}
          />
        }

      </div>
    );
  }
}
