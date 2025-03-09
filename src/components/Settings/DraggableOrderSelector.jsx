import React from 'react';
import PropTypes from 'prop-types';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const grid = 8;
const getListStyle = (isDraggingOver) => ({
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: isDraggingOver ? '#999' : '#ddd',
  padding: grid,
  width: 250,
});

const SortableItem = ({ id, disabled }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    userSelect: 'none',
    padding: grid * 2,
    marginBottom: grid,
    background: isDragging ? '#73959a' : disabled ? '#eee' : '#c8dbde',
    color: isDragging ? '#fff' : disabled ? '#ccc' : 'initial',
    textAlign: 'center',
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {id}
    </div>
  );
};

SortableItem.propTypes = {
  id: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
};

const DragDropSorter = ({ order, onChange, disabled, className }) => {
  const onDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = order.indexOf(active.id);
    const newIndex = order.indexOf(over.id);
    onChange(arrayMove(order, oldIndex, newIndex));
  };

  return (
    <div className={className}>
      <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={order} strategy={verticalListSortingStrategy}>
          <div style={getListStyle(false)}>
            {order.map((id) => (
              <SortableItem key={id} id={id} disabled={disabled} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

DragDropSorter.propTypes = {
  disabled: PropTypes.bool.isRequired,
  order: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default DragDropSorter;
