import { GradientType, InjectedProps as withGradientProps, withGradient } from '@getstation/theme';
import * as React from 'react';
import { compose } from 'react-apollo';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { StationState } from '../../types';
import { isLoadingScreenVisible } from '../selectors';

const announcementHTML = require('!!raw-loader!../../app/resources/announcement.html').default;

interface StateProps {
  visible: boolean
}

interface JSSProps {
  classes: {
    container: string
    container2: string,
    cartouche: string,
    illustration: string,
    salutations: string,
    announcement: string,
  },
}

@injectSheet({
  container: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 50,
    right: 0,
    zIndex: 100,
    backgroundImage: (props: withGradientProps) => props.themeGradient,
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
    fontSize: '16px',
    textAlign: 'center',
  },
  salutations: {
    fontSize: '16px',
  },
  announcement: {
    marginTop: '30px',
    color: 'rgba(255,255,255, 0.8)',
    fontSize: '14px',
    maxWidth: '420px',
  },
  cartouche: {
    marginBottom: '34px',
  },
  '@global': {
    '.fade-exit': {
      opacity: 1,
    },
    '.fade-exit.fade-exit-active': {
      opacity: 0.01,
      transition: 'opacity 100ms ease-in',
    },
  },
})
class LoadingScreenImpl extends React.PureComponent<StateProps & JSSProps, {}> {

  render() {
    const { visible } = this.props;
    return (
      <CSSTransition
        in={visible}
        classNames="fade"
        unmountOnExit={true}
        timeout={{ exit: 100 }}
        enter={false}
      >
        {this.renderContent()}
      </CSSTransition>
    );
  }

  renderContent() {
    const { classes } = this.props;

    return (
      <div className={classes.container}>
        <div className={classes.container2}>
          <div className={classes.salutations}>
            <p>
              Your Station will be ready soon...
            </p>
          </div>
          <div className={classes.announcement} dangerouslySetInnerHTML={{ __html: announcementHTML }} />
        </div>
      </div>
    );
  }
}

export default compose(
  connect<StateProps, {}, {}>(
    (state: StationState) => ({
      visible: isLoadingScreenVisible(state) as boolean,
    })),
  withGradient(GradientType.normal)
)(LoadingScreenImpl);
