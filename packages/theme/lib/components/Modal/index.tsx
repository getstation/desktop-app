import classNames from 'classnames';
import * as React from 'react';
import injectSheet, { WithSheet } from 'react-jss';
import { createStyles, ThemeTypes } from '../../types';
import { Button, Style } from '../Button';
import { Icon, IconSymbol } from '../Icon';
import { ModalWrapper } from '../ModalWrapper';

interface OwnProps {
  classNameModalBody?: string,
  classNameModalContent?: string,
  title?: string,
  description?: string,
  onCancel?: () => void,
  cancelContent?: string,
  onContinue?: () => void,
  onClickOutside?: () => void,
  continueContent?: string,
  continueDanger?: boolean,
  applicationIcon?: string,
  themeColor?: string,
  isLoading?: boolean,
  /**
   * Will display a loading on the confirm button.
   */
  confirmButtonIsLoading?: boolean,
  disableWrapperClick?: boolean,
}

const BORDER_RADIUS = 5;

const styles = (theme: ThemeTypes) => createStyles({
  container: {
    position: 'relative',
    width: 400,
    backgroundColor: theme.$bodyBkg,
    borderRadius: BORDER_RADIUS,
  },
  header: {
    width: '100%',
    padding: (({ applicationIcon, title, description }: OwnProps) => {
      if (applicationIcon) {
        return '70px 20px 20px';
      }
      if (title || description) {
        return '20px';
      }
      return '0px';
    }) as any,
    textAlign: 'center',
    backgroundColor: theme.colors.gray.light,
    boxSizing: 'border-box',
    borderRadius: [5, 5, 0, 0] as any,
  },
  applicationIcon: {
    display: (({ applicationIcon }: OwnProps) => applicationIcon ? 'initial' : 'none') as any,
    position: 'absolute',
    top: -45,
    left: 'calc(50% - 45px)',
    width: 90,
    height: 90,
    backgroundImage: (({ applicationIcon }: OwnProps) => `url('${applicationIcon}')`) as any,
    backgroundColor: (({ themeColor }: OwnProps) => themeColor || '#000000') as any,
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100%',
    backgroundPosition: 'center',
    borderRadius: '100%',
    border: '3px solid white',
  },
  title: {
    ...theme.fontMixin(18, 500),
    color: theme.colors.black,
    marginBottom: 5,
  },
  description: {
    ...theme.fontMixin(13),
    color: '#292929',
    opacity: .4,
  },
  body: {
    color: theme.colors.black,
    position: 'relative',
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 5,
    paddingRight: 5,
  },
  '@keyframes spin': {
    '100%': { transform: 'rotate(360deg)' },
  },
  content: {
    height: '100%',
    width: '100%',
    maxHeight: 400,
    overflow : 'scroll',
    paddingLeft: 15,
    paddingRight: 15,
    boxSizing: 'border-box',
  },
  loading: {
    ...theme.mixins.flexbox.containerCenter,
    ...theme.mixins.position('absolute', 0, 0),
    ...theme.mixins.size('100%'),
    backgroundColor: 'rgba(255, 255, 255, 1)',
    '& svg': {
      animation: `spin 1s linear infinite`,
    },
    zIndex: 1,
    borderRadius: BORDER_RADIUS,
  },
  footer: {
    whiteSpace: 'nowrap',
    display: 'flex',
    justifyContent: 'space-between',
    padding: 20,
    '& button': {
      flexBasis: ({ onContinue }: OwnProps) => onContinue ? '48%' : '100%',
      marginLeft: 5,
    } as any,
  },
});

type Props = OwnProps & WithSheet<typeof styles>;

class ModalImpl extends React.PureComponent<Props, {}> {

  onClickOutside = () => {
    // click is disabled, stop here
    if (this.props.disableWrapperClick) return;

    const { onClickOutside, onCancel } = this.props;
    if (onClickOutside) {
      onClickOutside();
      return;
    }
    onCancel && onCancel();
  }

  render() {
    const {
      classes, title, description, cancelContent, continueContent, children,
      onCancel, onContinue,
      isLoading, continueDanger, confirmButtonIsLoading,
      classNameModalContent, classNameModalBody,
    } = this.props;

    return (
      <ModalWrapper onClickOutside={this.onClickOutside}>
        <div className={classes.container}>
          <div className={classes.header}>
            <div className={classes.applicationIcon} />
            <div className={classes.title}>{title}</div>
            <div className={classes.description}>{description}</div>
          </div>

          <div className={classNames(classes.body, classNameModalBody)}>
            { isLoading &&
            <div className={classes.loading}>
              <Icon symbolId={IconSymbol.LOADING} size={25} color={'#000'} />
            </div>
            }

            <div className={classNames(classes.content, classNameModalContent)}>
              {children}
            </div>
          </div>

          { (onCancel || onContinue) &&
          <div className={classes.footer}>
            { onCancel &&
            <Button onClick={onCancel} btnStyle={Style.TERTIARY}>
              {cancelContent || `Cancel`}
            </Button>
            }

            { onContinue &&
            <Button
              onClick={onContinue}
              btnStyle={continueDanger ? Style.DANGER : Style.PRIMARY}
              isLoading={confirmButtonIsLoading}
            >
              {continueContent || `OK`}
            </Button>
            }
          </div>
          }
        </div>
      </ModalWrapper>
    );
  }
}

export const Modal = injectSheet(styles)(ModalImpl);
