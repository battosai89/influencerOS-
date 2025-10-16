import * as React from 'react';
import { useState, useMemo } from 'react';
import useStore from '../hooks/useStore';
import { Event } from '../types';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { NewEventModal, EventDetailModal } from '../components/CreationModals';

const Calendar: React.FC = () => {
  const { events } = useStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isNewEventModalOpen, setNewEventModalOpen] = useState(false);
  const [isEventDetailModalOpen, setEventDetailModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [eventToView, setEventToView] = useState<Event | null>(null);

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const { calendarGrid, monthYear } = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const eventsByDate: { [key: string]: Event[] } = {};
    events.forEach(event => {
        // For multi-day events, show them on each day they span
        for (let d = new Date(event.start); d <= event.end; d.setDate(d.getDate() + 1)) {
            const dateKey = new Date(d).toISOString().split('T')[0];
            if (!eventsByDate[dateKey]) {
                eventsByDate[dateKey] = [];
            }
            // Avoid duplicating event
            if (!eventsByDate[dateKey].some(e => e.id === event.id)) {
                 eventsByDate[dateKey].push(event);
            }
        }
    });

    const grid: { isEmpty: boolean; date: Date | null; day?: number; events?: Event[]; isToday?: boolean; }[][] = [];
    let dayCounter = 1;
    for (let i = 0; i < 6; i++) { // 6 weeks for full month coverage
        const week: { isEmpty: boolean; date: Date | null; day?: number; events?: Event[]; isToday?: boolean; }[] = [];
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDayOfMonth) {
                week.push({ isEmpty: true, date: null });
            } else if (dayCounter > daysInMonth) {
                week.push({ isEmpty: true, date: null });
            } else {
                const date = new Date(year, month, dayCounter);
                const dateKey = date.toISOString().split('T')[0];
                week.push({
                    day: dayCounter,
                    date: date,
                    events: (eventsByDate[dateKey] || []).sort((a,b) => a.start.getTime() - b.start.getTime()),
                    isToday: date.toDateString() === new Date().toDateString(),
                    isEmpty: false,
                });
                dayCounter++;
            }
        }
        grid.push(week);
        if (dayCounter > daysInMonth) break;
    }

    return {
        calendarGrid: grid,
        monthYear: currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })
    };
  }, [currentDate, events]);

  const changeMonth = (offset: number) => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setNewEventModalOpen(true);
  };
  
  const handleEventClick = (event: Event) => {
    setEventToView(event);
    setEventDetailModalOpen(true);
  };

  const eventTypeColors: { [key: string]: string } = {
    Meeting: 'bg-blue-500/20 text-blue-300 border-l-4 border-blue-500',
    Appointment: 'bg-purple-500/20 text-purple-300 border-l-4 border-purple-500',
    Deadline: 'bg-red-500/20 text-red-300 border-l-4 border-red-500',
    'Campaign Milestone': 'bg-green-500/20 text-green-300 border-l-4 border-green-500',
  };

  return (
    <div className="animate-page-enter">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h1 className="text-3xl font-bold text-brand-text-primary">Calendar</h1>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 p-1 bg-brand-bg rounded-full border border-brand-border">
                    <button onClick={() => changeMonth(-1)} className="p-2 text-brand-text-secondary hover:text-brand-text-primary rounded-full hover:bg-brand-surface"><ChevronLeft className="w-5 h-5"/></button>
                    <h2 className="text-lg font-semibold text-brand-text-primary w-40 text-center">{monthYear}</h2>
                    <button onClick={() => changeMonth(1)} className="p-2 text-brand-text-secondary hover:text-brand-text-primary rounded-full hover:bg-brand-surface"><ChevronRight className="w-5 h-5"/></button>
                </div>
                <button onClick={() => { setSelectedDate(new Date()); setNewEventModalOpen(true); }} className="flex items-center gap-2 bg-brand-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-accent transition-colors">
                    <Plus className="w-5 h-5" />
                    New Event
                </button>
            </div>
        </div>

        <div className="futuristic-border bg-brand-surface rounded-xl overflow-hidden">
            <div className="grid grid-cols-7 border-b border-brand-border">
                {daysOfWeek.map(day => (
                    <div key={day} className="p-4 text-center text-sm font-semibold text-brand-text-secondary hidden md:block">{day}</div>
                ))}
                {daysOfWeek.map(day => (
                    <div key={day} className="p-4 text-center text-sm font-semibold text-brand-text-secondary md:hidden">{day.substring(0,3)}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 h-[calc(100vh-22rem)]">
                {calendarGrid.flat().map((cell, index) => (
                    <div 
                        key={index}
                        className={`border-r border-b border-brand-border p-2 flex flex-col group relative ${cell.isEmpty ? 'bg-brand-bg/30' : 'hover:bg-brand-bg/50 cursor-pointer'}`}
                        onClick={() => !cell.isEmpty && cell.date && handleDayClick(cell.date)}
                    >
                        {!cell.isEmpty && cell.date && (
                            <>
                                <span className={`self-end text-sm font-semibold mb-2 ${cell.isToday ? 'bg-brand-primary text-white rounded-full w-7 h-7 flex items-center justify-center' : 'text-brand-text-secondary'}`}>
                                    {cell.day}
                                </span>
                                <div className="space-y-1 overflow-y-auto flex-grow -mx-2 px-2">
                                    {cell.events?.map(event => (
                                        <div 
                                            key={event.id}
                                            onClick={(e) => { e.stopPropagation(); handleEventClick(event); }}
                                            className={`px-2 py-1 rounded-md text-xs cursor-pointer hover:opacity-80 transition-opacity ${eventTypeColors[event.type]}`}
                                        >
                                            <p className="font-semibold truncate">{event.title}</p>
                                        </div>
                                    ))}
                                </div>
                                 <button onClick={(e) => { e.stopPropagation(); if (cell.date) handleDayClick(cell.date); }} className="absolute bottom-2 right-2 p-1 bg-brand-primary rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Plus className="w-4 h-4" />
                                 </button>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>

        <NewEventModal isOpen={isNewEventModalOpen} onClose={() => setNewEventModalOpen(false)} selectedDate={selectedDate} />
        <EventDetailModal isOpen={isEventDetailModalOpen} onClose={() => setEventDetailModalOpen(false)} eventToView={eventToView} />
    </div>
  );
};

export default Calendar;
