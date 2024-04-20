import { BrowserXThemeProvider } from '@getstation/theme';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Subject } from 'rxjs';

// tslint:disable-next-line:no-import-side-effect
import '../../../theme/css/app.global.css';
import { getSearchParams } from '../../../webui/helpers';
import { WebUIGradientProvider } from '../../../webui/WebUIGradientProvider';
import MultiInstanceConfigurator from './MultiInstanceConfigurator';

const params = getSearchParams();
const manifestURL = params.get('manifestURL')!;
const applicationId = params.get('applicationId')!;

const themeColorsObservable = new Subject<any>();
window.bx.theme.addThemeColorsChangeListener(
  (_: any, result: any) => themeColorsObservable.next(result)
);

// const themeColorsObservable = window.bx.theme.themeColors;

ReactDOM.render(
  <BrowserXThemeProvider>
    <WebUIGradientProvider themeColorsObservable={themeColorsObservable}>
      <MultiInstanceConfigurator
        applicationId={applicationId}
        manifestURL={manifestURL}
      />
    </WebUIGradientProvider>
  </BrowserXThemeProvider>,
  document.getElementById('root')
);
