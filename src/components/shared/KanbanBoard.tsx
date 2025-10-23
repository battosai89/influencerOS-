"use client";

import React from 'react';
import { Influencer, Brand } from '@/types';

interface KanbanBoardProps {
  items: (Influencer | Brand)[];
  stages: string[];
  onItemMove: (id: string, newStage: string) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ items, stages, onItemMove }) => {
  // Placeholder for Kanban board component
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Kanban Board (Coming Soon)</h3>
      <p>Drag-drop pipeline will be implemented here.</p>
      {/* TODO: Implement Kanban with @dnd-kit */}
    </div>
  );
};

export default KanbanBoard;