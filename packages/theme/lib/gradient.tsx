// @ts-ignore the type definition is broken, problem of import default :(
import createReactContext from 'create-react-context';
import * as React from 'react';
import { getGradientCSSBackground as getGradient, getGradientWithOverlay } from './jss';

const defaultGradientColors = ['#85A9C4', '#C5C7C6', '#DFD2C0', '#F1B87C'];
// @ts-ignore typing is correct as soon as 'create-react-context' is correct
const GradientColorsContext = createReactContext<string[]>(defaultGradientColors);

export interface GradientProviderProps {
  themeColors: string[];
  children: React.Component
}

/**
 * GradientProvider
 */
export class GradientProvider extends React.Component<GradientProviderProps> {
  render() {
    return (
      <GradientColorsContext.Provider value={this.props.themeColors}>
        {this.props.children}
      </GradientColorsContext.Provider>
    );
  }
}

type Omit<T, K extends keyof T> = T extends any ? Pick<T, Exclude<keyof T, K>> : never;

export interface InjectedProps {
  themeGradient: string,
}

export enum GradientType {
  normal,
  withOverlay,
  withDarkOverlay,
}

/**
 * computeGradient
 *
 * @param {GradientType} type - type of gradient.
 * @param {string[]} themeGradientColors - array of gradient colors.
 * @return {string} the corresponding linear-gradient CSS value
 */
function computeGradient(type: GradientType, themeGradientColors: string[]) {
  switch (type) {
    case GradientType.normal:
      return getGradient(themeGradientColors);
    case GradientType.withOverlay:
      return getGradientWithOverlay(themeGradientColors, .3);
    case GradientType.withDarkOverlay:
      return getGradientWithOverlay(themeGradientColors, .5);
  }
}

// typing is inspired from https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react-redux/index.d.ts
/**
 * Add the ThemeGradient ot the wrapped component.
 * @param gradientType - the type of gradient to return
 */
export const withGradient = (gradientType?: GradientType) =>
  <P extends InjectedProps>(WrappedComponent: React.ComponentType<P>):
    React.ComponentClass<Omit<P, keyof InjectedProps>> => {

    type HOCProps = Omit<P, keyof InjectedProps>;

    class WithGradient extends React.Component<HOCProps, {}> {
      static displayName = `WithGradient(${WrappedComponent.displayName || WrappedComponent.name})`;

      render() {
        return (
          <GradientColorsContext.Consumer>
            {(themeGradientColors: string[]) => this.renderChildren(themeGradientColors)}
          </GradientColorsContext.Consumer>
        );
      }

      renderChildren(themeGradientColors: string[]) {

        const themeGradient = computeGradient(gradientType || GradientType.normal, themeGradientColors);
        return <WrappedComponent {...(this.props as any)} themeGradient={themeGradient} />;
      }
    }

    return WithGradient;
  };
