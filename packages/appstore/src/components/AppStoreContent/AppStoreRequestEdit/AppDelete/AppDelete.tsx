import * as React from 'react';
import injectSheet from 'react-jss';
import { graphql } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import { IconSymbol, Icon } from '@getstation/theme';
import { SET_APP_MODAL_STATUS } from '@src/graphql/schemes/appModalStatus';
import { MutateSetAppModalStatusProps } from '@src/graphql/types/mutateSetAppModalStatus';
import styles, { DeleteClasses } from '@src/components/AppStoreContent/AppStoreRequestEdit/AppDelete/styles';

interface IOwnProps {
  classes?: DeleteClasses,
}

type Props = IOwnProps & MutateSetAppModalStatusProps;

@injectSheet(styles)
class AppDelete extends React.Component<Props> {

  openModal = () => {
    this.props.mutateSetAppModalStatus({
      variables: {
        isAppModalOpen: true,
      },
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
      <div className={classes!.stepContainer}>
        <div className={classes!.subTitle}>Extreme measure</div>
        <div className={classes!.deleteButton} onClick={this.openModal}>
          <Icon
            symbolId={IconSymbol.TRASH}
            size={23}
            color={'#797979'}
          />
          <span className={classes!.deleteButtonText}>Delete this custom app</span>
        </div>
      </div>
      </React.Fragment>
    );
  }
}

export default compose(
  graphql(SET_APP_MODAL_STATUS, { name: 'mutateSetAppModalStatus' }),
)(AppDelete);
