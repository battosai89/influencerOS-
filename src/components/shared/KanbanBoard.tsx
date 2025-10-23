"use client";

import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Influencer, Brand } from '@/types';
import KanbanColumn from './KanbanColumn';

interface KanbanBoardProps {
  items: (Influencer | Brand)[];
  stages: string[];
  onItemMove: (id: string, newStage: string) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ items, stages, onItemMove }) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const newStage = over.id as string;
      onItemMove(active.id as string, newStage);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">CRM Pipeline</h3>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stages.map((stage) => (
            <KanbanColumn
              key={stage}
              id={stage}
              title={stage.charAt(0).toUpperCase() + stage.slice(1)}
              items={items.filter(item => 'status' in item && (item.status === stage || (stage === 'new' && item.status === 'lead')))}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
};

export default KanbanBoard;