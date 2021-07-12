import { GradientType, withGradient } from '@getstation/theme';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';

export interface Classes {
  container: string,
  container2: string,
  icon: string,
  iconContainer: string,
}

export interface Props {
  classes?: Classes,
  themeGradient?: string,
  applicationIcon: string,
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: (props: Props) => props.themeGradient,
    padding: '10px',
  },
  container2: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255, 0.1)',
    borderRadius: '3px',
    height: '100%',
    color: 'white',
    fontSize: '14px',
  },
  iconContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 80,
    marginBottom: 30,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, .3)',
    position: 'relative',
  },
  icon: {
    width: 60,
    height: 60,
  },
};

@injectSheet(styles)
export class ApplicationContainerImpl extends React.PureComponent<Props, {}> {
  render() {
    const { classes, children } = this.props;
    return (
      <div className={classes!.container}>
        <div className={classes!.container2}>
          <div className={classes!.iconContainer}>
            <img src={this.props.applicationIcon} width={60} height={60} alt="Icon" />
          </div>

          {children}
        </div>
      </div>
    );
  }
}

export default withGradient(GradientType.normal)(ApplicationContainerImpl);
