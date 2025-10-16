import * as React from 'react';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import useStore from '../hooks/useStore';
import { Task } from '../types';
import { Plus, FilePenLine, Trash2, Link as LinkIcon, Download, ChevronRight, ClipboardList } from 'lucide-react';
import { TaskModal } from '../components/CreationModals';
import ConfirmationModal from '../components/ConfirmationModal';
import { exportToCsv } from '../services/downloadUtils';
import EmptyState from '../components/EmptyState';
import notificationService from '../services/notificationService';

const TaskItem: React.FC<{
    task: Task;
    subtasks: Task[];
    onEdit: (task: Task) => void;
    onAddSubtask: (parentId: string) => void;
    onDelete: (task: Task) => void;
}> = ({ task, subtasks, onEdit, onAddSubtask, onDelete }) => {
    const { updateTask, campaigns, contracts } = useStore();
    const [isExpanded, setIsExpanded] = useState(true);
    
    const today = new Date();
    const isOverdue = new Date(task.dueDate) < today && task.status !== 'completed';
    const relatedCampaign = campaigns.find(c => c.id === task.relatedCampaignId);
    const relatedContract = contracts.find(c => c.id === task.relatedContractId);

    return (
        <div className={`futuristic-border bg-brand-surface rounded-xl transition-all duration-300 ${task.status === 'completed' ? 'opacity-60' : ''}`}>
            <div className="p-4 flex items-center gap-4">
                <input
                    type="checkbox"
                    checked={task.status === 'completed'}
                    onChange={() => updateTask(task.id, { status: task.status === 'pending' ? 'completed' : 'pending' })}
                    className="form-checkbox h-5 w-5 rounded-md bg-brand-bg border-brand-border text-brand-primary focus:ring-brand-primary flex-shrink-0"
                />
                <div className="flex-grow">
                    <p className={`font-semibold text-brand-text-primary ${task.status === 'completed' ? 'line-through' : ''}`}>{task.title}</p>
                    <div className="flex items-center gap-4 text-xs text-brand-text-secondary mt-1">
                        <span className={isOverdue ? 'font-bold text-brand-warning' : ''}>
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                        {relatedCampaign && <Link href={`/campaigns/${relatedCampaign.id}`} className="flex items-center gap-1 hover:text-brand-primary"><LinkIcon className="w-3 h-3"/> {relatedCampaign.name}</Link>}
                        {relatedContract && <Link href={`/contracts/${relatedContract.id}`} className="flex items-center gap-1 hover:text-brand-primary"><LinkIcon className="w-3 h-3"/> {relatedContract.title}</Link>}
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={() => onAddSubtask(task.id)} className="p-2 text-brand-text-secondary hover:text-brand-primary rounded-full hover:bg-brand-bg" title="Add subtask"><Plus className="w-4 h-4" /></button>
                    <button onClick={() => onEdit(task)} className="p-2 text-brand-text-secondary hover:text-brand-primary rounded-full hover:bg-brand-bg" title="Edit task"><FilePenLine className="w-4 h-4" /></button>
                    <button onClick={() => onDelete(task)} className="p-2 text-brand-text-secondary hover:text-red-500 rounded-full hover:bg-brand-bg" title="Delete task"><Trash2 className="w-4 h-4" /></button>
                    {subtasks.length > 0 && (
                        <button onClick={() => setIsExpanded(!isExpanded)} className="p-2 text-brand-text-secondary rounded-full hover:bg-brand-bg">
                            <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                        </button>
                    )}
                </div>
            </div>
            {subtasks.length > 0 && isExpanded && (
                <div className="pl-10 pr-4 pb-4 space-y-2">
                    {subtasks.map(subtask => (
                         <div key={subtask.id} className={`bg-brand-bg rounded-lg p-3 flex items-center gap-3 ${subtask.status === 'completed' ? 'opacity-50' : ''}`}>
                             <input type="checkbox" checked={subtask.status === 'completed'} onChange={() => updateTask(subtask.id, { status: subtask.status === 'pending' ? 'completed' : 'pending' })} className="form-checkbox h-4 w-4 rounded bg-brand-surface border-brand-border text-brand-primary focus:ring-brand-primary"/>
                             <div className="flex-grow">
                                <p className={`text-sm font-medium text-brand-text-primary ${subtask.status === 'completed' ? 'line-through' : ''}`}>{subtask.title}</p>
                                <p className="text-xs text-brand-text-secondary">Due: {new Date(subtask.dueDate).toLocaleDateString()}</p>
                             </div>
                             <div className="flex items-center gap-1">
                                <button onClick={() => onEdit(subtask)} className="p-1 text-brand-text-secondary hover:text-brand-primary rounded-full hover:bg-brand-surface"><FilePenLine className="w-3 h-3" /></button>
                                <button onClick={() => onDelete(subtask)} className="p-1 text-brand-text-secondary hover:text-red-500 rounded-full hover:bg-brand-surface"><Trash2 className="w-3 h-3" /></button>
                             </div>
                         </div>
                    ))}
                </div>
            )}
        </div>
    );
};


