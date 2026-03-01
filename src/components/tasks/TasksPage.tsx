import { useState, useEffect } from 'react';
import { Plus, CheckSquare, Clock, AlertCircle, Trash2, Edit2, X, Calendar, List, MapPin } from 'lucide-react';
import api from '../../services/api';
import CalendarView from './CalendarView';

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
    created_at: string;
}

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
    const [selectedDate, setSelectedDate] = useState<string>('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'medium' as 'low' | 'medium' | 'high',
        due_date: '',
        is_appointment: false,
        start_time: '',
        end_time: '',
        location: ''
    });

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await api.get('/tasks');
            setTasks(response.data.tasks || []);
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = { ...formData };

            // Convert date/time strings to ISO format
            if (payload.start_time) {
                payload.start_time = new Date(payload.start_time).toISOString();
            }
            if (payload.end_time) {
                payload.end_time = new Date(payload.end_time).toISOString();
            }
            if (payload.due_date && !payload.is_appointment) {
                payload.due_date = new Date(payload.due_date).toISOString();
            }

            if (editingTask) {
                await api.put(`/tasks/${editingTask.id}`, payload);
            } else {
                await api.post('/tasks', payload);
            }
            fetchTasks();
            resetForm();
        } catch (error) {
            console.error('Failed to save task:', error);
        }
    };

    const handleStatusChange = async (taskId: string, status: string) => {
        try {
            await api.patch(`/tasks/${taskId}/status`, { status });
            fetchTasks();
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const handleDelete = async (taskId: string) => {
        if (!confirm('Are you sure you want to delete this task?')) return;
        try {
            await api.delete(`/tasks/${taskId}`);
            fetchTasks();
        } catch (error) {
            console.error('Failed to delete task:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            priority: 'medium',
            due_date: '',
            is_appointment: false,
            start_time: '',
            end_time: '',
            location: ''
        });
        setShowForm(false);
        setEditingTask(null);
        setSelectedDate('');
    };

    const startEdit = (task: Task) => {
        setEditingTask(task);
        setFormData({
            title: task.title,
            description: task.description || '',
            priority: task.priority,
            due_date: task.due_date ? task.due_date.split('T')[0] : '',
            is_appointment: task.is_appointment || false,
            start_time: task.start_time ? task.start_time.slice(0, 16) : '',
            end_time: task.end_time ? task.end_time.slice(0, 16) : '',
            location: task.location || ''
        });
        setShowForm(true);
    };

    const handleDateClick = (date: string) => {
        setSelectedDate(date);
        setFormData({
            ...formData,
            is_appointment: true,
            start_time: `${date}T09:00`,
            end_time: `${date}T10:00`
        });
        setShowForm(true);
    };

    const handleTaskClick = (task: Task) => {
        startEdit(task);
    };

    const filteredTasks = tasks.filter(task =>
        filter === 'all' ? true : task.status === filter
    );

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'low': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <CheckSquare className="w-5 h-5 text-green-500" />;
            case 'in_progress': return <Clock className="w-5 h-5 text-yellow-500" />;
            default: return <AlertCircle className="w-5 h-5 text-gray-400" />;
        }
    };

    const formatDateTime = (datetime: string) => {
        const date = new Date(datetime);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Tasks & Appointments</h1>
                    <p className="text-gray-600 dark:text-gray-400">Manage your tasks and schedule appointments</p>
                </div>
                <div className="flex items-center gap-2">
                    {/* View Toggle */}
                    <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${viewMode === 'list'
                                    ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400'
                                }`}
                        >
                            <List className="w-4 h-4" />
                            List
                        </button>
                        <button
                            onClick={() => setViewMode('calendar')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${viewMode === 'calendar'
                                    ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400'
                                }`}
                        >
                            <Calendar className="w-4 h-4" />
                            Calendar
                        </button>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        {viewMode === 'calendar' ? 'Add Appointment' : 'Add Task'}
                    </button>
                </div>
            </div>

            {/* Task Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                                {editingTask ? 'Edit Task' : 'New Task'}
                            </h2>
                            <button onClick={resetForm} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Appointment Toggle */}
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="is_appointment"
                                    checked={formData.is_appointment}
                                    onChange={(e) => setFormData({ ...formData, is_appointment: e.target.checked })}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <label htmlFor="is_appointment" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    This is an appointment
                                </label>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
                                    placeholder={formData.is_appointment ? "e.g., Doctor Appointment" : "e.g., Complete project report"}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
                                    placeholder="Add details..."
                                />
                            </div>

                            {formData.is_appointment ? (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Time</label>
                                            <input
                                                type="datetime-local"
                                                value={formData.start_time}
                                                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Time</label>
                                            <input
                                                type="datetime-local"
                                                value={formData.end_time}
                                                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
                                            placeholder="e.g., Conference Room A"
                                        />
                                    </div>
                                </>
                            ) : (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
                                    <input
                                        type="date"
                                        value={formData.due_date}
                                        onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
                                <select
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={resetForm} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                    {editingTask ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Content */}
            {viewMode === 'calendar' ? (
                <CalendarView
                    tasks={tasks}
                    onDateClick={handleDateClick}
                    onTaskClick={handleTaskClick}
                />
            ) : (
                <>
                    {/* Filter Tabs */}
                    <div className="flex gap-2 mb-6">
                        {(['all', 'pending', 'in_progress', 'completed'] as const).map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${filter === status
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    }`}
                            >
                                {status.replace('_', ' ')}
                            </button>
                        ))}
                    </div>

                    {/* Tasks List */}
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : filteredTasks.length === 0 ? (
                        <div className="text-center py-12">
                            <CheckSquare className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                            <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400">No tasks found</h3>
                            <p className="text-gray-500 dark:text-gray-500">Create a new task to get started</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredTasks.map((task) => (
                                <div
                                    key={task.id}
                                    className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all ${task.status === 'completed' ? 'opacity-70' : ''
                                        }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <button
                                            onClick={() => handleStatusChange(task.id, task.status === 'completed' ? 'pending' : 'completed')}
                                            className="mt-1"
                                        >
                                            {getStatusIcon(task.status)}
                                        </button>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                {task.is_appointment && <Clock className="w-4 h-4 text-blue-500" />}
                                                <h3 className={`font-medium text-gray-800 dark:text-gray-200 ${task.status === 'completed' ? 'line-through' : ''}`}>
                                                    {task.title}
                                                </h3>
                                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                                                    {task.priority}
                                                </span>
                                            </div>
                                            {task.description && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{task.description}</p>
                                            )}
                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                {task.is_appointment && task.start_time && (
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {formatDateTime(task.start_time)}
                                                        {task.end_time && ` - ${new Date(task.end_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`}
                                                    </span>
                                                )}
                                                {task.location && (
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" />
                                                        {task.location}
                                                    </span>
                                                )}
                                                {!task.is_appointment && task.due_date && (
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(task.due_date).toLocaleDateString()}
                                                    </span>
                                                )}
                                                <select
                                                    value={task.status}
                                                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                                    className="bg-transparent border-none text-xs cursor-pointer focus:ring-0"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="in_progress">In Progress</option>
                                                    <option value="completed">Completed</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            <button onClick={() => startEdit(task)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                                <Edit2 className="w-4 h-4 text-gray-500" />
                                            </button>
                                            <button onClick={() => handleDelete(task.id)} className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg">
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
