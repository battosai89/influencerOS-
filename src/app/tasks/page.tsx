"use client";

import * as React from 'react';
import { useState } from 'react';
import useStore from '@/hooks/useStore';
import { Plus, CheckCircle, Circle, Calendar, Flag, Filter } from 'lucide-react';

const Tasks: React.FC = () => {
    const { tasks, updateTask, deleteTask } = useStore();
    const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTasks = tasks.filter(task => {
        const matchesFilter = filter === 'all' || 
            (filter === 'pending' && task.status === 'pending') ||
            (filter === 'completed' && task.status === 'completed');
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const handleToggleComplete = (taskId: string) => {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            updateTask(taskId, { status: task.status === 'completed' ? 'pending' : 'completed' });
        }
    };

    const handleDelete = (taskId: string) => {
        if (confirm('Are you sure you want to delete this task?')) {
            deleteTask(taskId);
        }
    };

    const handleCreateTask = () => {
        // TODO: Implement task creation modal or redirect to task creation
        console.log('Create new task');
    };

    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const totalTasks = tasks.length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-brand-text-primary">Tasks</h1>
                    <p className="text-brand-text-secondary">Manage your daily tasks and to-dos</p>
                </div>
                <button
                    onClick={handleCreateTask}
                    className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-accent transition-colors flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    New Task
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-brand-surface futuristic-border rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-brand-text-secondary">Total Tasks</p>
                            <p className="text-2xl font-bold text-brand-text-primary">{totalTasks}</p>
                        </div>
                        <Circle className="w-8 h-8 text-brand-primary" />
                    </div>
                </div>
                <div className="bg-brand-surface futuristic-border rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-brand-text-secondary">Completed</p>
                            <p className="text-2xl font-bold text-brand-success">{completedTasks}</p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-brand-success" />
                    </div>
                </div>
                <div className="bg-brand-surface futuristic-border rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-brand-text-secondary">Pending</p>
                            <p className="text-2xl font-bold text-brand-warning">{totalTasks - completedTasks}</p>
                        </div>
                        <Flag className="w-8 h-8 text-brand-warning" />
                    </div>
                </div>
                <div className="bg-brand-surface futuristic-border rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-brand-text-secondary">Completion Rate</p>
                            <p className="text-2xl font-bold text-brand-text-primary">{completionRate}%</p>
                        </div>
                        <Calendar className="w-8 h-8 text-brand-primary" />
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="flex gap-4">
                <div className="flex-1">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 pl-10 bg-brand-surface border border-brand-border rounded-lg text-brand-text-primary placeholder-brand-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        />
                        <Filter className="absolute left-3 top-2.5 w-4 h-4 text-brand-text-secondary" />
                    </div>
                </div>
                <div className="flex gap-2">
                    {(['all', 'pending', 'completed'] as const).map((filterType) => (
                        <button
                            key={filterType}
                            onClick={() => setFilter(filterType)}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                                filter === filterType
                                    ? 'bg-brand-primary text-white'
                                    : 'bg-brand-surface text-brand-text-secondary hover:bg-brand-border'
                            }`}
                        >
                            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tasks List */}
            <div className="space-y-4">
                {filteredTasks.map((task) => (
                    <div
                        key={task.id}
                        className="bg-brand-surface futuristic-border rounded-xl p-6 hover:bg-brand-bg/50 transition-colors"
                    >
                        <div className="flex items-start gap-4">
                            <button
                                onClick={() => handleToggleComplete(task.id)}
                                className={`mt-1 transition-colors ${
                                    task.status === 'completed' 
                                        ? 'text-brand-success' 
                                        : 'text-brand-text-secondary hover:text-brand-primary'
                                }`}
                            >
                                {task.status === 'completed' ? (
                                    <CheckCircle className="w-5 h-5" />
                                ) : (
                                    <Circle className="w-5 h-5" />
                                )}
                            </button>
                            
                            <div className="flex-1">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className={`font-semibold ${
                                            task.status === 'completed' 
                                                ? 'text-brand-text-secondary line-through' 
                                                : 'text-brand-text-primary'
                                        }`}>
                                            {task.title}
                                        </h3>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 ml-4">
                                        <button
                                            onClick={() => handleDelete(task.id)}
                                            className="text-brand-text-secondary hover:text-red-500 transition-colors"
                                        >
                                            ×
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-4 mt-3 text-sm text-brand-text-secondary">
                                    {task.dueDate && (
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredTasks.length === 0 && (
                <div className="text-center py-12">
                    <Circle className="w-16 h-16 mx-auto text-brand-border mb-4" />
                    <h3 className="text-lg font-semibold text-brand-text-primary mb-2">No tasks found</h3>
                    <p className="text-brand-text-secondary mb-4">
                        {searchTerm ? "No tasks match your search" : "Get started by creating your first task"}
                    </p>
                    {!searchTerm && (
                        <button
                            onClick={handleCreateTask}
                            className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-accent transition-colors inline-flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Create Task
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default Tasks;
