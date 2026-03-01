import { useState, useEffect } from 'react';
import { Plus, FileText, Trash2, Edit2, X, Tag, Search, Sparkles } from 'lucide-react';
import api from '../../services/api';

interface Note {
    id: string;
    title: string;
    content: string;
    tags: string[];
    created_at: string;
    updated_at: string;
}

export default function NotesPage() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingNote, setEditingNote] = useState<Note | null>(null);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tags: '',
    });

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const response = await api.get('/notes');
            setNotes(response.data.notes || []);
        } catch (error) {
            console.error('Failed to fetch notes:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
            };
            if (editingNote) {
                await api.put(`/notes/${editingNote.id}`, payload);
            } else {
                await api.post('/notes', payload);
            }
            fetchNotes();
            resetForm();
        } catch (error) {
            console.error('Failed to save note:', error);
        }
    };

    const handleDelete = async (noteId: string) => {
        if (!confirm('Delete this note?')) return;
        try {
            await api.delete(`/notes/${noteId}`);
            if (selectedNote?.id === noteId) setSelectedNote(null);
            fetchNotes();
        } catch (error) {
            console.error('Failed to delete note:', error);
        }
    };

    const resetForm = () => {
        setFormData({ title: '', content: '', tags: '' });
        setShowForm(false);
        setEditingNote(null);
    };

    const startEdit = (note: Note) => {
        setEditingNote(note);
        setFormData({
            title: note.title,
            content: note.content,
            tags: note.tags.join(', '),
        });
        setShowForm(true);
    };

    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="h-full flex relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/10 dark:to-blue-900/10"></div>
                <div className="absolute top-20 left-20 w-72 h-72 bg-blue-300 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-40 animate-blob"></div>
                <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-40 animate-blob animation-delay-2000"></div>
            </div>

            {/* Notes List Sidebar */}
            <div className="w-80 border-r border-gray-200/50 dark:border-gray-700/50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl flex flex-col shadow-lg">
                <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Notes</h2>
                        <button
                            onClick={() => setShowForm(true)}
                            className="group p-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all hover:scale-110 relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <Plus className="w-5 h-5 relative z-10 group-hover:rotate-90 transition-transform duration-300" />
                        </button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search notes..."
                            className="w-full pl-9 pr-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-300/50 dark:border-gray-600/50 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="relative">
                                <div className="w-10 h-10 border-4 border-blue-200 dark:border-blue-900 rounded-full"></div>
                                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
                            </div>
                        </div>
                    ) : filteredNotes.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                            <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No notes yet</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredNotes.map((note, index) => (
                                <div
                                    key={note.id}
                                    onClick={() => setSelectedNote(note)}
                                    className={`group p-3 rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] animate-slide-up ${selectedNote?.id === note.id
                                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-[1.02]'
                                        : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-md'
                                        } border border-gray-200/50 dark:border-gray-700/50`}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <h3 className={`font-medium truncate ${selectedNote?.id === note.id ? 'text-white' : 'text-gray-800 dark:text-gray-200'}`}>
                                        {note.title}
                                    </h3>
                                    <p className={`text-sm line-clamp-2 mt-1 ${selectedNote?.id === note.id ? 'text-white/90' : 'text-gray-500 dark:text-gray-400'}`}>
                                        {note.content}
                                    </p>
                                    {note.tags.length > 0 && (
                                        <div className="flex gap-1 mt-2 flex-wrap">
                                            {note.tags.slice(0, 3).map((tag, i) => (
                                                <span key={i} className={`px-2 py-0.5 text-xs rounded-full ${selectedNote?.id === note.id
                                                    ? 'bg-white/20 text-white'
                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                                                    }`}>
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Note Content */}
            <div className="flex-1 flex flex-col">
                {selectedNote ? (
                    <>
                        <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl flex items-center justify-between animate-fade-in">
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{selectedNote.title}</h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Last updated: {new Date(selectedNote.updated_at).toLocaleString()}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => startEdit(selectedNote)} className="group p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-all hover:scale-110">
                                    <Edit2 className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:rotate-12 transition-transform duration-300" />
                                </button>
                                <button onClick={() => handleDelete(selectedNote.id)} className="group p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all hover:scale-110">
                                    <Trash2 className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform duration-300" />
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 p-6 overflow-y-auto bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm animate-fade-in">
                            {selectedNote.tags.length > 0 && (
                                <div className="flex gap-2 mb-6 flex-wrap">
                                    {selectedNote.tags.map((tag, i) => (
                                        <span key={i} className="group inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm shadow-md hover:shadow-lg transition-all hover:scale-105 animate-scale-in" style={{ animationDelay: `${i * 100}ms` }}>
                                            <Tag className="w-3 h-3 group-hover:rotate-12 transition-transform duration-300" />
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                            <div className="prose dark:prose-invert max-w-none">
                                <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                                    <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">{selectedNote.content}</p>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm">
                        <div className="text-center animate-fade-in">
                            <Sparkles className="w-20 h-20 mx-auto mb-4 opacity-30 animate-float" />
                            <p className="text-lg">Select a note to view or create a new one</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Note Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200/50 dark:border-gray-700/50 animate-scale-in">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                {editingNote ? 'Edit Note' : 'New Note'}
                            </h2>
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
                                    placeholder="Note title"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content</label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    required
                                    rows={10}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Write your note..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags (comma-separated)</label>
                                <input
                                    type="text"
                                    value={formData.tags}
                                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="work, ideas, important"
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={resetForm} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all hover:scale-105">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all hover:scale-105">
                                    {editingNote ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
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
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
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
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
                .animate-fade-in {
                    animation: fade-in 0.6s ease-out;
                }
                .animate-slide-up {
                    animation: slide-up 0.6s ease-out backwards;
                }
                .animate-scale-in {
                    animation: scale-in 0.3s ease-out backwards;
                }
            `}</style>
        </div>
    );
}
