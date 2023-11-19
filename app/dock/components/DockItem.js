import PropTypes from 'prop-types';
import React from 'react';
import ClickOutside from 'react-click-outside';
import { Manager, Popper, Reference } from 'react-popper';
import Subdock from '../../subdock/Container';
import DraggableAppDockIcon from './DraggableAppDockIcon';

class DockItem extends React.PureComponent {
  static propTypes = {
    applicationId: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
    badge: PropTypes.any,
    isInstanceLogoInDockIcon: PropTypes.bool.isRequired,
    logoURL: PropTypes.string.isRequired,
    onOverStateChange: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
    onRightClick: PropTypes.func.isRequired,

    index: PropTypes.number.isRequired,
    moveIcon: PropTypes.func.isRequired,
    dramaticEnter: PropTypes.bool,

    showSubdock: PropTypes.bool.isRequired,
    manifestURL: PropTypes.string.isRequired,
    onClickOutsideSubdock: PropTypes.func.isRequired,
    onSubdockOverStateChange: PropTypes.func.isRequired,
    handleHideSubdock: PropTypes.func.isRequired,
    iconRef: PropTypes.func.isRequired,
  };

  render() {
    const {
      applicationId,
      active,
      badge,
      isInstanceLogoInDockIcon,
      logoURL,
      onOverStateChange,
      onClick,
      onRightClick,
      manifestURL,
      index,
      moveIcon,
      showSubdock,
      onClickOutsideSubdock,
      onSubdockOverStateChange,
      handleHideSubdock,
      iconRef,
    } = this.props;

    const popperModifiers = {
      keepTogether: { enabled: false },
      preventOverflow: { enabled: true, boundariesElement: 'viewport' },
      offset: { offset: '-15, 35' },
      computeStyle: { gpuAcceleration: false }
    };

    return (
      <div className="l-dock__scroll__item">
        <Manager>
          <Reference>
            {({ ref }) => (
              <div ref={ref}>
                <DraggableAppDockIcon
                  applicationId={applicationId}
                  active={active}
                  badge={badge}
                  isInstanceLogoInDockIcon={isInstanceLogoInDockIcon}
                  logoURL={logoURL}
                  onOverStateChange={onOverStateChange}
                  onClick={onClick}
                  onRightClick={onRightClick}
                  manifestURL={manifestURL}
                  index={index}
                  moveIcon={moveIcon}
                  iconRef={iconRef}
                  tabTitle={'Cadeau 🎁 (Insert title of the current tab)'}
                  dramaticEnter={this.props.dramaticEnter}
                />
              </div>
            )}
          </Reference>
          {showSubdock && (
            <Popper placement="right-start" modifiers={popperModifiers}>
              {({ ref, style, placement, scheduleUpdate }) => {
                // we have to call scheduleUpdate when subdock is fully loaded to recompute popper position
                return (
                  <div ref={ref} style={style} data-placement={placement}>
                    <ClickOutside onClickOutside={onClickOutsideSubdock}>
                      <Subdock
                        applicationId={applicationId}
                        onOverStateChange={onSubdockOverStateChange}
                        handleHideSubdock={handleHideSubdock}
                        onLoaded={scheduleUpdate}
                      />
                    </ClickOutside>
                  </div>
                );
              }}
            </Popper>
          )}
        </Manager>
      </div>
    );
  }
}

export default DockItem;
