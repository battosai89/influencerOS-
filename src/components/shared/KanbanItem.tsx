"use client";

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Influencer, Brand } from '@/types';

interface KanbanItemProps {
  item: Influencer | Brand;
}

const KanbanItem: React.FC<KanbanItemProps> = ({ item }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-3 bg-white rounded shadow cursor-move hover:shadow-md"
    >
      <div className="font-medium">{item.name}</div>
      <div className="text-sm text-gray-600">
        {'platform' in item ? (item as Influencer).platform : (item as Brand).industry}
      </div>
    </div>
  );
};

export default KanbanItem;