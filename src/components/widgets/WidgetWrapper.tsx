import React from 'react';
import { Move, XCircle } from 'lucide-react';
import { WIDGET_REGISTRY } from './WidgetRegistry';

interface WidgetWrapperProps {
  widgetItem: {
    id: string;
    widgetId: string;
    x: number;
    y: number;
    w: number;
    h: number;
  };
  isEditing: boolean;
  isDragging: boolean;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>, id: string) => void;
  onRemove: (id: string) => void;
}

const WidgetWrapper: React.FC<WidgetWrapperProps> = ({
  widgetItem,
  isEditing,
  isDragging,
  onMouseDown,
  onRemove
}) => {
  const widgetConfig = WIDGET_REGISTRY[widgetItem.widgetId];

  if (!widgetConfig) {
    return null;
  }

  const WidgetComponent = widgetConfig.component;

  const style = {
    gridColumn: `${widgetItem.x + 1} / span ${widgetItem.w}`,
    gridRow: `${widgetItem.y + 1} / span ${widgetItem.h}`,
  };

  return (
    <div
      style={style}
      className={`futuristic-border bg-brand-surface rounded-xl flex flex-col h-full transition-opacity duration-300 hover:shadow-glow-md min-h-[240px] ${
        isDragging ? 'opacity-30' : ''
      }`}
    >
      <header className="flex items-center justify-between p-3 border-b border-brand-border flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="text-brand-text-secondary">{widgetConfig.icon}</div>
          <h2 className="font-bold text-brand-text-primary">{widgetConfig.title}</h2>
        </div>
        <div className="flex items-center gap-1">
          {isEditing && (
            <div
              className="cursor-move text-brand-text-secondary p-1"
              aria-label={`Move ${widgetConfig.title} widget`}
              onMouseDown={(e) => onMouseDown(e, widgetItem.id)}
            >
              <Move className="w-5 h-5" />
            </div>
          )}
          <button
            onClick={() => onRemove(widgetItem.id)}
            className="text-brand-text-secondary hover:text-red-500 p-1"
            aria-label={`Remove ${widgetConfig.title} widget`}
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>
      </header>
      <div className="p-3 flex-grow overflow-hidden flex flex-col">
        <WidgetComponent />
      </div>
    </div>
  );
};

export default WidgetWrapper;