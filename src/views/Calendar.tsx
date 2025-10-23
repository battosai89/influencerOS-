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

  // Memoize event type colors for performance
  const memoizedEventTypeColors = useMemo(() => eventTypeColors, []);

  // Memoize events grouped by date for better performance
  const eventsByDate = useMemo(() => {
    const eventsByDate: { [key: string]: Event[] } = {};
    events.forEach(event => {
        // For multi-day events, show them on each day they span
        const eventDates = [];
        for (let d = new Date(event.start); d <= event.end; d.setDate(d.getDate() + 1)) {
            eventDates.push(new Date(d));
        }

        eventDates.forEach(date => {
            const dateKey = date.toISOString().split('T')[0];
            if (!eventsByDate[dateKey]) {
                eventsByDate[dateKey] = [];
            }
            // Avoid duplicating event
            if (!eventsByDate[dateKey].some(e => e.id === event.id)) {
                 eventsByDate[dateKey].push(event);
            }
        });
    });
    return eventsByDate;
  }, [events]);

  // Memoize current date calculations
  const currentDateInfo = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const todayString = new Date().toDateString();

    return {
      year,
      month,
      firstDayOfMonth,
      daysInMonth,
      todayString,
      monthYearString: currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })
    };
  }, [currentDate]);

  // Memoize calendar grid generation
  const { calendarGrid, monthYear } = useMemo(() => {
    const { year, month, firstDayOfMonth, daysInMonth, todayString } = currentDateInfo;

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
                    isToday: date.toDateString() === todayString,
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
        monthYear: currentDateInfo.monthYearString
    };
  }, [currentDateInfo, eventsByDate]);

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
    Meeting: 'bg-gradient-to-r from-blue-500/20 to-blue-600/30 text-blue-100 border-l-4 border-blue-400 shadow-sm hover:shadow-blue-500/20',
    Appointment: 'bg-gradient-to-r from-purple-500/20 to-purple-600/30 text-purple-100 border-l-4 border-purple-400 shadow-sm hover:shadow-purple-500/20',
    Deadline: 'bg-gradient-to-r from-red-500/20 to-red-600/30 text-red-100 border-l-4 border-red-400 shadow-sm hover:shadow-red-500/20',
    'Campaign Milestone': 'bg-gradient-to-r from-green-500/20 to-green-600/30 text-green-100 border-l-4 border-green-400 shadow-sm hover:shadow-green-500/20',
  };

  return (
    <div className="animate-page-enter">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h1 className="text-3xl font-bold text-brand-text-primary">Calendar</h1>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 p-1 bg-gradient-to-r from-brand-surface/80 to-brand-bg/80 backdrop-blur-sm rounded-full border border-brand-border/50 shadow-lg">
                    <button
                        onClick={() => changeMonth(-1)}
                        className="group p-3 text-brand-text-secondary hover:text-white hover:bg-brand-primary/20 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
                    >
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform duration-200"/>
                    </button>
                    <div className="px-6 py-2 bg-gradient-to-r from-brand-primary/10 to-brand-accent/10 rounded-full border border-brand-primary/20">
                        <h2 className="text-lg font-bold text-brand-text-primary min-w-[200px] text-center tracking-wide">
                            {monthYear}
                        </h2>
                    </div>
                    <button
                        onClick={() => changeMonth(1)}
                        className="group p-3 text-brand-text-secondary hover:text-white hover:bg-brand-primary/20 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
                    >
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-200"/>
                    </button>
                </div>
                <button onClick={() => { setSelectedDate(new Date()); setNewEventModalOpen(true); }} className="flex items-center gap-2 bg-brand-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-accent transition-colors">
                    <Plus className="w-5 h-5" />
                    New Event
                </button>
            </div>
        </div>

        <div className="futuristic-border bg-gradient-to-br from-brand-surface/90 to-brand-bg/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-2xl">
            <div className="grid grid-cols-7 border-b border-brand-border/50 bg-gradient-to-r from-brand-surface/50 to-brand-bg/50">
                {daysOfWeek.map(day => (
                    <div key={day} className="p-3 md:p-4 text-center text-xs md:text-sm font-bold text-brand-text-secondary hidden md:block transition-colors hover:bg-brand-bg/50">{day}</div>
                ))}
                {daysOfWeek.map(day => (
                    <div key={day} className="p-3 md:p-4 text-center text-xs md:text-sm font-bold text-brand-text-secondary md:hidden transition-colors hover:bg-brand-bg/50">{day.substring(0,3)}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 h-[calc(100vh-20rem)] md:h-[calc(100vh-22rem)] min-h-[600px]">
                {calendarGrid.flat().map((cell, index) => (
                    <div
                        key={index}
                        className={`border-r border-b border-brand-border/30 p-2 md:p-3 flex flex-col group relative transition-all duration-200 ${cell.isEmpty ? 'bg-gradient-to-br from-brand-bg/20 to-brand-surface/30' : 'hover:bg-gradient-to-br hover:from-brand-bg/60 hover:to-brand-surface/80 cursor-pointer hover:shadow-inner'}`}
                        onClick={() => !cell.isEmpty && cell.date && handleDayClick(cell.date)}
                    >
                        {!cell.isEmpty && cell.date && (
                            <>
                                <span className={`relative self-end text-sm font-bold mb-2 transition-all duration-300 ${cell.isToday ? 'bg-gradient-to-br from-brand-primary via-brand-accent to-brand-primary text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg shadow-brand-primary/30 animate-pulse' : 'text-brand-text-secondary hover:text-brand-text-primary'}`}>
                                    {cell.day}
                                    {cell.isToday && (
                                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-brand-accent rounded-full animate-ping"></span>
                                    )}
                                </span>
                                <div className="space-y-1 overflow-y-auto flex-grow -mx-2 px-2">
                                    {cell.events?.map((event, eventIndex) => (
                                        <div
                                            key={event.id}
                                            onClick={(e) => { e.stopPropagation(); handleEventClick(event); }}
                                            className={`px-3 py-2 rounded-lg text-xs cursor-pointer hover:scale-105 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${eventTypeColors[event.type]} backdrop-blur-sm border border-white/10 group relative`}
                                            style={{
                                                zIndex: cell.events?.length ? cell.events.length - eventIndex : 1,
                                                transform: `translateY(${eventIndex * 2}px)`
                                            }}
                                        >
                                            <div className="flex items-center justify-between">
                                                <p className="font-semibold truncate flex-1">{event.title}</p>
                                                <span className="opacity-60 group-hover:opacity-100 transition-opacity text-[10px] ml-2">
                                                    {event.type}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                 <button
                                     onClick={(e) => { e.stopPropagation(); if (cell.date) handleDayClick(cell.date); }}
                                     className="absolute bottom-2 right-2 p-2 bg-gradient-to-r from-brand-primary to-brand-accent rounded-full text-white opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 hover:shadow-lg hover:shadow-brand-primary/25 transform translate-y-1 group-hover:translate-y-0 active:scale-95"
                                     title="Add new event"
                                 >
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
