import { Icon, IconSymbol, ThemeTypes as Theme } from '@getstation/theme';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import { compose } from 'redux';
import { oc } from 'ts-optchain';
import { withGetApplication } from '../queries@local.gql.generated';
import AppIcon from '../../dock/components/AppIcon';
import { number } from '@storybook/addon-knobs';

export interface Classes {
  container: string,
  progress: string,
  wrapper: string,
  appIcon: string,
  content: string,
  filename: string,
  successWrapper: string,
  filenameSuccess: string,
  close: string,
}

export interface InjectedProps {
  loading: boolean,
  interpretedIconUrl: string,
  themeColor: string,
}

interface OnFinished {
  doTheJob: () => void,
  delay: number,
}

export interface Props {
  classes?: Classes,
  applicationId: string,
  filename: string,
  // waiting for https://github.com/electron/electron/pull/7851
  // fileIconURL:  str,
  completionPercent: number,
  onClickOpen: () => any,
  onClickHide: () => any,
  onFinished?: OnFinished,
  themeColor: string,
  failed?: boolean,
}

export type FullProps = Props & InjectedProps;

const noop = () => {};

const styles = (theme: Theme) => ({
  container: {
    position: 'relative',
    width: 265,
    height: 65,
    backgroundColor: (props: Props) => {
      if (props.failed) {
        return 'darkred';
      }
      return theme.mixinDarkenColor(props.themeColor, 0.3);
    },
    borderRadius: 4,
    marginTop: 5,
  },
  progress: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: (props: Props) => `${props.completionPercent}%`,
    backgroundColor: 'rgba(0, 0, 0, .3)',
    borderRadius: 4,
    transition: '200ms',
  },
  wrapper: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    color: 'white',
    fontSize: 12,
    zIndex: 1,
  },
  content: {
    ...theme.mixins.ellipsis(2),
    flexGrow: 1,
    padding: '0 10px',
  },
  filename: {
    width: 160,
    fontWeight: 600,
  },
  successWrapper: {
    ...theme.mixins.ellipsis(2),
    cursor: 'pointer',
  },
  filenameSuccess: {
    width: 160,
    color: 'rgba(255, 255, 255, .5)',
  },
  close: {
    ...theme.mixins.flexbox.containerCenter,
    flexShrink: 0,
    ...theme.mixins.size(25),
    backgroundColor: 'rgba(255, 255, 255, .5)',
    border: 0,
    borderRadius: 100,
    cursor: 'pointer',
    outline: 'none',
  },
});

@injectSheet(styles)
class DownloadToast extends React.PureComponent<FullProps> {

  handleClickOpen() {
    const { onClickOpen, onClickHide } = this.props;
    onClickOpen();
    onClickHide();
  }

  render() {
    const { classes, completionPercent, filename, onClickHide, interpretedIconUrl, failed, loading, themeColor, onFinished } = this.props;
    const completed = completionPercent === 100;
    const finished = completed || failed;

    if (loading) return null;
    if (completed && onFinished && typeof onFinished === 'function') {
      setTimeout(onFinished.doTheJob, onFinished.delay);
    }

    return (
      <div className={classes!.container}>
        <div className={classes!.wrapper}>
          { interpretedIconUrl &&
            <AppIcon
              imgUrl={interpretedIconUrl}
              themeColor={themeColor}
            />
          }
          <div className={classes!.content} onClick={finished ? this.handleClickOpen.bind(this) : noop}>
            {
              !finished ? (
                <div>
                  <div>Downloading</div>
                  <div className={classes!.filename}>{filename}</div>
                </div>
              ) : (
                <div className={classes!.successWrapper}>
                  <div>{failed ? 'Failed download' : 'Successful download'}!</div>
                  <div className={classes!.filenameSuccess}>{filename}</div>
                </div>
              )
            }
          </div>

          <button className={classes!.close} onClick={onClickHide}>
            <Icon symbolId={IconSymbol.CROSS} size={25} />
          </button>
        </div>

        <div className={classes!.progress} />
      </div>
    );
  }
}

const connector = compose(
  withGetApplication({
    options: (props: Props) => ({ variables: { applicationId: props.applicationId } }),
    props: ({ data }) => ({
      loading: !data || data.loading,
      interpretedIconUrl: oc(data).application.manifestData.interpretedIconURL(),
      themeColor: oc(data).application.manifestData.theme_color(),
    }),
  }),

);

export default connector(DownloadToast);
