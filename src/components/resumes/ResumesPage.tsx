import { useState, useEffect, useRef } from 'react';
import { Plus, FileText, Trash2, X, Sparkles, Upload, Download, RefreshCw, Award, TrendingUp, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';

interface AIScore {
    overall: number;
    ats_score: number;
    keyword_score: number;
    structure_score: number;
    content_score: number;
    feedback: string;
    scored_at: string;
}

interface Resume {
    id: string;
    job_role: string;
    summary: string;
    skills: string[];
    filename?: string;
    file_size?: number;
    file_type?: string;
    ai_score?: AIScore;
    created_at: string;
}

export default function ResumesPage() {
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [scoring, setScoring] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [uploadData, setUploadData] = useState({
        file: null as File | null,
        job_role: '',
    });

    useEffect(() => {
        fetchResumes();
    }, []);

    const fetchResumes = async () => {
        try {
            const response = await api.get('/resumes');
            setResumes(response.data.resumes || []);
        } catch (error) {
            console.error('Failed to fetch resumes:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
            if (!validTypes.includes(file.type)) {
                alert('Please upload a PDF or DOCX file');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB');
                return;
            }
            setUploadData({ ...uploadData, file });
        }
    };

    const handleUpload = async () => {
        if (!uploadData.file || !uploadData.job_role) {
            alert('Please select a file and enter a job role');
            return;
        }

        setUploading(true);
        setUploadProgress(0);

        try {
            const formData = new FormData();
            formData.append('file', uploadData.file);
            formData.append('job_role', uploadData.job_role);

            const response = await api.post('/resumes/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    const progress = progressEvent.total
                        ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
                        : 0;
                    setUploadProgress(progress);
                },
            });

            fetchResumes();
            setShowUploadModal(false);
            setUploadData({ file: null, job_role: '' });

            if (response.data.resume) {
                setSelectedResume(response.data.resume);
            }
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to upload resume');
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const handleDownload = async (resumeId: string, filename: string) => {
        try {
            const response = await api.get(`/resumes/${resumeId}/download`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            alert('Failed to download resume');
        }
    };

    const handleRescore = async (resumeId: string) => {
        setScoring(true);
        try {
            const response = await api.post(`/resumes/${resumeId}/score`);
            setResumes(resumes.map(r =>
                r.id === resumeId ? { ...r, ai_score: response.data.score } : r
            ));
            if (selectedResume?.id === resumeId) {
                setSelectedResume({ ...selectedResume, ai_score: response.data.score });
            }
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to score resume');
        } finally {
            setScoring(false);
        }
    };

    const handleDelete = async (resumeId: string) => {
        if (!confirm('Delete this resume?')) return;
        try {
            await api.delete(`/resumes/${resumeId}`);
            if (selectedResume?.id === resumeId) setSelectedResume(null);
            fetchResumes();
        } catch (error) {
            console.error('Failed to delete resume:', error);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 76) return 'from-green-500 to-emerald-500';
        if (score >= 51) return 'from-yellow-500 to-orange-500';
        return 'from-red-500 to-pink-500';
    };

    const getScoreBg = (score: number) => {
        if (score >= 76) return 'bg-green-100 dark:bg-green-900/30';
        if (score >= 51) return 'bg-yellow-100 dark:bg-yellow-900/30';
        return 'bg-red-100 dark:bg-red-900/30';
    };

    return (
        <div className="h-full flex relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-green-900/10 dark:to-blue-900/10"></div>
                <div className="absolute top-20 right-20 w-72 h-72 bg-green-300 dark:bg-green-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-40 animate-blob"></div>
                <div className="absolute bottom-20 left-20 w-72 h-72 bg-blue-300 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-40 animate-blob animation-delay-2000"></div>
            </div>

            {/* Resume List */}
            <div className="w-80 border-r border-gray-200/50 dark:border-gray-700/50 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl flex flex-col shadow-lg">
                <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-lg font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Resumes</h2>
                        <button
                            onClick={() => setShowUploadModal(true)}
                            className="group p-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all hover:scale-110 relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <Upload className="w-5 h-5 relative z-10 group-hover:-translate-y-1 transition-transform duration-300" />
                        </button>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Upload & score your resumes</p>
                </div>

                <div className="flex-1 overflow-y-auto p-3">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="relative">
                                <div className="w-10 h-10 border-4 border-green-200 dark:border-green-900 rounded-full"></div>
                                <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
                            </div>
                        </div>
                    ) : resumes.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                            <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p className="text-sm mb-2">No resumes yet</p>
                            <button
                                onClick={() => setShowUploadModal(true)}
                                className="text-blue-600 hover:underline text-sm"
                            >
                                Upload your first resume
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {resumes.map((resume, index) => (
                                <div
                                    key={resume.id}
                                    onClick={() => setSelectedResume(resume)}
                                    className={`group p-3 rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] animate-slide-up ${selectedResume?.id === resume.id
                                        ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg scale-[1.02]'
                                        : 'bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm hover:shadow-md'
                                        } border border-gray-200/50 dark:border-gray-600/50`}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <FileText className={`w-4 h-4 ${selectedResume?.id === resume.id ? 'text-white' : 'text-blue-600'}`} />
                                        <h3 className={`font-medium text-sm ${selectedResume?.id === resume.id ? 'text-white' : 'text-gray-800 dark:text-gray-200'}`}>
                                            {resume.job_role}
                                        </h3>
                                    </div>
                                    {resume.filename && (
                                        <p className={`text-xs mb-1 truncate ${selectedResume?.id === resume.id ? 'text-white/90' : 'text-gray-500 dark:text-gray-400'}`}>
                                            📄 {resume.filename}
                                        </p>
                                    )}
                                    {resume.ai_score && (
                                        <div className="flex items-center gap-2">
                                            <Award className={`w-4 h-4 ${selectedResume?.id === resume.id ? 'text-white' : 'text-green-600'}`} />
                                            <span className={`text-sm font-bold ${selectedResume?.id === resume.id ? 'text-white' : 'text-green-600 dark:text-green-400'}`}>
                                                {resume.ai_score.overall}%
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Resume Details */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {selectedResume ? (
                    <>
                        <div className="p-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 flex items-center justify-between animate-fade-in">
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">{selectedResume.job_role}</h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Created: {new Date(selectedResume.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className="flex gap-2">
                                {selectedResume.filename && (
                                    <>
                                        <button
                                            onClick={() => handleDownload(selectedResume.id, selectedResume.filename!)}
                                            className="group flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all hover:scale-105"
                                        >
                                            <Download className="w-4 h-4 group-hover:translate-y-1 transition-transform duration-300" />
                                            Download
                                        </button>
                                        <button
                                            onClick={() => handleRescore(selectedResume.id)}
                                            disabled={scoring}
                                            className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 transition-all hover:scale-105"
                                        >
                                            <RefreshCw className={`w-4 h-4 ${scoring ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-500`} />
                                            Re-score
                                        </button>
                                    </>
                                )}
                                <button onClick={() => handleDelete(selectedResume.id)} className="group p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all hover:scale-110">
                                    <Trash2 className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform duration-300" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm">
                            {/* AI Score Card */}
                            {selectedResume.ai_score && (
                                <div className="mb-6 animate-scale-in">
                                    <div className={`p-6 rounded-2xl border-2 ${getScoreBg(selectedResume.ai_score.overall)} border-gray-200/50 dark:border-gray-700/50 shadow-lg backdrop-blur-sm`}>
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                                <div className={`p-2 bg-gradient-to-r ${getScoreColor(selectedResume.ai_score.overall)} rounded-lg`}>
                                                    <Award className="w-6 h-6 text-white" />
                                                </div>
                                                AI Resume Score
                                            </h2>
                                            <div className={`text-5xl font-bold bg-gradient-to-r ${getScoreColor(selectedResume.ai_score.overall)} bg-clip-text text-transparent animate-pulse`}>
                                                {selectedResume.ai_score.overall}%
                                            </div>
                                        </div>

                                        {/* Score Breakdown */}
                                        <div className="grid grid-cols-2 gap-3 mb-4">
                                            <ScoreItem label="ATS Compatibility" score={selectedResume.ai_score.ats_score} />
                                            <ScoreItem label="Keywords" score={selectedResume.ai_score.keyword_score} />
                                            <ScoreItem label="Structure" score={selectedResume.ai_score.structure_score} />
                                            <ScoreItem label="Content Quality" score={selectedResume.ai_score.content_score} />
                                        </div>

                                        {/* Feedback */}
                                        <div className="mt-4 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                                            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
                                                <Sparkles className="w-4 h-4 text-purple-600" />
                                                AI Feedback
                                            </h3>
                                            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                                                {selectedResume.ai_score.feedback}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* File Info */}
                            {selectedResume.filename && (
                                <div className="mb-6 p-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg animate-slide-up" style={{ animationDelay: '100ms' }}>
                                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-blue-600" />
                                        File Information
                                    </h3>
                                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                        <p className="flex items-center gap-2">
                                            <span className="font-medium">📄 Filename:</span>
                                            <span className="text-gray-800 dark:text-gray-200">{selectedResume.filename}</span>
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <span className="font-medium">📏 Size:</span>
                                            <span className="text-gray-800 dark:text-gray-200">{((selectedResume.file_size || 0) / 1024).toFixed(2)} KB</span>
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <span className="font-medium">📝 Type:</span>
                                            <span className="text-gray-800 dark:text-gray-200">{selectedResume.file_type?.toUpperCase()}</span>
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm">
                        <div className="text-center animate-fade-in">
                            <Sparkles className="w-20 h-20 mx-auto mb-4 opacity-30 animate-float" />
                            <p className="text-lg">Select a resume or upload a new one</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-200/50 dark:border-gray-700/50 animate-scale-in">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Upload Resume</h2>
                            <button onClick={() => setShowUploadModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all hover:rotate-90 duration-300">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Target Job Role
                                </label>
                                <input
                                    type="text"
                                    value={uploadData.job_role}
                                    onChange={(e) => setUploadData({ ...uploadData, job_role: e.target.value })}
                                    placeholder="e.g., Frontend Developer"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Resume File (PDF or DOCX, max 5MB)
                                </label>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf,.docx,.doc"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="group w-full px-4 py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:scale-[1.02] bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20"
                                >
                                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400 group-hover:text-blue-500 group-hover:-translate-y-1 transition-all duration-300" />
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {uploadData.file ? uploadData.file.name : 'Click to select file'}
                                    </p>
                                </button>
                            </div>

                            {uploading && (
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-green-600 to-blue-600 h-3 rounded-full transition-all duration-300 relative overflow-hidden"
                                        style={{ width: `${uploadProgress}%` }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setShowUploadModal(false)}
                                    disabled={uploading}
                                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all hover:scale-105"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpload}
                                    disabled={!uploadData.file || !uploadData.job_role || uploading}
                                    className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 transition-all hover:scale-105"
                                >
                                    {uploading ? 'Uploading...' : 'Upload & Score'}
                                </button>
                            </div>
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
                    animation: scale-in 0.3s ease-out;
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
            `}</style>
        </div>
    );
}

function ScoreItem({ label, score }: { label: string; score: number }) {
    const getColor = (s: number) => {
        if (s >= 76) return 'from-green-500 to-emerald-500';
        if (s >= 51) return 'from-yellow-500 to-orange-500';
        return 'from-red-500 to-pink-500';
    };

    return (
        <div className="group p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 hover:scale-105 transition-all duration-300">
            <span className="text-xs text-gray-600 dark:text-gray-400 block mb-1">{label}</span>
            <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                        className={`bg-gradient-to-r ${getColor(score)} h-2 rounded-full transition-all duration-1000`}
                        style={{ width: `${score}%` }}
                    ></div>
                </div>
                <span className={`text-sm font-bold bg-gradient-to-r ${getColor(score)} bg-clip-text text-transparent`}>{score}%</span>
            </div>
        </div>
    );
}
