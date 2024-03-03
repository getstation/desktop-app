import { GradientProvider } from '@getstation/theme';
import * as Immutable from 'immutable';
import { connect } from 'react-redux';
import { getThemeColors } from './selectors';

export interface StateToProps {
  themeColors: string[];
}

export interface OwnProps {
  children: React.Component;
}

export default connect<StateToProps, {}, OwnProps>((state: Immutable.Map<string, any>) => ({
  themeColors: getThemeColors(state),
}))(GradientProvider);
