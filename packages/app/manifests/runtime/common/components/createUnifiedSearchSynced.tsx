import * as React from 'react';
import injectSheet from 'react-jss';
import { getIconPath } from '../../helpers';

export type InjectSheetProps = {
  classes: {
    container: string,
    title: string,
    logo: string,
    description: string,
  },
};

export type OwnProps = {
  applicationName: string,
  icon: string,
  description?: string,
};

export type Props = InjectSheetProps & OwnProps;

const styles = {
  container: {
    marginBottom: 20,
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    display: 'inline-block',
    width: 20,
    height: 20,
    marginRight: 7,
    borderRadius: 10,
    '& img': {
      width: 20,
      borderRadius: 10,
    },
  },
  description: {
    display: 'flex',
    alignItems: 'center',
  },
};

const createUnifiedSearchSynced = (serviceId: string, desc?: string) => {
  const description = desc || 'This application is automatically synced with the Quick-Switch';

  const Component = class UnifiedSearchSynced extends React.PureComponent<Props> {

    render() {
      const { classes } = this.props;

      return (
        <div className={classes.container}>
          <div className={classes.title}>
            <div className={classes.logo}>
              <img src={getIconPath(serviceId)} />
            </div>
            {serviceId.toUpperCase()}
          </div>

          <p className={classes.description}>
            <span>{description}</span>
          </p>
        </div>
      );
    }
  };

  return injectSheet(styles)(Component);
};

export default createUnifiedSearchSynced;
