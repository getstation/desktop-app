import { IconSymbol, Size, ButtonIcon, Style } from '@getstation/theme';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';

type Classes = {
  container: string,
};

type DefaultProps = {
  classes: Partial<Classes>,
  instanceTypeWording: string,
  onClick: () => void,
};

type Props = DefaultProps & {
  name: string,
};

@injectSheet(() => ({
  container: {
    maxWidth: 300,
    margin: [20, 0],
  },
}))
class AddNewInstance extends React.PureComponent<Props> {

  static defaultProps: DefaultProps = {
    classes: {},
    instanceTypeWording: 'instance',
    onClick: () => { },
  };

  getWording() {
    const { instanceTypeWording, name } = this.props;

    const wording = instanceTypeWording === 'instance' ?
      `instance of ${name}` : instanceTypeWording;

    return `Add a new ${wording}`;
  }

  render() {
    const { classes, onClick } = this.props;

    return (
      <div className={classes.container}>
        <ButtonIcon
          text={this.getWording()}
          symbolId={IconSymbol.PLUS}
          btnStyle={Style.SECONDARY}
          btnSize={Size.XSMALL}
          onClick={onClick}
        />
      </div>
    );
  }
}

export default AddNewInstance;
