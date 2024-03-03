import { Icon, IconSymbol } from '@getstation/theme';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';

export interface Classes {
  container: string,
  navigationWrapper: string,
  navigation: string,
  navigationIcon: string,
  settings: string,
}

export interface Props {
  classes?: Classes,
  onClickSettings?: () => void,
  ctrlTabCycling?: boolean,
  searchShortcut?: string,
  smallSize?: boolean,
}

const styles = {
  container: {
    height: ({ smallSize }: Props) => smallSize ? 28 : 35,
    backgroundColor: 'rgba(0, 0, 0, .2)',
    padding: [2, 5, 5, 10],
    color: 'rgba(255, 255, 255, .8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTop: '1px solid rgba(255,255,255,0.3)',
  },
  navigationWrapper: {
    display: 'flex',
  },
  navigation: {
    fontSize: ({ smallSize }: Props) => smallSize ? 8 : 10,
    marginRight: 10,
    color: 'rgba(255, 255, 255, .7)',
  },
  navigationIcon: {
    marginRight: 4,
    padding: [2, 4],
    color: 'white',
    background: 'rgba(255, 255, 255, .2)',
    borderRadius: 2,
  },
  settings: {
    marginTop: 2,
    height: 25,
    opacity: .6,
    cursor: 'default',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, .2)',
    },
  },
};

@injectSheet(styles)
export default class BangBottom extends React.PureComponent<Props, {}> {
  render() {
    const { classes, ctrlTabCycling, onClickSettings } = this.props;

    return (
      <div className={classes!.container}>
        <div className={classes!.navigationWrapper}>
          <div className={classes!.navigation}>
            <span className={classes!.navigationIcon}>TAB</span>
            { !ctrlTabCycling &&
              <>
                <span className={classes!.navigationIcon}>↑</span>
                <span className={classes!.navigationIcon}>↓</span>
              </>
            }
            Navigate
          </div>

          <div className={classes!.navigation}>
            <span className={classes!.navigationIcon}>ESC</span>
            Close
          </div>
        </div>

        { onClickSettings &&
          <a className={classes!.settings} onClick={onClickSettings}>
            <Icon
              symbolId={IconSymbol.COG}
              size={25}
              color="#fff"
            />
          </a>
        }
      </div>
    );
  }
}
