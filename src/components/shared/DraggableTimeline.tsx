"use client";

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Task } from '@/types';

interface DraggableTimelineProps {
  tasks: Task[];
  onTaskUpdate: (id: string, updates: Partial<Task>) => void;
}

const DraggableTimeline: React.FC<DraggableTimelineProps> = ({ tasks, onTaskUpdate }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || tasks.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 100 };
    const width = 800 - margin.left - margin.right;
    const height = tasks.length * 50 + margin.top + margin.bottom;

    svg.attr('width', width + margin.left + margin.right)
       .attr('height', height);

    const g = svg.append('g')
                 .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scale for time
    const startDate = d3.min(tasks, d => d.startDate ? new Date(d.startDate) : new Date(d.dueDate)) || new Date();
    const endDate = d3.max(tasks, d => d.endDate ? new Date(d.endDate) : new Date(d.dueDate)) || new Date();
    const xScale = d3.scaleTime()
                     .domain([startDate, endDate])
                     .range([0, width]);

    // Y scale for tasks
    const yScale = d3.scaleBand()
                     .domain(tasks.map(d => d.id))
                     .range([0, tasks.length * 50])
                     .padding(0.1);

    // Draw axes
    g.append('g')
     .attr('transform', `translate(0,${height - margin.top - margin.bottom})`)
     .call(d3.axisBottom(xScale));

    g.append('g')
     .call(d3.axisLeft(yScale));

    // Draw task bars
    g.selectAll('.task-bar')
     .data(tasks)
     .enter()
     .append('rect')
     .attr('class', 'task-bar')
     .attr('x', d => xScale(d.startDate ? new Date(d.startDate) : new Date(d.dueDate)))
     .attr('y', d => yScale(d.id) || 0)
     .attr('width', d => {
       if (d.startDate && d.endDate) {
         return xScale(new Date(d.endDate)) - xScale(new Date(d.startDate));
       }
       return 20; // Default width for tasks without dates
     })
     .attr('height', yScale.bandwidth())
     .attr('fill', d => d.status === 'completed' ? '#10b981' : '#3b82f6')
     .attr('cursor', 'pointer')
     .call(d3.drag<SVGRectElement, Task>()
       .on('start', function(event, d) {
         d3.select(this).raise();
       })
       .on('drag', function(event, d) {
         const newX = Math.max(0, Math.min(width - Number(d3.select(this).attr('width')), event.x));
         d3.select(this).attr('x', newX);
       })
       .on('end', function(event, d) {
         const newStart = xScale.invert(event.x);
         const newEnd = xScale.invert(event.x + Number(d3.select(this).attr('width')));
         onTaskUpdate(d.id, { startDate: newStart.toISOString().split('T')[0], endDate: newEnd.toISOString().split('T')[0] });
       }));

    // Add task labels
    g.selectAll('.task-label')
     .data(tasks)
     .enter()
     .append('text')
     .attr('class', 'task-label')
     .attr('x', d => xScale(d.startDate ? new Date(d.startDate) : new Date(d.dueDate)) - 10)
     .attr('y', d => (yScale(d.id) || 0) + yScale.bandwidth() / 2)
     .attr('dy', '0.35em')
     .text(d => d.title)
     .attr('font-size', '12px')
     .attr('fill', '#374151');

  }, [tasks, onTaskUpdate]);

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Gantt Timeline</h3>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default DraggableTimeline;