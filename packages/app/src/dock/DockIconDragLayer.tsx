import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import { createStyles, ThemeTypes } from '@getstation/theme';
import { DragLayer } from 'react-dnd';
import AppDockIcon from './components/ConnectedAppDockIcon';

interface OuterProps {
  onDraggingStateChange?: (isDragging: boolean) => void,
}
interface OwnProps {
  item: {
    applicationId: string,
    manifestURL: string,
    index: number,
  },
  itemType: string,
  initialOffset: { x: number, y: number },
  currentOffset: { x: number, y: number },
  isDragging: boolean,
}

type Props = OuterProps & OwnProps & { classes: {
  container: string,
  title: string,
}};

const styles = (theme: ThemeTypes) => createStyles({
  container: {
    position: 'absolute',
    pointerEvents: 'none',
    zIndex: 100,
    left: 0,
    top: 0,
  },
  title: {
    width: 220,
    ...theme.mixins.ellipsis(1),
  },
});

function getItemStyles(props: Props) {
  const { currentOffset } = props;
  if (!currentOffset) {
    return {
      display: 'none',
    };
  }

  const transform = `translate(${currentOffset.x > 30 ? currentOffset.x : 0}px, ${currentOffset.y}px)`;

  return {
    display: 'flex',
    alignItems: 'center',
    transform: transform,
    WebkitTransform: transform,

    // Uncomment for the expanded state
    // color: 'rgba(60, 80, 93, 0.5)',
    // backgroundColor: currentOffset.x > 40 ? '#e6e8eb' : 'initial',
    // borderRadius: 100,
    // width: currentOffset.x > 40 ? 280 : 49,
    // height: 49,
    // transition: 'width 250ms ease-in-out, background-color 250ms ease-in-out',
    // boxShadow: currentOffset.x > 40 && '2px 2px 6px #BBB',
  };
}

@DragLayer(monitor => ({
  item: monitor.getItem(),
  itemType: monitor.getItemType(),
  initialOffset: monitor.getInitialSourceClientOffset(),
  currentOffset: monitor.getSourceClientOffset(),
  isDragging: monitor.isDragging(),
}))
class DockIconDragLayer extends React.PureComponent<Props> {

  componentDidUpdate(prevProps: Props) {
    const { onDraggingStateChange } = this.props;
    if (!onDraggingStateChange) return;

    if (prevProps.isDragging !== this.props.isDragging) {

      // We are only interested when an 'APP_DOCK_APP' is dragged
      // Though, when the drag ends (isDragging=false), `itemType`
      // is null. To make sure `onDraggingStateChange` is called when
      // drag ends, we don't check item type for `isDragging=false`.
      if (this.props.isDragging && this.props.itemType === 'APP_DOCK_APP') {
        onDraggingStateChange(true);
      }
      if (!this.props.isDragging) {
        onDraggingStateChange(false);
      }
    }
  }
  render() {
    const { classes, item, isDragging, itemType } = this.props;

    if (itemType !== 'APP_DOCK_APP') {
      return null;
    }
    if (!isDragging) {
      return null;
    }

    return (
      <div className={classes.container}>
        <div style={getItemStyles(this.props)}>
          <AppDockIcon
            applicationId={item.applicationId}
            active={true}
          />

          {/* Uncomment for the expanded state */}
          {/*<p className={classes.title}>{item.tabTitle}</p>*/}
        </div>
      </div>
    );
  }
}

export default injectSheet(styles)(DockIconDragLayer) as React.ComponentType<OwnProps>;
