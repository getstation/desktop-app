import { roundedBackground } from '@getstation/theme';
import * as classNames from 'classnames';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';

interface Classes {
  tab: string,
}

type RenderFunction = () => React.ReactElement | React.ReactElement[];

export interface Props {
  children: RenderFunction,
  classes?: Classes,
  onClick?: () => void,
  title: string,
  isActive?: boolean,
}

const styles = () => ({
  tab: {
    lineHeight: '24px',
    marginBottom: 5,
    padding: [0, 10],
    boxSizing: 'border-box',
    cursor: 'pointer',
    userSelect: 'none',
    backgroundColor: 'none',
    transition: '300ms',
    '&.active, &:hover': {
      ...roundedBackground('rgba(255, 255, 255, .1)'),
    },
  },
});

@injectSheet(styles)
export default class Tab extends React.PureComponent<Props, {}> {
  render() {
    const { title, classes, isActive } = this.props;
    return (
      <li className={classNames(classes!.tab, { active: isActive })}>
        <a onClick={this.props.onClick}>
          {title}
        </a>
      </li>
    );
  }
}
