import { useState, useEffect } from 'react';
import { Plus, Building2, Trash2, Edit2, X, Calendar, ExternalLink } from 'lucide-react';
import api from '../../services/api';

interface Application {
    id: string;
    company: string;
    job_role: string;
    application_url?: string;
    status: 'applied' | 'interview' | 'offer' | 'rejected';
    applied_date: string;
    notes?: string;
    created_at: string;
}

export default function ApplicationsPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingApp, setEditingApp] = useState<Application | null>(null);
    const [filter, setFilter] = useState<'all' | 'applied' | 'interview' | 'offer' | 'rejected'>('all');

    const [formData, setFormData] = useState({
        company: '',
        job_role: '',
        application_url: '',
        status: 'applied' as 'applied' | 'interview' | 'offer' | 'rejected',
        applied_date: new Date().toISOString().split('T')[0],
        notes: '',
    });

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const response = await api.get('/applications');
            setApplications(response.data.applications || []);
        } catch (error) {
            console.error('Failed to fetch applications:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingApp) {
                await api.put(`/applications/${editingApp.id}`, formData);
            } else {
                await api.post('/applications', formData);
            }
            fetchApplications();
            resetForm();
        } catch (error) {
            console.error('Failed to save application:', error);
        }
    };

    const handleDelete = async (appId: string) => {
        if (!confirm('Delete this application?')) return;
        try {
            await api.delete(`/applications/${appId}`);
            fetchApplications();
        } catch (error) {
            console.error('Failed to delete application:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            company: '',
            job_role: '',
            application_url: '',
            status: 'applied',
            applied_date: new Date().toISOString().split('T')[0],
            notes: '',
        });
        setShowForm(false);
        setEditingApp(null);
    };

    const startEdit = (app: Application) => {
        setEditingApp(app);
        setFormData({
            company: app.company,
            job_role: app.job_role,
            application_url: app.application_url || '',
            status: app.status,
            applied_date: app.applied_date ? app.applied_date.split('T')[0] : new Date().toISOString().split('T')[0],
            notes: app.notes || '',
        });
        setShowForm(true);
    };

    const filteredApplications = applications.filter(app =>
        filter === 'all' ? true : app.status === filter
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'applied': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'interview': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'offer': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'rejected': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const stats = {
        total: applications.length,
        applied: applications.filter(a => a.status === 'applied').length,
        interview: applications.filter(a => a.status === 'interview').length,
        offer: applications.filter(a => a.status === 'offer').length,
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Job Applications</h1>
                    <p className="text-gray-600 dark:text-gray-400">Track your job applications and interview progress</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Add Application
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{stats.total}</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-600 dark:text-blue-400">Applied</p>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.applied}</p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800">
                    <p className="text-sm text-yellow-600 dark:text-yellow-400">Interviews</p>
                    <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{stats.interview}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                    <p className="text-sm text-green-600 dark:text-green-400">Offers</p>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.offer}</p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6">
                {(['all', 'applied', 'interview', 'offer', 'rejected'] as const).map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${filter === status
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Application Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                                {editingApp ? 'Edit Application' : 'New Application'}
                            </h2>
                            <button onClick={resetForm} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company</label>
                                <input
                                    type="text"
                                    value={formData.company}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200"
                                    placeholder="Company name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Role</label>
                                <input
                                    type="text"
                                    value={formData.job_role}
                                    onChange={(e) => setFormData({ ...formData, job_role: e.target.value })}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200"
                                    placeholder="e.g., Frontend Developer"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Application URL (optional)</label>
                                <input
                                    type="url"
                                    value={formData.application_url}
                                    onChange={(e) => setFormData({ ...formData, application_url: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200"
                                    placeholder="https://..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200"
                                    >
                                        <option value="applied">Applied</option>
                                        <option value="interview">Interview</option>
                                        <option value="offer">Offer</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Applied Date</label>
                                    <input
                                        type="date"
                                        value={formData.applied_date}
                                        onChange={(e) => setFormData({ ...formData, applied_date: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200"
                                    placeholder="Interview details, contacts, etc."
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={resetForm} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                    {editingApp ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Applications List */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : filteredApplications.length === 0 ? (
                <div className="text-center py-12">
                    <Building2 className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400">No applications found</h3>
                    <p className="text-gray-500 dark:text-gray-500">Start tracking your job applications</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredApplications.map((app) => (
                        <div
                            key={app.id}
                            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Building2 className="w-5 h-5 text-gray-400" />
                                        <h3 className="font-semibold text-gray-800 dark:text-gray-200">{app.company}</h3>
                                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(app.status)}`}>
                                            {app.status}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 mb-2">{app.job_role}</p>
                                    {app.notes && (
                                        <p className="text-sm text-gray-500 dark:text-gray-500 mb-2">{app.notes}</p>
                                    )}
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            Applied: {new Date(app.applied_date).toLocaleDateString()}
                                        </span>
                                        {app.application_url && (
                                            <a
                                                href={app.application_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 text-blue-600 hover:underline"
                                            >
                                                <ExternalLink className="w-3 h-3" />
                                                View Posting
                                            </a>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <button onClick={() => startEdit(app)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                        <Edit2 className="w-4 h-4 text-gray-500" />
                                    </button>
                                    <button onClick={() => handleDelete(app.id)} className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg">
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
