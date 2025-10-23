"use client";

import React from 'react';
import { Task } from '@/types';

interface DraggableTimelineProps {
  tasks: Task[];
  onTaskUpdate: (id: string, updates: Partial<Task>) => void;
}

const DraggableTimeline: React.FC<DraggableTimelineProps> = ({ tasks, onTaskUpdate }) => {
  // Placeholder for Gantt timeline component
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Timeline (Coming Soon)</h3>
      <p>Draggable Gantt chart will be implemented here.</p>
      {/* TODO: Implement D3-based timeline with drag-drop */}
    </div>
  );
};

export default DraggableTimeline;