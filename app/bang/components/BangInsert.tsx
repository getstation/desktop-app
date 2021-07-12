import { Button, Size, Style } from '@getstation/theme';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import SVGInline from 'react-svg-inline';

interface Classes {
  container: string,
  item: string,
  itemDescription: string,
  itemCTA: string,
  kbShortcut: string,
  gdriveIcon: string,
  gdriveDesc: string,
}

export interface Props {
  classes?: Classes,
  gDriveIconSrc: string,
  isGDriveConnected: boolean,
  onGDriveConnect: () => any,
}

@injectSheet(() => ({
  container: {
    left: '5%',
    top: 'calc(50% - 26px)',
    display: 'flex',
    width: '90%',
    flexDirection: 'column',
    margin: 'auto',
    color: 'white',
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    margin: [15, 0],
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, .1)',
    fontSize: 11,
    borderRadius: 100,
    border: '1px solid rgba(255, 255, 255, .1)',
  },
  itemDescription: {
    flexGrow: 1,
    textAlign: 'center',
    lineHeight: 1.5,
  },
  itemCTA: {
    flexShrink: 0,
  },
  kbShortcut: {
    backgroundColor: 'rgba(0,0,0,0.75)',
    padding: [3, 8],
    borderRadius: 10,
  },
  gdriveIcon: {
    width: 30,
  },
  gdriveDesc: {
    margin: [0, 10],
  },
}))
export default class BangInsert extends React.PureComponent<Props> {

  constructor(props: Props) {
    super(props);
  }

  renderGDriveTooltip() {
    const { classes, gDriveIconSrc, onGDriveConnect } = this.props;

    return (
      <div className={classes!.item}>
        <SVGInline className={classes!.gdriveIcon} svg={gDriveIconSrc} fill="#FFF" />

        <p className={classes!.gdriveDesc}>Access Google Docs and Sheets with the Quick Switch</p>

        <Button
          className={classes!.itemCTA}
          onClick={onGDriveConnect}
          btnSize={Size.SMALL}
          btnStyle={Style.SECONDARY}
        >
          Connect Google Drive
        </Button>
      </div>
    );
  }

  render() {
    const { classes, isGDriveConnected } = this.props;

    return (
      <div className={classes!.container}>
        {!isGDriveConnected &&
          this.renderGDriveTooltip()
        }
      </div>
    );
  }
}
