import React, { useMemo, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  rectIntersection,
} from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import useStore from '@/hooks/useStore';
import DraggableWidget from './DraggableWidget';
import { WIDGET_REGISTRY } from './WidgetRegistry';

interface DashboardLayoutItem {
  id: string;
  widgetId: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface DashboardGridProps {
  tabId: string;
  layout: DashboardLayoutItem[];
  isEditing: boolean;
}

const DashboardGrid: React.FC<DashboardGridProps> = ({ tabId, layout, isEditing }) => {
  const { moveWidget, removeWidgetFromLayout } = useStore();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Calculate grid dimensions
  const gridDimensions = useMemo(() => {
    const cols = 12;
    const rows = Math.max(1, ...layout.map(item => item.y + item.h));
    return { cols, rows };
  }, [layout]);

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !activeId) {
      setActiveId(null);
      return;
    }

    const activeWidgetId = active.id as string;
    const overContainer = over.id as string;

    // If dropping on a container (grid area), calculate position
    if (overContainer.startsWith('grid-')) {
      const parts = overContainer.split('-');
      const row = parseInt(parts[1], 10);
      const col = parseInt(parts[2], 10);
      moveWidget(activeWidgetId, col, row);
    }

    setActiveId(null);
  };

  // Generate grid cells for drop zones (only in edit mode)
  const gridCells = useMemo(() => {
    if (!isEditing) return [];

    const cells = [];
    for (let row = 0; row < Math.max(4, gridDimensions.rows); row++) {
      for (let col = 0; col < gridDimensions.cols; col++) {
        const cellId = `grid-${row}-${col}`;
        const isOccupied = layout.some(item =>
          col >= item.x && col < item.x + item.w &&
          row >= item.y && row < item.y + item.h
        );

        cells.push({
          id: cellId,
          row,
          col,
          isOccupied,
        });
      }
    }
    return cells;
  }, [isEditing, layout, gridDimensions]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={isEditing ? rectIntersection : closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        className="relative grid gap-6"
        style={{
          gridTemplateColumns: `repeat(${gridDimensions.cols}, 1fr)`,
          gridAutoRows: 'minmax(280px, auto)',
          background: isEditing ? 'radial-gradient(circle, var(--color-border) 1px, transparent 1px)' : 'transparent',
          backgroundSize: isEditing ? '16px 16px' : '0 0',
        }}
      >
        {/* Render widgets */}
        <SortableContext items={layout.map(item => item.id)} strategy={rectSortingStrategy}>
          {layout.map(item => (
            <DraggableWidget
              key={item.id}
              widgetItem={item}
              isEditing={isEditing}
              onRemove={removeWidgetFromLayout}
            />
          ))}
        </SortableContext>

        {/* Render grid cells as drop zones in edit mode */}
        {isEditing && gridCells.map(cell => (
          <div
            key={cell.id}
            id={cell.id}
            className={`min-h-[280px] border-2 border-dashed rounded-xl transition-all duration-200 ${
              cell.isOccupied
                ? 'border-transparent bg-transparent'
                : 'border-brand-primary/30 bg-brand-primary/5 hover:border-brand-primary/50 hover:bg-brand-primary/10'
            }`}
            style={{
              gridColumn: `${cell.col + 1} / span 1`,
              gridRow: `${cell.row + 1} / span 1`,
            }}
          />
        ))}
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeId ? (() => {
          const widgetItem = layout.find(item => item.id === activeId);
          const widgetConfig = widgetItem ? WIDGET_REGISTRY[widgetItem.widgetId] : null;
          if (!widgetConfig) return null;

          const WidgetComponent = widgetConfig.component;
          return (
            <div className="w-full h-full futuristic-border bg-brand-surface rounded-xl flex flex-col opacity-90 shadow-glow-lg">
              <header className="flex items-center justify-between p-4 border-b border-brand-border flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="text-brand-text-secondary">{widgetConfig.icon}</div>
                  <h2 className="font-bold text-brand-text-primary">{widgetConfig.title}</h2>
                </div>
              </header>
              <div className="p-4 flex-grow overflow-hidden flex flex-col">
                <WidgetComponent />
              </div>
            </div>
          );
        })() : null}
      </DragOverlay>
    </DndContext>
  );
};

export default DashboardGrid;