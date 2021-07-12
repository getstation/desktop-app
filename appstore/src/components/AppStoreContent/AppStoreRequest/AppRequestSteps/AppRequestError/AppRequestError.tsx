import * as React from 'react';
import { createUseStyles } from 'react-jss';

const astroAwkwardPath: string = require('./astr-awkward.png');

const useStyles = createUseStyles({
  stepContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 38,
  },
  title: {
    textAlign: 'center',
    marginTop: 0,
  },
  text: {
    fontSize: 17,
    color: '#4a4a4a',
    textAlign: 'center',
  },
  errorImage: {
    fontSize: 50,
    margin: 0,
    height: 100,
    marginBottom: 10,
  },
});

const AppRequestError = () => {
  const classes = useStyles();

  return (
    <div className={classes.stepContent}>
      <img className={classes.errorImage} src={astroAwkwardPath} />
      <h4 className={classes.title}>Something went wrong, <br /> we're sorry.</h4>
      <div className={classes.text}>
        Please retry in couples of minutes or post topic in our <a target="_blank" href="https://feedback.getstation.com/">Community</a> forum: we'll be there for you.
      </div>
    </div>
  );
};

export default AppRequestError;
