import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Move, XCircle } from 'lucide-react';
import { WIDGET_REGISTRY } from './WidgetRegistry';

interface DraggableWidgetProps {
  widgetItem: {
    id: string;
    widgetId: string;
    x: number;
    y: number;
    w: number;
    h: number;
  };
  isEditing: boolean;
  onRemove: (id: string) => void;
}

const DraggableWidget: React.FC<DraggableWidgetProps> = ({
  widgetItem,
  isEditing,
  onRemove
}) => {
  const widgetConfig = WIDGET_REGISTRY[widgetItem.widgetId];

  if (!widgetConfig) {
    return null;
  }

  const WidgetComponent = widgetConfig.component;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widgetItem.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    gridColumn: `${widgetItem.x + 1} / span ${widgetItem.w}`,
    gridRow: `${widgetItem.y + 1} / span ${widgetItem.h}`,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`futuristic-border bg-brand-surface rounded-xl flex flex-col h-full transition-all duration-300 hover:shadow-glow-md min-h-[280px] ${
        isDragging ? 'opacity-50 scale-105 shadow-glow-lg z-50' : ''
      } ${isEditing ? 'cursor-grab active:cursor-grabbing' : ''}`}
      {...attributes}
    >
      <header className="flex items-center justify-between p-4 border-b border-brand-border flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="text-brand-text-secondary">{widgetConfig.icon}</div>
          <h2 className="font-bold text-brand-text-primary">{widgetConfig.title}</h2>
        </div>
        <div className="flex items-center gap-1">
          {isEditing && (
            <div
              {...listeners}
              className="cursor-grab text-brand-text-secondary p-1 hover:text-brand-primary transition-colors"
              aria-label={`Drag ${widgetConfig.title} widget`}
            >
              <Move className="w-5 h-5" />
            </div>
          )}
          <button
            onClick={() => onRemove(widgetItem.id)}
            className="text-brand-text-secondary hover:text-red-500 p-1 transition-colors"
            aria-label={`Remove ${widgetConfig.title} widget`}
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>
      </header>
      <div className="p-4 flex-grow overflow-hidden flex flex-col">
        <WidgetComponent />
      </div>
    </div>
  );
};

export default DraggableWidget;