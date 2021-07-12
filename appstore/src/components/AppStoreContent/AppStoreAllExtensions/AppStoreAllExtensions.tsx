import * as React from 'react';
import injectSheet from 'react-jss';
import { flowRight as compose } from 'lodash';
import AppStorePageHeader from '@src/components/AppStoreContent/AppStorePageHeader/AppStorePageHeader';
import AppStoreApplication from '@src/components/AppStoreContent/AppStoreApplicationItem/AppStoreApplication';
import withAllExtensions, { WithAllExtensionsProps } from '@src/HOC/withAllExtensions';
import { ContextEnvPlatform } from '@src/app';
import { scrollToTop } from '@src/shared/functions/scroll-to-top';
import AppStorePreloader from '@src/components/AppStorePreloader/AppStorePreloader';

import styles, { AppStoreAllExtensionsClasses } from './styles';

export interface AppStoreAllExtensionsProps extends WithAllExtensionsProps {
  classes?: AppStoreAllExtensionsClasses,
  appStoreContext: number,
  onAddApplication: (applicationId: string, manifestURL: string) => any,
}

@injectSheet(styles)
class AppStoreAllExtensions extends React.PureComponent<AppStoreAllExtensionsProps, {}> {

  componentDidMount() {
    scrollToTop();
  }

  render() {
    const { classes, apps, appStoreContext, onAddApplication, loading } = this.props;
    const title = 'All extensions';
    const subTitle = 'Those applications comes with extensions you can use in Station.';
    const alternate = (appStoreContext !== ContextEnvPlatform.Browser);
    const renderPageContent = apps && !!apps.length && !loading;

    return (
      <React.Fragment>
        {!renderPageContent ?
          <AppStorePreloader isAnimationStopped={!!renderPageContent}/>
          :
          <section>
            <AppStorePageHeader
              title={title}
              subTitle={subTitle}
            />
            <ul className={classes!.resultsContent}>
              {!!apps && apps.map(app => {
                return <AppStoreApplication
                  key={app.id}
                  application={app}
                  isExtension={app.isChromeExtension}
                  appStoreContext={appStoreContext}
                  alternate={alternate}
                  onAddApplication={onAddApplication}
                />;
              })}
            </ul>
            </section>
        }
      </React.Fragment>
    );
  }
}

export default compose(withAllExtensions)(AppStoreAllExtensions);
