import { AppStoreContext } from '@src/context';
import * as React from 'react';
import injectSheet from 'react-jss';
import { ContextEnvPlatform } from '@src/app';

import AppStoreAsideNav from './AppStoreAsideNav/AppStoreAsideNav';
import AppStoreSearchSection from './AppStoreSearchSection/AppStoreSearchSection';
import styles, { IClasses } from './styles';

export interface AppStoreAsideProps {
  classes?: IClasses,
  appStoreContext: number,
}

const withAppsStoreContext = (Component: React.ComponentType) => (props: any) => (
  <AppStoreContext.Consumer>
    {(appStoreContext) => <Component {...props} appStoreContext={appStoreContext} />}
  </AppStoreContext.Consumer>
);

@withAppsStoreContext
@injectSheet(styles)
class AppStoreAside extends React.PureComponent<AppStoreAsideProps, {}> {
  render() {
    const { classes, appStoreContext } = this.props;

    return (
      <React.Fragment>
        <aside className={classes!.aside}>
          <div>
            <AppStoreSearchSection appStoreContext={appStoreContext} />
            <AppStoreAsideNav appStoreContext={appStoreContext} />
          </div>

          {appStoreContext === ContextEnvPlatform.Browser &&
            <div className={classes!.info}>
              <div className={classes!.text}>Powered by</div>
              <a href="https://getstation.com" target="_blank" aria-label="Station website">
                <svg className={classes!.logo} xmlns="http://www.w3.org/2000/svg" width="48" height="14" viewBox="0 0 48 14">
                  <title>Station logo</title>
                  <defs>
                    <linearGradient id="a" x1="50%" x2="50%" y1="100%" y2="0%">
                      <stop offset="0%" stopColor="#1410B8" />
                      <stop offset="100%" stopColor="#4ED8E4" />
                    </linearGradient>
                  </defs>
                  <g fill="none" fillRule="evenodd">
                    {/* tslint:disable-next-line:max-line-length */}
                    <path fill="#292929" d="M6.551 4.747c0-1.536-1.282-2.554-3.034-2.554-1.892 0-3.206.924-3.206 2.444 0 1.504 1.251 2.02 2.83 2.287 1.956.329 2.347.595 2.362 1.222.016.799-.907 1.222-2.127 1.222-1.548 0-2.017-.768-2.064-1.426H.092c.14 1.285.829 2.522 3.316 2.522 2.44 0 3.315-1.237 3.315-2.38 0-1.426-1.141-1.912-3.143-2.24-1.455-.236-2.05-.58-2.05-1.332 0-.752.767-1.222 1.878-1.222 1.376 0 1.86.736 1.923 1.457h1.22zM7.98 3.185h1.488v5.322c0 1.602.512 2.02 1.584 2.02a18 18 0 0 0 1.264-.049V9.356c-.24.032-.544.048-.832.048-.56 0-.768-.32-.768-1.041V3.185h1.616V2.159h-1.616V.078H9.468v2.081H7.98v1.026zm11.232 7.245V9.372h-.032c-.56.994-1.797 1.058-2.725 1.058-1.904 0-2.86-.897-2.86-2.163 0-1.475.8-2.34 2.993-2.452.88-.048 1.744-.096 2.624-.128v-.61c0-1.025-.432-1.858-2.032-1.858-1.472 0-1.952.625-2.112 1.522h-1.232c.256-1.795 1.472-2.548 3.36-2.548 2.144 0 3.264.978 3.264 2.692V8.86c0 .496.064 1.121.112 1.57h-1.36zm0-3.043v-.755l-2.112.096c-1.36.064-2.16.433-2.16 1.475 0 .8.71 1.134 1.846 1.134 1.088 0 1.97-.392 2.426-1.95zm2.492-4.206h1.488v5.326c0 1.602.488 1.923 1.56 1.923.384 0 .84.032 1.288 0V9.356c-.24.032-.544.048-.832.048-.56 0-.768-.32-.768-1.041V3.18h1.616V2.155H24.44V.078h-1.248v2.077h-1.488v1.026zm24.926 7.105v-4.84c0-1.666-.864-2.179-1.76-2.179-1.167 0-2.24.762-2.208 2.677v4.342h-1.28V2.274h1.248v.91h.032c.658-.91 1.14-1.068 2.208-1.068 1.622 0 3.008.527 3.008 2.786v5.384H46.63zM28.387 2.16h1.29v8.27h-1.29V2.16z" />
                    {/* tslint:disable-next-line:max-line-length */}
                    <path fill="url(#a)" d="M35.613 10.43a4.132 4.132 0 0 1-4.13-4.135 4.132 4.132 0 0 1 4.13-4.136 4.132 4.132 0 0 1 4.129 4.136 4.132 4.132 0 0 1-4.13 4.135zm0-1.24a2.893 2.893 0 0 0 2.89-2.895 2.893 2.893 0 0 0-2.89-2.895 2.893 2.893 0 0 0-2.89 2.895 2.893 2.893 0 0 0 2.89 2.894zm-3.097 2.79h6.194v1.035h-6.194V11.98z" />
                  </g>
                </svg>
              </a>
            </div>
          }
        </aside>
      </React.Fragment>
    );
  }
}

export default AppStoreAside;
