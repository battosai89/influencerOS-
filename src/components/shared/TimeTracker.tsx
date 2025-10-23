"use client";

import React, { useState } from 'react';
import { TimeEntry } from '@/types';
import { Play, Square, Clock } from 'lucide-react';

interface TimeTrackerProps {
  entries: TimeEntry[];
  onStart: (taskId?: string, description?: string) => void;
  onStop: (id: string) => void;
}

const TimeTracker: React.FC<TimeTrackerProps> = ({ entries, onStart, onStop }) => {
  const [currentEntry, setCurrentEntry] = useState<TimeEntry | null>(null);
  const [description, setDescription] = useState('');

  const handleStart = () => {
    onStart(undefined, description || 'Manual entry');
    setDescription('');
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const totalTime = entries.reduce((sum, entry) => sum + (entry.duration || 0), 0);

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Time Tracker</h3>

      {/* Timer Controls */}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="What are you working on?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-lg"
        />
        <button
          onClick={handleStart}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
        >
          <Play className="w-4 h-4" />
          Start
        </button>
      </div>

      {/* Current Entry */}
      {currentEntry && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span>{currentEntry.description}</span>
            <button
              onClick={() => onStop(currentEntry.id)}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-1"
            >
              <Square className="w-3 h-3" />
              Stop
            </button>
          </div>
        </div>
      )}

      {/* Time Entries */}
      <div className="space-y-2">
        <h4 className="font-medium">Recent Entries</h4>
        {entries.slice(0, 5).map((entry) => (
          <div key={entry.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
            <span>{entry.description}</span>
            <span className="text-sm text-gray-600">
              {entry.duration ? formatDuration(entry.duration) : 'Running'}
            </span>
          </div>
        ))}
      </div>

      {/* Total Time */}
      <div className="mt-4 p-2 bg-brand-primary/10 rounded">
        <span className="font-medium">Total Time: {formatDuration(totalTime)}</span>
      </div>
    </div>
  );
};

export default TimeTracker;