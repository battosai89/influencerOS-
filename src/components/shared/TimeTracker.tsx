"use client";

import React from 'react';
import { TimeEntry } from '@/types';

interface TimeTrackerProps {
  entries: TimeEntry[];
  onStart: (taskId?: string, description?: string) => void;
  onStop: (id: string) => void;
}

const TimeTracker: React.FC<TimeTrackerProps> = ({ entries, onStart, onStop }) => {
  // Placeholder for time tracker component
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Time Tracker (Coming Soon)</h3>
      <p>Timer and analytics will be implemented here.</p>
      {/* TODO: Implement timer with start/stop buttons */}
    </div>
  );
};

export default TimeTracker;