import * as React from 'react';
import { connect } from 'react-redux';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import * as Immutable from 'immutable';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { compose, bindActionCreators } from 'redux';
import { getThemeColors } from '../theme/selectors';
import { ImmutableList, ObjectToImmutable } from '../types';
import DownloadToast from './components/DownloadToast';
import { openDownloadedFile, removeToastForDownload } from './duck';
import { getFormatedDownloadsToShow } from './selectors';
import { Style, ButtonIcon, IconSymbol } from '@getstation/theme';

type DownloadItem = ObjectToImmutable<{
  downloadId: string,
  filename: string,
  completionPercent: number,
  applicationId: string,
  state: string,
}>;

export type Props = {
  classes?: Classes,
  downloads: ImmutableList<DownloadItem[]>,
  onOpenDownloadedFile: (downloadId: string) => void,
  onHideToasterClick: (downloadId: string) => void,
  themeColor: string,
};

interface Classes {
  container: string,
  clearAllButton: string,
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    position: 'fixed',
    bottom: '10px',
    right: '10px',
    zIndex: 9,
  },
  clearAllButton:{
    cursor: 'pointer',
  },
};

@injectSheet(styles)
class DownloadToasterImpl extends React.PureComponent<Props, {}> {

  /**
   * Clear One or many Downloaded elements
   * @param downloads
   */
  handleClear(downloads: DownloadItem[]) {
    downloads.forEach(dl => {
      this.props.onHideToasterClick(dl.get('downloadId'));
    });
  }

  clearAllButton(downloads: Props['downloads']) {
    // ClearAll button only if there are min 2 dls
    if (downloads.size < 2) return null;
    return (
      <ButtonIcon
        text="Clear All"
        symbolId={IconSymbol.CROSS}
        btnStyle={Style.PRIMARY}
        btnSize={3}
        iconPosition="Right"
        onClick={this.handleClear.bind(this, downloads.toArray())}
      />
    );
  }

  render() {
    const { downloads, themeColor, classes } = this.props;
    return (
      <div className={classes!.container}>
        {this.clearAllButton(downloads)}
        <TransitionGroup>
          { downloads.map((dl: DownloadItem) => (
            <CSSTransition
              key={dl.get('downloadId')}
              classNames="rapidfade"
              timeout={{ enter: 500, exit: 300 }}
            >
              <DownloadToast
                applicationId={dl.get('applicationId')}
                failed={dl.get('state') === 'interrupted' || dl.get('state') === 'cancelled'}
                filename={dl.get('filename')}
                completionPercent={dl.get('completionPercent')}
                onClickOpen={() => this.props.onOpenDownloadedFile(dl.get('downloadId'))}
                onClickHide={() => this.handleClear([dl])}
                themeColor={themeColor}
              />
            </CSSTransition>
          )).toArray()}
        </TransitionGroup>
      </div>
    );
  }
}

const connector = compose(
  connect(
    (state: Immutable.Map<string, any>) => ({
      downloads: getFormatedDownloadsToShow(state),
      themeColor: getThemeColors(state)[3],
    }),
    dispatch => bindActionCreators({
      onOpenDownloadedFile: openDownloadedFile,
      onHideToasterClick: removeToastForDownload,
    }, dispatch)
  ),
);

export default connector(DownloadToasterImpl);
