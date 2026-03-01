import { useState, useEffect } from 'react';
import { Plus, TrendingUp, Calendar as CalendarIcon, X, Trash2, Sparkles } from 'lucide-react';
import api from '../../services/api';

interface Habit {
    id: string;
    title: string;
    description: string;
    color: string;
    completed_today: boolean;
    created_at: string;
}

interface DailyStat {
    date: string;
    day: number;
    completed: number;
    total: number;
    percentage: number;
}

interface HabitStat {
    id: string;
    title: string;
    color: string;
    completed_days: number;
    total_days: number;
    percentage: number;
}

interface Stats {
    daily_stats: DailyStat[];
    habit_stats: HabitStat[];
    month: number;
    year: number;
}

export default function DailyTrackerPage() {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        color: '#3b82f6'
    });

    const colors = [
        '#3b82f6', // blue
        '#8b5cf6', // purple
        '#ec4899', // pink
        '#f59e0b', // amber
        '#10b981', // green
        '#ef4444', // red
        '#06b6d4', // cyan
    ];

    useEffect(() => {
        fetchHabits();
        fetchStats();
    }, []);

    const fetchHabits = async () => {
        try {
            const response = await api.get('/habits');
            setHabits(response.data.habits || []);
        } catch (error) {
            console.error('Failed to fetch habits:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await api.get('/habits/stats');
            setStats(response.data);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/habits', formData);
            fetchHabits();
            fetchStats();
            resetForm();
        } catch (error) {
            console.error('Failed to create habit:', error);
        }
    };

    const handleToggle = async (habitId: string) => {
        try {
            await api.post(`/habits/${habitId}/toggle`);
            fetchHabits();
            fetchStats();
        } catch (error) {
            console.error('Failed to toggle habit:', error);
        }
    };

    const handleDelete = async (habitId: string) => {
        if (!confirm('Are you sure you want to delete this habit?')) return;
        try {
            await api.delete(`/habits/${habitId}`);
            fetchHabits();
            fetchStats();
        } catch (error) {
            console.error('Failed to delete habit:', error);
        }
    };

    const resetForm = () => {
        setFormData({ title: '', description: '', color: '#3b82f6' });
        setShowForm(false);
    };

    const getMonthName = (month: number) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[month - 1];
    };

    return (
        <div className="relative p-6 max-w-7xl mx-auto min-h-screen overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/10 dark:to-blue-900/10"></div>
                <div className="absolute top-20 right-20 w-72 h-72 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-50 animate-blob"></div>
                <div className="absolute bottom-20 left-20 w-72 h-72 bg-blue-300 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-50 animate-blob animation-delay-2000"></div>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-6 animate-fade-in">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
                        Daily Tracker
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">Build consistent habits and track your progress</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Plus className="w-5 h-5 relative z-10 group-hover:rotate-90 transition-transform duration-300" />
                    <span className="relative z-10">Add Habit</span>
                </button>
            </div>

            {/* Add Habit Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-200/50 dark:border-gray-700/50 animate-scale-in">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">New Habit</h2>
                            <button onClick={resetForm} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all hover:rotate-90 duration-300">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="e.g., Drink 8 glasses of water"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (Optional)</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={2}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Why is this important?"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Color</label>
                                <div className="flex gap-2">
                                    {colors.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, color })}
                                            className={`w-10 h-10 rounded-full transition-all duration-300 hover:scale-110 ${formData.color === color ? 'ring-4 ring-offset-2 ring-gray-400 scale-125' : ''
                                                }`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={resetForm} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all hover:scale-105">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all hover:scale-105">
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Today's Habits */}
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 mb-6 animate-slide-up">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                        <CalendarIcon className="w-5 h-5 text-white" />
                    </div>
                    Today's Habits
                </h2>
                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="relative">
                            <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-900 rounded-full"></div>
                            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
                        </div>
                    </div>
                ) : habits.length === 0 ? (
                    <div className="text-center py-12">
                        <Sparkles className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">No habits yet. Create one to get started!</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {habits.map((habit, index) => (
                            <div
                                key={habit.id}
                                className="group flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 hover:shadow-md transition-all duration-300 hover:scale-[1.02] border border-gray-200/50 dark:border-gray-700/50 animate-slide-up"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <button
                                    onClick={() => handleToggle(habit.id)}
                                    className={`relative w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${habit.completed_today
                                        ? 'border-transparent scale-110 shadow-lg'
                                        : 'border-gray-300 dark:border-gray-600 hover:scale-110'
                                        }`}
                                    style={{
                                        backgroundColor: habit.completed_today ? habit.color : 'transparent'
                                    }}
                                >
                                    {habit.completed_today && (
                                        <>
                                            <svg className="w-5 h-5 text-white relative z-10 animate-scale-in" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <div className="absolute inset-0 rounded-full animate-ping" style={{ backgroundColor: habit.color, opacity: 0.3 }}></div>
                                        </>
                                    )}
                                </button>
                                <div className="flex-1">
                                    <h3 className={`font-medium text-gray-800 dark:text-gray-200 ${habit.completed_today ? 'line-through opacity-70' : ''}`}>
                                        {habit.title}
                                    </h3>
                                    {habit.description && (
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{habit.description}</p>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleDelete(habit.id)}
                                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
                                >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Statistics Section */}
            {stats && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Monthly Performance Graph */}
                    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 animate-slide-up" style={{ animationDelay: '100ms' }}>
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                            <div className="p-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-white" />
                            </div>
                            Monthly Performance - {getMonthName(stats.month)} {stats.year}
                        </h2>
                        <div className="h-64 flex items-end gap-1 px-2">
                            {stats.daily_stats.map((day, index) => (
                                <div key={day.date} className="flex-1 flex flex-col items-center gap-1 group">
                                    <div
                                        className="w-full bg-gradient-to-t from-blue-600 via-purple-600 to-pink-600 rounded-t-lg transition-all duration-300 hover:opacity-80 hover:scale-105 cursor-pointer shadow-lg animate-grow-up"
                                        style={{
                                            height: `${day.percentage}%`,
                                            animationDelay: `${index * 20}ms`
                                        }}
                                        title={`${day.date}: ${day.percentage}% (${day.completed}/${day.total})`}
                                    ></div>
                                    {day.day % 5 === 0 && (
                                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{day.day}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 text-center p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Average Completion: <span className="text-blue-600 dark:text-blue-400 text-lg">
                                    {Math.round(stats.daily_stats.reduce((acc, d) => acc + d.percentage, 0) / stats.daily_stats.length)}%
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Habit Statistics */}
                    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 animate-slide-up" style={{ animationDelay: '200ms' }}>
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Habit Statistics</h2>
                        <div className="space-y-5">
                            {stats.habit_stats.map((habit, index) => (
                                <div key={habit.id} className="animate-slide-up" style={{ animationDelay: `${300 + index * 100}ms` }}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{habit.title}</span>
                                        <span className="text-sm font-bold px-2 py-1 rounded-lg" style={{
                                            color: habit.color,
                                            backgroundColor: `${habit.color}20`
                                        }}>
                                            {habit.percentage}%
                                        </span>
                                    </div>
                                    <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                                        <div
                                            className="h-3 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                                            style={{
                                                width: `${habit.percentage}%`,
                                                backgroundColor: habit.color
                                            }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {habit.completed_days} of {habit.total_days} days completed
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Animations */}
            <style>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    25% { transform: translate(20px, -20px) scale(1.1); }
                    50% { transform: translate(-20px, 20px) scale(0.9); }
                    75% { transform: translate(20px, 20px) scale(1.05); }
                }
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes scale-in {
                    from { opacity: 0; transform: scale(0); }
                    to { opacity: 1; transform: scale(1); }
                }
                @keyframes grow-up {
                    from { height: 0; }
                }
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animate-fade-in {
                    animation: fade-in 0.6s ease-out;
                }
                .animate-slide-up {
                    animation: slide-up 0.6s ease-out backwards;
                }
                .animate-scale-in {
                    animation: scale-in 0.3s ease-out;
                }
                .animate-grow-up {
                    animation: grow-up 0.8s ease-out backwards;
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
            `}</style>
        </div>
    );
}
