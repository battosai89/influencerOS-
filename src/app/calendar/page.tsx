"use client";

import { useState, useMemo } from 'react';
import useStore from '../../hooks/useStore';
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight, Clock, Users, Target } from 'lucide-react';
import { NewEventModal } from '../../components/CreationModals';

const CalendarPage = () => {
    const { events } = useStore();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<'month' | 'week' | 'day'>('month');
    const [showAddEvent, setShowAddEvent] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const { calendarDays, monthYear, weekDays } = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        // Month view
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const calendarDays = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            calendarDays.push(null);
        }
        for (let day = 1; day <= daysInMonth; day++) {
            calendarDays.push(new Date(year, month, day));
        }

        // Week view
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
        const weekDays = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            weekDays.push(day);
        }

        return {
            calendarDays,
            monthYear: currentDate.toLocaleString('default', { month: 'long', year: 'numeric' }),
            weekDays
        };
    }, [currentDate]);

    const eventsForDate = (date: Date) => {
        return events.filter(event => {
            const eventDate = new Date(event.start);
            return eventDate.toDateString() === date.toDateString();
        });
    };

    const navigateMonth = (offset: number) => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getEventTypeColor = (type: string) => {
        switch (type.toLowerCase()) {
            case 'meeting': return 'bg-blue-500';
            case 'deadline': return 'bg-red-500';
            case 'campaign milestone': return 'bg-green-500';
            case 'appointment': return 'bg-purple-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div className="space-y-6 animate-page-enter">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-brand-text-primary font-display">Calendar</h1>
                    <p className="text-brand-text-secondary">Manage your schedule and events</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={goToToday}
                        className="px-4 py-2 bg-brand-surface text-brand-text-primary rounded-lg hover:bg-brand-border transition-colors"
                    >
                        Today
                    </button>
                    <button
                        onClick={() => setShowAddEvent(true)}
                        className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-accent transition-all duration-200 ease-in-out hover:scale-105 flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Event
                    </button>
                </div>
            </div>

            {/* View Controls */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                        {(['month', 'week', 'day'] as const).map((viewType) => (
                            <button
                                key={viewType}
                                onClick={() => setView(viewType)}
                                className={`px-4 py-2 rounded-lg transition-all duration-200 ease-in-out hover:scale-105 ${
                                    view === viewType
                                        ? 'bg-brand-primary text-white'
                                        : 'bg-brand-surface text-brand-text-secondary hover:bg-brand-border'
                                }`}
                            >
                                {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => navigateMonth(-1)}
                        className="p-2 bg-brand-surface rounded-lg hover:bg-brand-border transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 text-brand-text-secondary" />
                    </button>
                    <h2 className="text-xl font-bold text-brand-text-primary min-w-[200px] text-center">
                        {view === 'month' ? monthYear : view === 'week' ? 'This Week' : 'Today'}
                    </h2>
                    <button
                        onClick={() => navigateMonth(1)}
                        className="p-2 bg-brand-surface rounded-lg hover:bg-brand-border transition-colors"
                    >
                        <ChevronRight className="w-5 h-5 text-brand-text-secondary" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Calendar/Agenda View */}
                <div className="lg:col-span-3">
                    {view === 'month' && (
                        <div className="bg-brand-surface futuristic-border rounded-xl p-6">
                            {/* Calendar Header */}
                            <div className="grid grid-cols-7 gap-1 mb-4">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                    <div key={day} className="p-3 text-center text-sm font-semibold text-brand-text-secondary">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 gap-1">
                                {calendarDays.map((date, index) => (
                                    <div
                                        key={index}
                                        className={`min-h-[120px] p-2 border border-brand-border rounded-lg cursor-pointer hover:bg-brand-bg/50 transition-colors ${
                                            date?.toDateString() === new Date().toDateString()
                                                ? 'bg-brand-primary/10 border-brand-primary'
                                                : ''
                                        }`}
                                        onClick={() => date && setSelectedDate(date)}
                                    >
                                        {date && (
                                            <>
                                                <div className="text-sm font-semibold text-brand-text-primary mb-1">
                                                    {date.getDate()}
                                                </div>
                                                <div className="space-y-1">
                                                    {eventsForDate(date).slice(0, 3).map(event => (
                                                        <div
                                                            key={event.id}
                                                            className={`text-xs p-1 rounded ${getEventTypeColor(event.type)} text-white truncate`}
                                                            title={event.title}
                                                        >
                                                            {event.title}
                                                        </div>
                                                    ))}
                                                    {eventsForDate(date).length > 3 && (
                                                        <div className="text-xs text-brand-text-secondary">
                                                            +{eventsForDate(date).length - 3} more
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {view === 'week' && (
                        <div className="bg-brand-surface futuristic-border rounded-xl p-6">
                            <div className="space-y-4">
                                {weekDays.map((day, index) => (
                                    <div key={index} className="flex gap-4">
                                        <div className="w-20 flex-shrink-0">
                                            <div className={`text-sm font-semibold p-2 rounded ${
                                                day.toDateString() === new Date().toDateString()
                                                    ? 'bg-brand-primary text-white'
                                                    : 'text-brand-text-primary'
                                            }`}>
                                                {day.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                            </div>
                                        </div>
                                        <div className="flex-1 min-h-[60px] border border-brand-border rounded-lg p-2">
                                            {eventsForDate(day).map(event => (
                                                <div
                                                    key={event.id}
                                                    className={`text-sm p-2 mb-1 rounded ${getEventTypeColor(event.type)} text-white`}
                                                >
                                                    <div className="font-semibold">{event.title}</div>
                                                    <div className="text-xs opacity-90">
                                                        {formatTime(new Date(event.start))} - {formatTime(new Date(event.end))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {view === 'day' && (
                        <div className="bg-brand-surface futuristic-border rounded-xl p-6">
                            <div className="text-center mb-6">
                                <h3 className="text-xl font-bold text-brand-text-primary">
                                    {currentDate.toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </h3>
                            </div>
                            <div className="space-y-4">
                                {eventsForDate(currentDate).length > 0 ? (
                                    eventsForDate(currentDate).map(event => (
                                        <div key={event.id} className={`p-4 rounded-lg ${getEventTypeColor(event.type)} text-white`}>
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h4 className="font-semibold">{event.title}</h4>
                                                    <p className="text-sm opacity-90">{event.type}</p>
                                                </div>
                                                <div className="text-right text-sm">
                                                    <div>{formatTime(new Date(event.start))}</div>
                                                    <div className="opacity-75">
                                                        {new Date(event.end).getTime() - new Date(event.start).getTime() > 0 &&
                                                            formatTime(new Date(event.end))
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12">
                                        <CalendarIcon className="w-16 h-16 mx-auto text-brand-border mb-4" />
                                        <p className="text-brand-text-secondary">No events scheduled for this day</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Upcoming Events */}
                    <div className="bg-brand-surface futuristic-border rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-brand-text-primary mb-4">Upcoming Events</h3>
                        <div className="space-y-3">
                            {events
                                .filter(e => new Date(e.start) >= new Date())
                                .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
                                .slice(0, 5)
                                .map(event => (
                                    <div key={event.id} className="p-3 bg-brand-bg rounded-lg border border-brand-border">
                                        <h4 className="font-medium text-brand-text-primary text-sm">{event.title}</h4>
                                        <p className="text-xs text-brand-text-secondary mb-1">{event.type}</p>
                                        <div className="flex items-center gap-1 text-xs text-brand-text-secondary">
                                            <Clock className="w-3 h-3" />
                                            {new Date(event.start).toLocaleDateString()} at {formatTime(new Date(event.start))}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-brand-surface futuristic-border rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-brand-text-primary mb-4">Quick Stats</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-brand-text-secondary">This Week</span>
                                <span className="font-semibold text-brand-text-primary">
                                    {events.filter(e => {
                                        const eventDate = new Date(e.start);
                                        const now = new Date();
                                        const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                                        return eventDate >= now && eventDate <= weekFromNow;
                                    }).length}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-brand-text-secondary">This Month</span>
                                <span className="font-semibold text-brand-text-primary">
                                    {events.filter(e => {
                                        const eventDate = new Date(e.start);
                                        const now = new Date();
                                        return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
                                    }).length}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-brand-text-secondary">Total Events</span>
                                <span className="font-semibold text-brand-text-primary">{events.length}</span>
                            </div>
                        </div>
                    </div>

                    {/* Advanced Scheduling */}
                    <div className="bg-brand-surface futuristic-border rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-brand-text-primary mb-4">Advanced Scheduling</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-3 bg-brand-bg rounded-lg">
                                <Users className="w-5 h-5 text-brand-primary" />
                                <div>
                                    <h4 className="font-medium text-brand-text-primary text-sm">Event Polling</h4>
                                    <p className="text-xs text-brand-text-secondary">Find optimal meeting times</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-brand-bg rounded-lg">
                                <Target className="w-5 h-5 text-brand-success" />
                                <div>
                                    <h4 className="font-medium text-brand-text-primary text-sm">Gantt Integration</h4>
                                    <p className="text-xs text-brand-text-secondary">Sync with task milestones</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-brand-bg rounded-lg">
                                <Clock className="w-5 h-5 text-brand-warning" />
                                <div>
                                    <h4 className="font-medium text-brand-text-primary text-sm">Smart Reminders</h4>
                                    <p className="text-xs text-brand-text-secondary">AI-powered notifications</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <button className="w-full px-3 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-accent transition-colors text-sm">
                                Create Poll
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Event Creation Modal */}
            <NewEventModal
                isOpen={showAddEvent}
                onClose={() => setShowAddEvent(false)}
                selectedDate={selectedDate || undefined}
            />
        </div>
    );
};

export default CalendarPage;