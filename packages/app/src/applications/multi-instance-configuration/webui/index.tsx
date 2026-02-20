import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { getSearchParams } from '../../../webui/helpers';
import MultiInstanceConfigurator from './MultiInstanceConfigurator';

const params = getSearchParams();
const manifestURL = params.get('manifestURL')!;
const applicationId = params.get('applicationId')!;

ReactDOM.render(
  <MultiInstanceConfigurator
    applicationId={applicationId}
    manifestURL={manifestURL}
  />,
  document.getElementById('root')
);
