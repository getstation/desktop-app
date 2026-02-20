import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import { identitiesStyle } from './styles';
import { JSSClasses } from '../../../../types';

const styles = {
  container: {
    ...identitiesStyle.accountContainer,
  },
  element: {
    ...identitiesStyle.account,
  },
  elementDetail: {
    ...identitiesStyle.accountDetail,
    justifyContent: 'center',
  },
};

type InjectSheetProps = {
  classes: JSSClasses<typeof styles>,
};

export type OwnProps = {
  appHostname: string,
  onClickUseSelfInstance: () => void,
  onClickGoToApp: () => void,
  selfInstanceHint?: string,
};

type Props = OwnProps & InjectSheetProps;

@injectSheet(styles)
class NormalFlowForm extends React.PureComponent<Props> {

  render() {
    const { classes, appHostname, onClickUseSelfInstance, onClickGoToApp } = this.props;

    return (
      <ul className={classes.container}>
        <li
          className={classes!.element}
          onClick={onClickGoToApp}
        >
          <div className={classes!.elementDetail}>
           {`Go to ${appHostname}`}
          </div>
        </li>
        <li
          className={classes!.element}
          onClick={onClickUseSelfInstance}
          title={this.props.selfInstanceHint}
        >
          <div className={classes!.elementDetail}>
            I use a self-hosted instance
          </div>
        </li>
      </ul>
    );
  }
}

export default NormalFlowForm as React.ComponentType<OwnProps>;
