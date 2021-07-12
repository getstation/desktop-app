import * as React from 'react';
import injectSheet from 'react-jss';
import { WithSearchApplicationsByNameProps } from '@src/HOC/withSearchApplicationsByName';
import AppStoreApplication from '@src/components/AppStoreContent/AppStoreApplicationItem/AppStoreApplication';
import { Application } from '@src/graphql/queries';
import { ContextEnvPlatform } from '@src/app';
import AppRequestButton from '@src/components/AppStoreContent/AppStoreRequest/AppRequestButton/AppRequestButton';
import { Size } from '@getstation/theme';
import { scrollToTop } from '@src/shared/functions/scroll-to-top';
import AppStorePreloader from '@src/components/AppStorePreloader/AppStorePreloader';

import AppStoreSearchNotFound from './AppStoreSearchNotFound/AppStoreSearchNotFound';
import styles, { AppStoreSearchResultsClasses } from './styles';
import { MinimalApplication } from '../../../../../app/applications/graphql/withApplications';

export interface AppStoreSearchResultsProps extends WithSearchApplicationsByNameProps {
  classes?: AppStoreSearchResultsClasses,
  appStoreContext: number,
  onAddApplication: (applicationId: string, manifestURL: string) => any,
  apps: Application[],
  searchValue: string,
  askFromEmptySearchButton: boolean,
  onExit: (action?: string) => void,
  search: (query: string) => Promise<{ body: MinimalApplication[] }>
}

@injectSheet(styles)
class AppStoreSearchResults extends React.Component<AppStoreSearchResultsProps, { apps: MinimalApplication[] }> {

  constructor(props: AppStoreSearchResultsProps) {
    super(props);
    this.state = {
      apps: [] as MinimalApplication[],
    };
  }

  componentDidMount() {
    scrollToTop();
    this.props.search(this.props.searchValue).then(res => {
      this.setState({ apps: res.body });
    });
  }

  render() {

    const {
      classes,
      onAddApplication,
      searchValue,
      appStoreContext,
    } = this.props;

    const { apps } = this.state;

    const loading = false;

    const alternate = (appStoreContext !== ContextEnvPlatform.Browser);
    const resultsAmount = apps.length && apps.length > 1 ? `${apps.length} results` : `${apps.length} result`;
    const renderSearchResults = !!apps.length && !loading || !apps.length && loading;

    return (
      <React.Fragment>
        {loading ?
          <AppStorePreloader isAnimationStopped={!loading}/>
          :
          <React.Fragment>
            {renderSearchResults ?
              <section className={classes!.resultsSection}>
                {!!apps.length && <div className={classes!.resultsHeader}>
                    <div className={classes!.resultsTitle}>Results for &laquo; {searchValue} &raquo;</div>
                  {<div className={classes!.resultsAmount}>{resultsAmount}</div>}
                </div>}

                <ul className={classes!.resultsContent}>
                  {!!apps && apps.map(app => {
                    return <AppStoreApplication
                      key={app.id}
                      application={app}
                      appStoreContext={appStoreContext}
                      isExtension={app.isChromeExtension}
                      alternate={alternate}
                      onAddApplication={onAddApplication}
                      marginBottom={38}
                    />;
                  })}
                </ul>

                {appStoreContext !== ContextEnvPlatform.Browser && !!apps.length &&
                <AppRequestButton
                    btnSize={Size.BIG}
                >
                    <div className={classes!.resultsButtonContainer}>
                        <div className={classes!.resultsButton}>Can't find your app? Add it there</div>
                    </div>
                </AppRequestButton>}

              </section>
              :
              <AppStoreSearchNotFound
                appStoreContext={appStoreContext}
                searchValue={searchValue}
              />
            }
          </React.Fragment>}
      </React.Fragment>
    );
  }
}

export default AppStoreSearchResults;
