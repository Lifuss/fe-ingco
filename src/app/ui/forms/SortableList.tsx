'use client';

import React, { useState } from 'react';

export interface DragHandleProps {
  draggable: boolean;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: () => void;
}

export interface ItemState {
  isDragging: boolean;
  isOver: boolean;
}

export interface SortableListProps<T> {
  items: T[];
  onReorder: (newItems: T[]) => void;
  keyExtractor: (item: T, index: number) => string | number;
  renderItem: (
    item: T,
    index: number,
    dragHandleProps: DragHandleProps,
    itemState: ItemState,
  ) => React.ReactNode;
  containerClassName?: string;
  itemClassName?: (isDragging: boolean, isOver: boolean) => string;
}

export function SortableList<T>({
  items,
  onReorder,
  keyExtractor,
  renderItem,
  containerClassName = 'flex flex-col divide-y divide-neutral-100',
  itemClassName,
}: SortableListProps<T>) {
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', String(index));
    e.dataTransfer.effectAllowed = 'move';
    // Defer state update so browser drag ghost image captures clean element
    setTimeout(() => {
      setDraggingIndex(index);
    }, 0);
  };

  const handleDragEnd = () => {
    setDraggingIndex(null);
    setOverIndex(null);
  };

  const handleDragOver = (index: number) => (e: React.DragEvent) => {
    e.preventDefault();
    if (draggingIndex !== null && draggingIndex !== index) {
      e.dataTransfer.dropEffect = 'move';
      setOverIndex(index);
    }
  };

  const handleDragLeave = (index: number) => () => {
    if (overIndex === index) {
      setOverIndex(null);
    }
  };

  const handleDrop = (dropIndex: number) => (e: React.DragEvent) => {
    e.preventDefault();
    setOverIndex(null);
    if (draggingIndex !== null && draggingIndex !== dropIndex) {
      const nextItems = [...items];
      const [movedItem] = nextItems.splice(draggingIndex, 1);
      nextItems.splice(dropIndex, 0, movedItem);
      onReorder(nextItems);
    }
    setDraggingIndex(null);
  };

  return (
    <div className={containerClassName}>
      {items.map((item, index) => {
        const isDragging = draggingIndex === index;
        const isOver = overIndex === index;
        const key = keyExtractor(item, index);

        const dragHandleProps: DragHandleProps = {
          draggable: true,
          onDragStart: handleDragStart(index),
          onDragEnd: handleDragEnd,
        };

        const defaultItemClass = `transition-colors ${
          isDragging ? 'opacity-40 bg-neutral-100/80' : isOver ? 'bg-amber-50/90 shadow-inner' : ''
        }`;

        const className = itemClassName ? itemClassName(isDragging, isOver) : defaultItemClass;

        return (
          <div
            key={key}
            onDragOver={handleDragOver(index)}
            onDragLeave={handleDragLeave(index)}
            onDrop={handleDrop(index)}
            className={className}
          >
            {renderItem(item, index, dragHandleProps, { isDragging, isOver })}
          </div>
        );
      })}
    </div>
  );
}

export default SortableList;
