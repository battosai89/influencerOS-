import * as React from 'react';
import useStore from '../../../hooks/useStore';
import { Clock, AlertTriangle, Calendar } from 'lucide-react';

const OverdueTasksWidget: React.FC = () => {
  const { supabaseTasks, supabaseLoading } = useStore();

  const overdueTasks = React.useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return supabaseTasks.filter(task =>
      task.dueDate &&
      task.dueDate < today &&
      task.status !== 'completed'
    ).slice(0, 5); // Limit to top 5 for widget display
  }, [supabaseTasks]);

  const formatDueDate = (dueDate: string) => {
    const date = new Date(dueDate);
    const today = new Date();
    const daysDiff = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff === 1) return '1 day overdue';
    if (daysDiff > 1) return `${daysDiff} days overdue`;
    return 'Due today';
  };

  if (supabaseLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-brand-text-secondary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 h-full">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-brand-text-primary">Overdue Tasks</h3>
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <span className="text-sm font-medium text-red-500">{overdueTasks.length}</span>
        </div>
      </div>

      {overdueTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-32 text-center">
          <Clock className="w-12 h-12 text-green-500 mb-2" />
          <p className="text-brand-text-secondary text-sm">All caught up!</p>
          <p className="text-xs text-brand-text-secondary/70">No overdue tasks</p>
        </div>
      ) : (
        <div className="space-y-3">
          {overdueTasks.map(task => (
            <div key={task.id} className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-brand-text-primary text-sm truncate">
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-3 h-3 text-brand-text-secondary" />
                    <span className="text-xs text-red-600 dark:text-red-400">
                      {task.dueDate ? formatDueDate(task.dueDate) : 'No due date'}
                    </span>
                  </div>
                  {task.relatedCampaignId && (
                    <p className="text-xs text-brand-text-secondary mt-1">
                      Related to campaign
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {supabaseTasks.filter(task =>
            task.dueDate &&
            task.dueDate < new Date().toISOString().split('T')[0] &&
            task.status !== 'completed'
          ).length > 5 && (
            <div className="text-center pt-2">
              <button className="text-xs text-brand-primary hover:text-brand-primary/80 font-medium">
                View all overdue tasks
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OverdueTasksWidget;