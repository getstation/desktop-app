import * as React from 'react';
import { DragSource, DragSourceMonitor, DropTarget } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { findDOMNode } from 'react-dom';
import { compose } from 'react-apollo';
import { oc } from 'ts-optchain';

import { withGetApplication, GetApplicationQuery } from '../queries@local.gql.generated';

import AppDockIcon from './ConnectedAppDockIcon';
import { on } from 'events';

interface AppDockIconProps {
  applicationId: string,
  active: boolean,
  badge: any,
  isInstanceLogoInDockIcon: any,
  logoURL: string,
  tabTitle: string,
  onOverStateChange: any,
  onClick: () => any,
  onRightClick: () => any,
  dramaticEnter?: boolean,
}

interface InjectedProps {
  application: GetApplicationQuery['application'],
}

interface OwnProps extends AppDockIconProps {
  manifestURL: string,
  index: number,
  moveIcon: (dragApplicationId: any, hoverIndex: any, manifestURL: any) => any,
  iconRef: (el: HTMLDivElement) => void
}

interface DndProps {
  connectDropTarget: (arg: any) => any,
  connectDragSource: (arg: any) => any,
  connectDragPreview: (arg: any) => any,
  isDragging: boolean,
}

interface DropResult {
  type: 'DND_DOCK',
  [k: string]: any,
}

type Props = OwnProps & InjectedProps & DndProps;

// TODO : Unplug : Is this still needed ? It was doing something only on DropResult.type = DND_SHORTCUT_RACK
const dockAppSource = {
  beginDrag(props: Props) {
    return {
      applicationId: props.applicationId,
      manifestURL: props.manifestURL,
      index: props.index,
      tabTitle: props.tabTitle,
    };
  },
  endDrag(props: Props, monitor: DragSourceMonitor) {
    const item = monitor.getItem();
    const dropResult: DropResult = monitor.getDropResult();

    if (!dropResult) return;
  },
};

const dockAppTarget = {
  drop: () => ({
    type: 'DND_DOCK',
  }),
  hover(props: Props, monitor: any, component: any) {
    const { index: dragIndex, applicationId: dragApplicationId, manifestURL } = monitor.getItem();
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    const domNode = findDOMNode(component);
    if (!domNode) return;
    const hoverBoundingRect = domNode.getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    // console.log(`dragIndex: ${dragIndex}, hoverIndex: ${hoverIndex}`);

    // Time to actually perform the action
    props.moveIcon(dragApplicationId, hoverIndex, manifestURL);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  },
};

@DropTarget('APP_DOCK_APP', dockAppTarget, connect => ({
  connectDropTarget: connect.dropTarget(),
}))
@DragSource('APP_DOCK_APP', dockAppSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging(),
}))
class DraggableAppDockIcon extends React.PureComponent<Props> {
  componentDidMount() {
    // Use empty image as a drag preview so browsers don't draw it
    // and we can draw whatever we want on the custom drag layer instead.
    this.props.connectDragPreview(getEmptyImage());
  }

  componentDidUpdate() {
    // Used in componentDidUpdate too because of an issue (https://github.com/react-dnd/react-dnd/issues/1428).
    // There are high chances that this is fixed in more recent versions of DnD
    this.props.connectDragPreview(getEmptyImage());
  }

  render() {
    const {
      isDragging, connectDragSource, connectDropTarget, applicationId, active, badge, isInstanceLogoInDockIcon,
      logoURL, onOverStateChange, dramaticEnter,
      onClick, onRightClick, iconRef,
    } = this.props;

    const opacity = isDragging ? 0 : undefined;

    return connectDragSource && connectDropTarget && connectDragSource(connectDropTarget(
      <div style={{ opacity }}>
        <AppDockIcon
          applicationId={applicationId}
          active={active}
          badge={badge}
          isInstanceLogoInDockIcon={isInstanceLogoInDockIcon}
          logoURL={logoURL}
          onOverStateChange={onOverStateChange}
          onClick={onClick}
          onRightClick={onRightClick}
          iconRef={iconRef}
          dramaticEnter={dramaticEnter}
        />
      </div>
    ));
  }
}

const connector = compose(
  withGetApplication({
    options: ({ applicationId }: Props) => ({ variables: { applicationId } }),
    props: ({ data }) => ({
      loading: !data || data.loading,
      application: oc(data).application(),
    }),
  }),

);

export default connector(DraggableAppDockIcon);
