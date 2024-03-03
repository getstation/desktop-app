import * as React from 'react';
import { DragSource, DragSourceMonitor, DropTarget } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import SubdockItem, { BareApplication, WrappedActions } from './SubdockItem';
import { findDOMNode } from 'react-dom';
import { compose } from 'redux';
import { withReorderFavoriteMutation, withReorderTabMutation } from '../../tabs/queries@local.gql.generated';

// PROPS

type GqlProps = {
  reorderTab: (tabId: string, newPosition: number) => any,
  reorderFavorite: (favoriteId: string, newPosition: number) => any,
};

type OwnProps = {
  index: number,
  dragType: string,
  application: BareApplication,
  tabId: string,
  item: any,
  favorite: boolean,
  actions: WrappedActions,
};

interface DndProps {
  connectDropTarget: (arg: any) => any,
  connectDragSource: (arg: any) => any,
  connectDragPreview: (arg: any) => any,
  isDragging: boolean,
}

type Props = OwnProps & GqlProps & DndProps;

// DRAG SOURCE CONTRACTS
// https://react-dnd.github.io/react-dnd/docs/api/drag-source#drag-source-specification

const dockAppSource = {
  beginDrag(props: Props) {
    const { item, tabId } = props;
    return {
      index: props.index,
      application: { id: props.application.id },
      item: { title: item.title },
      tabId: tabId,
    };
  },
  endDrag(_props: Props, monitor: DragSourceMonitor) {
    const dropResult = monitor.getDropResult();

    if (!dropResult) return;

    /* Add here any effects you would like.
    For example:

    if (dropResult.type === 'SOMETHING') {
      ...do something here
    }
    */
  },
};

const SubdockItemTarget = {
  drop: () => ({
    type: 'DND_SUBDOCK',
  }),
  hover(props: Props, monitor: any, component: any) {
    const { favorite, reorderTab, reorderFavorite } = props;
    const { tabId, index: dragIndex } = monitor.getItem();
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
    favorite ? reorderFavorite(tabId, hoverIndex) : reorderTab(tabId, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  },
};

// DRAG COLLECT
// https://react-dnd.github.io/react-dnd/docs/api/drag-source#the-collecting-function

const collectTarget = (connect: any) => ({
  connectDropTarget: connect.dropTarget(),
});

const collectSource = (connect: any, monitor: any) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging(),
});

// COMPONENT

@DropTarget(({ dragType }: Props) => dragType, SubdockItemTarget, collectTarget)
@DragSource(({ dragType }: Props) => dragType, dockAppSource, collectSource)
class DraggableSubdockItemImpl extends React.PureComponent<Props> {
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
      isDragging, connectDragSource, connectDropTarget,
      application, actions, item,
    } = this.props;

    const opacity = isDragging ? 0 : undefined;

    return connectDragSource && connectDropTarget && connectDragSource(connectDropTarget(
      <div style={{ opacity }}>
        <SubdockItem
          application={application}
          actions={actions}
          item={item}
        />
      </div>
    ));
  }
}

// COMPOSE

const DraggableSubdockItem = compose(
  withReorderTabMutation({
    props: ({ mutate }) => ({
      reorderTab: (tabId: string, newPosition: number) =>
        // @ts-ignore tabId exists on ownProps
        mutate && mutate({ variables: { tabId, newPosition } }),
    }),
  }),
  withReorderFavoriteMutation({
    props: ({ mutate }) => ({
      reorderFavorite: (favoriteId: string, newPosition: number) =>
        // @ts-ignore tabId exists on ownProps
        mutate && mutate({ variables: { favoriteId, newPosition } }),
    }),
  }),
)(DraggableSubdockItemImpl);

// EXPORT

export default DraggableSubdockItem as React.ComponentType<OwnProps>;
