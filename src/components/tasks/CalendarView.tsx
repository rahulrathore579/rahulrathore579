import { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, MapPin, Calendar } from 'lucide-react';

interface Task {
    id: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    status: 'pending' | 'in_progress' | 'completed';
    due_date?: string;
    is_appointment: boolean;
    start_time?: string;
    end_time?: string;
    location?: string;
}

interface CalendarViewProps {
    tasks: Task[];
    onDateClick: (date: string) => void;
    onTaskClick: (task: Task) => void;
}

export default function CalendarView({ tasks, onDateClick, onTaskClick }: CalendarViewProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const previousMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const getTasksForDate = (day: number) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return tasks.filter(task => {
            if (task.start_time) {
                return task.start_time.startsWith(dateStr);
            }
            if (task.due_date) {
                return task.due_date.startsWith(dateStr);
            }
            return false;
        });
    };

    const formatTime = (datetime: string) => {
        const date = new Date(datetime);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'border-l-red-500 bg-red-50 dark:bg-red-900/30 text-red-900 dark:text-red-100';
            case 'medium': return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-100';
            case 'low': return 'border-l-green-500 bg-green-50 dark:bg-green-900/30 text-green-900 dark:text-green-100';
            default: return 'border-l-gray-500 bg-gray-50 dark:bg-gray-900/30 text-gray-900 dark:text-gray-100';
        }
    };

    const getPriorityDot = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-red-500';
            case 'medium': return 'bg-yellow-500';
            case 'low': return 'bg-green-500';
            default: return 'bg-gray-500';
        }
    };

    const isToday = (day: number) => {
        const today = new Date();
        return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
    };

    const isWeekend = (dayIndex: number) => {
        return dayIndex === 0 || dayIndex === 6; // Sunday or Saturday
    };

    // Generate calendar grid
    const calendarDays = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarDays.push(null); // Empty cells before first day
    }
    for (let day = 1; day <= daysInMonth; day++) {
        calendarDays.push(day);
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Calendar Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Calendar className="w-8 h-8 text-white" />
                        <h2 className="text-3xl font-bold text-white">
                            {monthNames[month]} {year}
                        </h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={goToToday}
                            className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 font-medium"
                        >
                            Today
                        </button>
                        <button
                            onClick={previousMonth}
                            className="p-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg"
                        >
                            <ChevronLeft className="w-5 h-5 text-white" />
                        </button>
                        <button
                            onClick={nextMonth}
                            className="p-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg"
                        >
                            <ChevronRight className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {/* Day Names */}
                <div className="grid grid-cols-7 gap-2 mb-3">
                    {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => (
                        <div
                            key={day}
                            className={`text-center text-sm font-bold py-3 rounded-lg ${isWeekend(index)
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                    : 'bg-gray-50 dark:bg-gray-900/50 text-gray-700 dark:text-gray-300'
                                }`}
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                    {calendarDays.map((day, index) => {
                        if (day === null) {
                            return <div key={`empty-${index}`} className="aspect-square" />;
                        }

                        const dayTasks = getTasksForDate(day);
                        const today = isToday(day);
                        const weekend = isWeekend((index % 7));

                        return (
                            <div
                                key={day}
                                className={`aspect-square border-2 rounded-xl p-3 cursor-pointer ${today
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-lg'
                                        : weekend
                                            ? 'border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md'
                                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md'
                                    }`}
                                onClick={() => {
                                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                    onDateClick(dateStr);
                                }}
                            >
                                <div className="flex flex-col h-full">
                                    {/* Day Number */}
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`text-lg font-bold ${today
                                                ? 'text-blue-600 dark:text-blue-400'
                                                : 'text-gray-700 dark:text-gray-300'
                                            }`}>
                                            {day}
                                        </span>
                                        {dayTasks.length > 0 && (
                                            <span className="px-2 py-0.5 bg-blue-600 text-white text-xs font-bold rounded-full">
                                                {dayTasks.length}
                                            </span>
                                        )}
                                    </div>

                                    {/* Task Dots/Pills */}
                                    <div className="flex-1 overflow-y-auto space-y-1.5">
                                        {dayTasks.slice(0, 3).map((task) => (
                                            <div
                                                key={task.id}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onTaskClick(task);
                                                }}
                                                className={`text-xs p-2 rounded-lg border-l-4 ${getPriorityColor(task.priority)} cursor-pointer hover:shadow-md`}
                                            >
                                                <div className="flex items-start gap-1.5">
                                                    {task.is_appointment && task.start_time && (
                                                        <Clock className="w-3 h-3 flex-shrink-0 mt-0.5" />
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-semibold truncate leading-tight">
                                                            {task.title}
                                                        </div>
                                                        {task.is_appointment && task.start_time && (
                                                            <div className="text-xs opacity-75 mt-0.5">
                                                                {formatTime(task.start_time)}
                                                            </div>
                                                        )}
                                                        {task.location && (
                                                            <div className="flex items-center gap-1 text-xs opacity-75 mt-0.5">
                                                                <MapPin className="w-2.5 h-2.5 flex-shrink-0" />
                                                                <span className="truncate">{task.location}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {dayTasks.length > 3 && (
                                            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 text-center py-1 bg-blue-50 dark:bg-blue-900/30 rounded">
                                                +{dayTasks.length - 3} more
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Legend */}
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                    <div className="flex flex-wrap items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/30"></div>
                            <span className="font-medium text-gray-700 dark:text-gray-300">Today</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/30 rounded"></div>
                            <span className="text-gray-600 dark:text-gray-400">High Priority</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/30 rounded"></div>
                            <span className="text-gray-600 dark:text-gray-400">Medium Priority</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-900/30 rounded"></div>
                            <span className="text-gray-600 dark:text-gray-400">Low Priority</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-gray-600 dark:text-gray-400">Appointment</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
