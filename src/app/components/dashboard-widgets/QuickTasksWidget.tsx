import * as React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ListTodo, Plus, CheckCircle, Circle, Calendar, Trash2 } from 'lucide-react';
import useStore from '@/hooks/useStore';

const QuickTasksWidget: React.FC = () => {
  const { supabaseTasks, addTask, updateTask, deleteTask } = useStore();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);

  // Filter to show only pending tasks, max 5 for the widget
  const pendingTasks = supabaseTasks
    .filter(task => task.status === 'pending')
    .slice(0, 5);

  const todayTasks = supabaseTasks.filter(task => {
    const today = new Date().toDateString();
    const taskDate = new Date(task.dueDate).toDateString();
    return taskDate === today && task.status === 'pending';
  });

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;

    try {
      await addTask({
        title: newTaskTitle.trim(),
        dueDate: new Date().toISOString().split('T')[0],
        status: 'pending'
      });
      setNewTaskTitle('');
      setIsAddingTask(false);
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  const handleToggleTask = (taskId: string) => {
    const task = supabaseTasks.find(t => t.id === taskId);
    if (task) {
      updateTask(taskId, { status: task.status === 'completed' ? 'pending' : 'completed' });
    }
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium">Quick Tasks</CardTitle>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {pendingTasks.length} pending
          </span>
          <ListTodo className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Add new task input */}
        {isAddingTask ? (
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Task title..."
              value={newTaskTitle}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter') handleAddTask();
                if (e.key === 'Escape') setIsAddingTask(false);
              }}
              className="w-full px-3 py-1 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              autoFocus
            />
            <div className="flex gap-1">
              <Button
                size="sm"
                onClick={handleAddTask}
                disabled={!newTaskTitle.trim()}
                className="h-7 px-2 text-xs"
              >
                Add
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsAddingTask(false)}
                className="h-7 px-2 text-xs"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsAddingTask(true)}
            className="w-full h-8 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Task
          </Button>
        )}

        {/* Tasks list */}
        <div className="space-y-2">
          {pendingTasks.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">
              No pending tasks
            </p>
          ) : (
            pendingTasks.map((task) => (
              <div key={task.id} className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                <button
                  onClick={() => handleToggleTask(task.id)}
                  className="flex-shrink-0"
                >
                  <Circle className="h-3 w-3 text-muted-foreground hover:text-primary" />
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{task.title}</p>
                  {task.dueDate && (
                    <div className="flex items-center gap-1 mt-1">
                      <Calendar className="h-2 w-2 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteTask(task.id)}
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))
          )}
        </div>

        {/* Summary */}
        {todayTasks.length > 0 && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              {todayTasks.length} due today
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuickTasksWidget;