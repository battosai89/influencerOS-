import React from 'react';
import { render, screen } from '@testing-library/react';
import DraggableTimeline from '../DraggableTimeline';
import { Task } from '@/types';

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Test Task 1',
    dueDate: '2025-01-15',
    status: 'pending',
    startDate: '2025-01-10',
    endDate: '2025-01-20'
  },
  {
    id: '2',
    title: 'Test Task 2',
    dueDate: '2025-01-20',
    status: 'completed'
  }
];

const mockOnTaskUpdate = jest.fn();

describe('DraggableTimeline', () => {
  it('renders timeline component', () => {
    render(
      <DraggableTimeline
        tasks={mockTasks}
        onTaskUpdate={mockOnTaskUpdate}
      />
    );

    expect(screen.getByText('Gantt Timeline')).toBeInTheDocument();
  });

  it('displays task titles', () => {
    render(
      <DraggableTimeline
        tasks={mockTasks}
        onTaskUpdate={mockOnTaskUpdate}
      />
    );

    expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    expect(screen.getByText('Test Task 2')).toBeInTheDocument();
  });
});