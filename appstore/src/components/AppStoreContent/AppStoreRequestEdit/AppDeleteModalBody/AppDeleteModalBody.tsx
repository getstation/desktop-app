import * as React from 'react';
import injectSheet from 'react-jss';
import { flowRight as compose } from 'lodash';
import withSelectedCustomApp, { WithSelectedCustomAppProps } from '@src/HOC/withSelectedCustomApp';
import AppRequestStepsButtons
  from '@src/components/AppStoreContent/AppStoreRequest/AppRequestStepsButtons/AppRequestStepsButtons';
import { Application } from '@src/graphql/queries';
import styles, { AppStoreModalClasses } from '@src/components/AppStoreContent/AppStoreRequestEdit/AppDeleteModalBody/styles';

interface IOwnProps {
  classes?: AppStoreModalClasses,
  deleteApplication: (app: Application) => void,
  closeModal: () => void,
}

type Props = IOwnProps & WithSelectedCustomAppProps;

@injectSheet(styles)
class AppDeleteModalBody extends React.PureComponent<Props> {

  deleteApplication = () => {
    this.props.deleteApplication(this.props.app);
  }

  render() {
    const { classes, app, closeModal } = this.props;

    return (
      <React.Fragment>
        <div className={classes!.modal}>
          <div className={classes!.appWrapper}>
            <div className={classes!.appIconWrapper}>
              <img src={app.iconURL} className={classes!.appIcon}/>
            </div>
            <div className={classes!.appNameText}>{app.name}</div>
          </div>
          <div className={classes!.modalText}>
            <div>It will also be deleted from your Station.</div>
          </div>
        </div>
        <AppRequestStepsButtons
          onCancelBtnText={'Cancel'}
          onCancel={closeModal}
          onContinue={this.deleteApplication}
          bgColor={'#e75858'}
          onContinueBtnText={'Yes, remove app'}
        />
      </React.Fragment>
    );
  }
}

export default compose(withSelectedCustomApp)(AppDeleteModalBody);
