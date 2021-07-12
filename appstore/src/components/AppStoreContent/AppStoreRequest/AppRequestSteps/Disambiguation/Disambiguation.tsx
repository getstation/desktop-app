import { AppStoreContext } from '@src/context';
import { ApplicationsAvailable } from '@src/graphql/queries';
import * as React from 'react';
import injectSheet from 'react-jss';
import { ContextEnvPlatform } from '@src/app';
import AppRequestStepsButtons
  from '@src/components/AppStoreContent/AppStoreRequest/AppRequestStepsButtons/AppRequestStepsButtons';
import AppRequestStepsChooserItem
  from '@src/components/AppStoreContent/AppStoreRequest/AppRequestStepsChooserItem/AppRequestStepsChooserItem';

import styles, { IClasses } from './styles';

interface IStateProps {
  classes?: IClasses,
  appName: string,
  similarApplications: ApplicationsAvailable[],
  animAppearDirection: boolean,
  animExitDirection: boolean,
}

interface IDispatchProps {
  onCancel: () => void,
  onAddApplication: (applicationId: string, manifestURL: string) => void,
  onNext: () => void,
}

export type DisambiguationProps = IStateProps & IDispatchProps;

@injectSheet(styles)
export default class Disambiguation extends React.PureComponent<DisambiguationProps, {}> {
  renderWithContext(appStoreContext: ContextEnvPlatform | undefined) {
    const { classes, appName, onCancel, onNext, onAddApplication, similarApplications } = this.props;

    const applicationsList = similarApplications.map(app => {
      const applicationId = appStoreContext === ContextEnvPlatform.LegacyBxApiApp ?
        app.previousServiceId :
        app.id;

      return (
        <AppRequestStepsChooserItem
          key={app.id}
          title={app.name}
          subTitle={(app.category) ? app.category.name : 'Miscellaneous'}
          btnText={'Install'}
          value={app.id}
          onSelect={() => onAddApplication(applicationId, app.bxAppManifestURL)}
        />
      );
    });

    return (
      <div className={classes!.stepContainer}>
        <p>Did you mean?</p>
        <div className={classes!.list}>{applicationsList}</div>

        <hr className={classes!.separator}/>

        <div className={classes!.itemWrapper}>
          <AppRequestStepsChooserItem
            title={appName}
            btnText={'Add'}
            value={null}
            onSelect={onNext}
          />
        </div>

        <div className={classes!.controlsContainer}>
          <AppRequestStepsButtons
            isOnContinueBtn={false}
            onCancelBtnText={'Back'}
            onCancel={onCancel}
          />
        </div>
      </div>
    );
  }

  render() {
    return (
      <AppStoreContext.Consumer>{
        (context) => this.renderWithContext(context)
    }</AppStoreContext.Consumer>
    );

  }
}
