import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import { Props as TabProps } from './Tab';

interface Classes {
  titlesContainer: string,
  titles: string,
  panel: string,
}

type TabElement = React.ReactElement<TabProps>;

export interface Props {
  children: TabElement | TabElement[],
  classes?: Classes,
  activeTabTitle: string,
  setActiveTab: (title: string) => void,
}

const styles = () => ({
  titlesContainer: {
    width: 130,
  },
  titles: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  panel: {
    flex: 1,
    height: '100%',
    marginLeft: 20,
    padding: [0, 20],
    borderLeft: '1px solid rgba(255, 255, 255, .20)',
    overflowY: 'auto',
  },
});

/*
** This component just render tabs with active tab content, it used by SettingOverlay.
*/
@injectSheet(styles)
export default class Tabs extends React.PureComponent<Props, {}> {

  renderChildren() {
    return React.Children.map(this.props.children, (child: TabElement) => {
      return (
        <div onClick={() => this.props.setActiveTab(child.props.title)}>
          { React.cloneElement(child, {
            isActive: child.props.title === this.props.activeTabTitle,
          })}
        </div>
      );
    });
  }

  renderActiveTabContent() {
    const { children, activeTabTitle } = this.props;
    if (!children) return null;

    const childrenArray = React.Children.toArray(children) as TabElement[];
    const activeTab = childrenArray.find((c: TabElement) => c.props.title === activeTabTitle);
    if (!activeTab) return null;
    return activeTab.props.children();
  }

  render() {
    const { classes } = this.props;
    return (
      [
        (
          <div key="tabs-title" className={classes!.titlesContainer}>
            <ul className={classes!.titles}>
              {this.renderChildren()}
            </ul>
          </div>
        ),
        (
          <div key="tabs-panel" className={classes!.panel}>
            {this.renderActiveTabContent()}
          </div>
        ),
      ]
    );
  }
}
