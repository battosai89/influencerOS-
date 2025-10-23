"use client";

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Influencer, Brand } from '@/types';
import KanbanItem from './KanbanItem';

interface KanbanColumnProps {
  id: string;
  title: string;
  items: (Influencer | Brand)[];
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ id, title, items }) => {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div className="bg-gray-50 p-3 rounded-lg min-h-96">
      <h4 className="font-semibold mb-2 text-center">{title} ({items.length})</h4>
      <div ref={setNodeRef} className="space-y-2">
        <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
          {items.map((item) => (
            <KanbanItem key={item.id} item={item} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

export default KanbanColumn;