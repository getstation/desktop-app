import { Button, Style } from '@getstation/theme';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import { oc } from 'ts-optchain';
import { GetApplicationStateQuery } from '../../../applications/queries@local.gql.generated';

interface Classes {
  container: string,
  button: string,
}

interface Props {
  classes?: Classes,
  onOpenNewTab: () => void,
  onClickAddNewInstance: () => void,
  loading: boolean,
  application: GetApplicationStateQuery['application'],
}

@injectSheet(() => ({
  container: {
    margin: '0 0 20px 20px',
    paddingTop: 20,
    left: 10,
    textAlign: 'center',
  },
  button: {
    marginRight: 20,
    width: 'calc(100% - 20px)',
  },
}))
export default class AddApplicationButton extends React.PureComponent<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const { classes, loading, application, onOpenNewTab, onClickAddNewInstance } = this.props;
    if (loading || !application) return null;

    const notSingleInstance = !oc(application.manifestData).bx_single_page();
    if (notSingleInstance) {
      return (
        <div className={classes!.container}>
          <Button className={classes!.button} btnStyle={Style.SECONDARY} onClick={onOpenNewTab}>
            Add a new page
          </Button>
        </div>
      );
    }

    const instanceWording = oc(application.manifestData).bx_multi_instance_config.instance_wording();
    if (instanceWording) {
      return (
        <div className={classes!.container}>
          <Button className={classes!.button} btnStyle={Style.SECONDARY} onClick={onClickAddNewInstance}>
            Add a new {instanceWording}
          </Button>
        </div>
      );
    }

    return null;
  }
}
