import * as React from 'react';
import injectSheet from 'react-jss';

import styles, { AppRequestStepsChooserItemClasses } from './styles';

export interface AppRequestStepsChooserItemProps {
  classes?: AppRequestStepsChooserItemClasses,
  title: string,
  subTitle?: string,
  btnText: string,
  btnBgColor?: string,
  value: any,
  onSelect: (item: any) => void,
}

@injectSheet(styles)
export default class AppRequestStepsChooserItem extends React.PureComponent<AppRequestStepsChooserItemProps, {}> {

  render() {
    const { classes, title, subTitle, btnText, value, onSelect } = this.props;

    return (
      <div className={classes!.itemContainer}>
        <div className={classes!.itemContent}>
          <div className={classes!.itemTitle}>{title}</div>
          <div className={classes!.itemSubtitle}>{subTitle}</div>
        </div>
        <button className={classes!.itemButton} onClick={() => onSelect(value)}>{btnText}</button>
      </div>
    );
  }
}
