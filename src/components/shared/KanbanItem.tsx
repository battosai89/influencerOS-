"use client";

import React, { useEffect, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Influencer, Brand } from '@/types';
import { analyzeLeadPotential } from '@/services/aiService';

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

  const [aiScore, setAiScore] = useState<{ score: number; insights: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  useEffect(() => {
    if ('platform' in item && !aiScore) {
      setLoading(true);
      analyzeLeadPotential(item).then(result => {
        setAiScore(result);
        setLoading(false);
      }).catch(() => {
        setLoading(false);
      });
    }
  }, [item, aiScore]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
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
      <div className="text-xs text-gray-500 mt-1">
        {'status' in item ? `Status: ${item.status}` : ''}
      </div>
      {aiScore && (
        <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">AI Score:</span>
            <span className={`font-semibold ${getScoreColor(aiScore.score)}`}>
              {aiScore.score}/100
            </span>
          </div>
          <p className="text-gray-500 mt-1">{aiScore.insights}</p>
        </div>
      )}
      {loading && (
        <div className="mt-2 text-xs text-gray-500">Analyzing...</div>
      )}
    </div>
  );
};

export default KanbanItem;