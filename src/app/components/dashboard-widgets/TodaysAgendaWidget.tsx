import * as React from 'react';
import useStore from '../../../hooks/useStore';
import { Calendar, Clock, CheckCircle, Circle, AlertTriangle } from 'lucide-react';

const TodaysAgendaWidget: React.FC = () => {
  const { supabaseTasks, supabaseEvents, supabaseLoading } = useStore();

  const todaysAgenda = React.useMemo(() => {
    const today = new Date().toISOString().split('T')[0];

    // Get today's tasks
    const todaysTasks = supabaseTasks.filter(task => {
      if (!task.dueDate) return false;
      return task.dueDate === today && task.status !== 'completed';
    });

    // Get today's events
    const todaysEvents = supabaseEvents.filter(event => {
      const eventDate = new Date(event.start).toISOString().split('T')[0];
      return eventDate === today;
    });

    // Combine and sort by time
    const combinedAgenda = [
      ...todaysTasks.map(task => ({
        id: `task-${task.id}`,
        type: 'task' as const,
        title: task.title,
        time: 'All Day', // Tasks don't have specific times, just due dates
        status: task.status,
        priority: 'normal' as const,
        completed: task.status === 'completed'
      })),
      ...todaysEvents.map(event => ({
        id: `event-${event.id}`,
        type: 'event' as const,
        title: event.title,
        time: event.allDay
          ? 'All Day'
          : new Date(event.start).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            }),
        status: 'scheduled' as const,
        priority: 'normal' as const,
        completed: false
      }))
    ];

    // Sort by time (All Day first, then by actual time)
    return combinedAgenda.sort((a, b) => {
      if (a.time === 'All Day' && b.time === 'All Day') return 0;
      if (a.time === 'All Day') return -1;
      if (b.time === 'All Day') return 1;

      // For actual times, sort chronologically
      return a.time.localeCompare(b.time);
    });
  }, [supabaseTasks, supabaseEvents]);

  const completedTasksCount = React.useMemo(() => {
    return supabaseTasks.filter(task => {
      const today = new Date().toISOString().split('T')[0];
      return task.dueDate === today && task.status === 'completed';
    }).length;
  }, [supabaseTasks]);

  const totalTodaysTasks = React.useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return supabaseTasks.filter(task => task.dueDate === today).length;
  }, [supabaseTasks]);

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
        <h3 className="text-lg font-semibold text-brand-text-primary">Today&apos;s Agenda</h3>
        <Calendar className="w-5 h-5 text-brand-primary" />
      </div>

      {/* Progress indicator */}
      {totalTodaysTasks > 0 && (
        <div className="bg-brand-bg rounded-lg p-3">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-brand-text-secondary">Today&apos;s Progress</span>
            <span className="font-medium text-brand-text-primary">
              {completedTasksCount}/{totalTodaysTasks} completed
            </span>
          </div>
          <div className="w-full bg-brand-border rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${totalTodaysTasks > 0 ? (completedTasksCount / totalTodaysTasks) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}

      {todaysAgenda.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-32 text-center">
          <Calendar className="w-12 h-12 text-brand-text-secondary mb-2" />
          <p className="text-brand-text-secondary text-sm">Nothing scheduled</p>
          <p className="text-xs text-brand-text-secondary/70">Your day is clear!</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {todaysAgenda.map(item => (
            <div
              key={item.id}
              className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                item.completed
                  ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800'
                  : 'bg-brand-bg border-brand-border hover:bg-brand-bg/80'
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {item.type === 'task' ? (
                  item.completed ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <Circle className="w-4 h-4 text-brand-text-secondary" />
                  )
                ) : (
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <Calendar className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-medium truncate ${
                    item.completed
                      ? 'text-green-700 dark:text-green-300 line-through'
                      : 'text-brand-text-primary'
                  }`}>
                    {item.title}
                  </p>
                  {item.type === 'task' && !item.completed && (
                    <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-xs rounded-full">
                      Due Today
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-3 h-3 text-brand-text-secondary" />
                  <span className="text-xs text-brand-text-secondary">
                    {item.time}
                  </span>
                  {item.type === 'event' && (
                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full">
                    Event
                  </span>
                  )}
                </div>
              </div>

              {item.type === 'task' && !item.completed && (
                <button className="flex-shrink-0 p-1 hover:bg-brand-border rounded transition-colors">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="pt-2 border-t border-brand-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-brand-text-secondary">Upcoming</span>
          <button className="text-xs text-brand-primary hover:text-brand-primary/80 font-medium">
            View calendar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodaysAgendaWidget;