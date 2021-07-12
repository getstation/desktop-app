import * as React from 'react';
import injectSheet from 'react-jss';
import { flowRight as compose } from 'lodash';
import withSelectedCustomApp, { WithSelectedCustomAppProps } from '@src/HOC/withSelectedCustomApp';
import AppRequestStepsButtons
  from '@src/components/AppStoreContent/AppStoreRequest/AppRequestStepsButtons/AppRequestStepsButtons';
import { Modal } from '@getstation/theme';
import { customAppsCategories } from '@src/shared/constants/constants';
import styles, { AppRequestModalClasses } from '@src/components/AppStoreContent/AppRequestModal/styles';
import AppRequestError
  from '@src/components/AppStoreContent/AppStoreRequest/AppRequestSteps/AppRequestError/AppRequestError';

interface IOwnProps {
  classes?: AppRequestModalClasses,
  closeModal: () => void,
  isRequestError: boolean,
}

type Props = IOwnProps & WithSelectedCustomAppProps;

@injectSheet(styles)
class AppDeleteModal extends React.PureComponent<Props> {

  render() {
    const { classes, isRequestError, closeModal } = this.props;
    const appCategory = 'Private';
    const title = isRequestError ? '' : `Remove this ${appCategory} App?`;

    return (
      <Modal
        title={title}
        classNameModalContent={classes!.modalContent}
      >
        {
          isRequestError ?
            <React.Fragment>
              <AppRequestError />
              <AppRequestStepsButtons
                isOnContinueBtn={false}
                onCancelBtnText={'Close modal'}
                onCancel={closeModal}
              />
            </React.Fragment>
            :
            this.props.children
        }
      </Modal>
    );
  }
}

export default compose(withSelectedCustomApp)(AppDeleteModal);
