import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';


/**
 * Replace `react-tabs-redux`'s `TabContent` to use only CSS class names
 * to manage visibility, ie not using `display:none`.
 */
class PureClassTabContent extends PureComponent {

  static propTypes = {
    isVisible: PropTypes.bool,
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]),
  }

  render() {
    return (
      <div
        className={classNames(
          'l-webview__tab',
          { 'l-webview__tab--visible': !!this.props.isVisible }
        )}
      >
        {this.props.children}
      </div>
    );
  }
}

export default PureClassTabContent;