const Tasks: React.FC = () => {
  const { tasks, deleteTask } = useStore();
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [parentId, setParentId] = useState<string | undefined>(undefined);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const handleOpenModal = (task: Task | null = null, parentId?: string) => {
    setTaskToEdit(task);
    setParentId(parentId);
    setIsModalOpen(true);
  };
  
  const handleAddSubtask = (taskId: string) => {
      handleOpenModal(null, taskId);
  };

  const handleDeleteRequest = (task: Task) => {
    setTaskToDelete(task);
  };

  const handleConfirmDelete = () => {
    if (taskToDelete) {
        deleteTask(taskToDelete.id);
        setTaskToDelete(null);
        notificationService.show({ message: 'Task deleted successfully.', type: 'success' });
    }
  };

  const { parentTasks, subtasksByParent } = useMemo(() => {
    const parentTasks = tasks.filter(t => !t.parentId);
    const subtasksByParent = tasks.reduce((acc, task) => {
        if (task.parentId) {
            if (!acc[task.parentId]) acc[task.parentId] = [];
            acc[task.parentId].push(task);
        }
        return acc;
    }, {} as Record<string, Task[]>);
    return { parentTasks, subtasksByParent };
  }, [tasks]);

  const filteredParentTasks = useMemo(() => {
    if (filter === 'all') return parentTasks;
    return parentTasks.filter(t => t.status === filter);
  }, [parentTasks, filter]);

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-brand-text-primary">Tasks</h1>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2 p-1 bg-brand-bg rounded-full border border-brand-border">
            {(['all', 'pending', 'completed'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1 rounded-full text-sm font-semibold capitalize ${filter === f ? 'bg-brand-surface text-brand-text-primary' : 'text-brand-text-secondary'}`}>
                {f}
              </button>
            ))}
          </div>
          <button onClick={() => exportToCsv('tasks.csv', tasks as unknown as Record<string, unknown>[])} className="flex items-center gap-2 bg-brand-surface text-brand-text-primary font-semibold py-2 px-4 rounded-lg hover:bg-brand-border transition-colors whitespace-nowrap"><Download className="w-5 h-5" />Export CSV</button>
          <button onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-brand-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-accent transition-colors"><Plus className="w-5 h-5" />New Task</button>
        </div>
      </div>

        {filteredParentTasks.length > 0 ? (
            <div className="space-y-4">
                {filteredParentTasks.map(task => (
                    <TaskItem 
                        key={task.id}
                        task={task}
                        subtasks={subtasksByParent[task.id] || []}
                        onEdit={handleOpenModal}
                        onAddSubtask={handleAddSubtask}
                        onDelete={handleDeleteRequest}
                    />
                ))}
            </div>
        ) : (
             <EmptyState
                icon={<ClipboardList />}
                title={filter === 'all' ? 'No Tasks Yet' : `No ${filter} tasks`}
                description={filter === 'all' ? "Stay organized by creating tasks for yourself and your team." : `You have no ${filter} tasks. Great job!`}
                cta={
                    <button onClick={() => handleOpenModal()} className="flex items-center mx-auto gap-2 bg-brand-primary text-white font-semibold py-2 px-6 rounded-lg hover:bg-brand-accent transition-colors">
                        <Plus className="w-5 h-5" />
                        Create a Task
                    </button>
                }
            />
        )}
      <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} taskToEdit={taskToEdit} parentId={parentId} />
      <ConfirmationModal
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleConfirmDelete}
        title={`Delete Task: "${taskToDelete?.title}"?`}
        message={`Are you sure you want to delete this task? If it has subtasks, they will also be deleted. This action cannot be undone.`}
        confirmText="Delete Task"
    />
    </div>
  );
};

export default Tasks;