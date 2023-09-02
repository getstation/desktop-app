import { ThemeTypes as Theme } from '@getstation/theme';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';

export interface Classes {
  footer: string,
  link: string,
}

export interface Props {
  classes?: Classes,
}

const styles = (theme: Theme) => ({
  footer: {
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    color: theme.colors.gray.middle,
    fontSize: 11,
  },
  link: {
    marginLeft: 10,
    fontWeight: 600,
    textDecoration: 'underline',
    cursor: 'pointer',
  },
});

@injectSheet(styles)
export default class AboutWindowFooter extends React.PureComponent<Props, {}> {
  render() {
    const { classes } = this.props;

    return (
      <footer className={classes!.footer}>
        <p>2019 - { new Date().getFullYear() }</p>
        <a
          className={classes!.link}
          href="https://medium.com/getstation/your-way-of-working-belongs-to-the-stone-age-9ff64782f40"
          target="_blank"
        >
          About Station
        </a>
        <a className={classes!.link} href="https://getstation.com/" target="_blank">
          Support
        </a>
      </footer>
    );
  }
}
