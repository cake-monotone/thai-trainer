import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import PropTypes from 'prop-types';

const Draggable = ({
  draggableId,
  children,
  isDragDisabled,
  styleGenerator,
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: draggableId,
  });
  const draggingStyle = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const style = styleGenerator(
    transform !== null,
    draggingStyle,
    isDragDisabled,
  );

  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </button>
  );
};

Draggable.propTypes = {
  draggableId: PropTypes.string,
  children: PropTypes.node,
  isDragDisabled: PropTypes.func,
  styleGenerator: PropTypes.func,
};

export default Draggable;
