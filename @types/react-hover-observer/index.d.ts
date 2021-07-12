declare module 'react-hover-observer' {
  import * as React from 'react';

  interface ChildrenFunctionArg0 {
    /**
     * `true` if currently hovering, otherwise `false`.
     */
    isHovering: boolean,
  }

  type ChildrenFunction = (props: ChildrenFunctionArg0) => React.ReactNode;

  interface Props {
    /**
     * A CSS class to be applied to the div rendered by react-hover-observer.
     */
    className?: string,

    /**
     * Milliseconds to delay hover trigger. Defaults to zero.
     */
    hoverDelayInMs?: number,

    /**
     * Milliseconds to delay hover-off trigger. Defaults to zero.
     */
    hoverOffDelayInMs?: number,
    // onHoverChanged?: func,
    // onMouseEnter?: func,
    // onMouseLeave?: func,
    // onMouseOver?: func,
    // onMouseOut?: func,
    /**
     * Defaults to true. Optionally suppress decoration of child components by setting this prop false.
     */
    shouldDecorateChildren?: boolean,

    children: React.ReactNode | ChildrenFunction,
  }

  interface State {
    isHovering: boolean,
  }

  /**
   * A React component that notifies its children of hover interactions.
   *
   * Optionally observe mouseenter, mouseleave, mouseover, and mouseout events.
   *
   * Supports delayed hover and hover-off, which can help reduce unintentional triggering.
   */
  class ReactHoverObserver extends React.Component<Props, State> {}

  export default ReactHoverObserver;
}
