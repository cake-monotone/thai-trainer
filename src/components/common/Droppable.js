import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import PropTypes from 'prop-types';

const Droppable = ({ droppableId, styleGenerator, children }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: droppableId,
  });

  return (
    <div ref={setNodeRef} style={styleGenerator(isOver)}>
      {children}
    </div>
  );
};

Droppable.propTypes = {
  droppableId: PropTypes.string,
  styleGenerator: PropTypes.func.isRequired,
  children: PropTypes.node,
};

export default Droppable;
