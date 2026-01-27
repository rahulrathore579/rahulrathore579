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
            // Validate file type
            const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
            if (!validTypes.includes(file.type)) {
                alert('Please upload a PDF or DOCX file');
                return;
            }

            // Validate file size (5MB)
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

            // Select the newly uploaded resume
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

            // Update the resume in the list
            setResumes(resumes.map(r =>
                r.id === resumeId ? { ...r, ai_score: response.data.score } : r
            ));

            // Update selected resume if it's the one being scored
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
        if (score >= 76) return 'text-green-600 dark:text-green-400';
        if (score >= 51) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    const getScoreBgColor = (score: number) => {
        if (score >= 76) return 'bg-green-100 dark:bg-green-900/30';
        if (score >= 51) return 'bg-yellow-100 dark:bg-yellow-900/30';
        return 'bg-red-100 dark:bg-red-900/30';
    };

    return (
        <div className="h-full flex bg-gray-50 dark:bg-gray-900">
            {/* Resume List */}
            <div className="w-80 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Resumes</h2>
                        <button
                            onClick={() => setShowUploadModal(true)}
                            className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg"
                        >
                            <Upload className="w-5 h-5" />
                        </button>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Upload & score your resumes</p>
                </div>

                <div className="flex-1 overflow-y-auto p-3">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : resumes.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>No resumes yet</p>
                            <button
                                onClick={() => setShowUploadModal(true)}
                                className="mt-2 text-blue-600 hover:underline text-sm"
                            >
                                Upload your first resume
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {resumes.map((resume) => (
                                <div
                                    key={resume.id}
                                    onClick={() => setSelectedResume(resume)}
                                    className={`p-3 rounded-lg cursor-pointer transition-all ${selectedResume?.id === resume.id
                                            ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-300'
                                            : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                                        } border border-gray-200 dark:border-gray-600`}
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <FileText className="w-4 h-4 text-blue-600" />
                                        <h3 className="font-medium text-gray-800 dark:text-gray-200 text-sm">{resume.job_role}</h3>
                                    </div>
                                    {resume.filename && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 truncate">
                                            📄 {resume.filename}
                                        </p>
                                    )}
                                    {resume.ai_score && (
                                        <div className="flex items-center gap-2">
                                            <Award className={`w-4 h-4 ${getScoreColor(resume.ai_score.overall)}`} />
                                            <span className={`text-sm font-bold ${getScoreColor(resume.ai_score.overall)}`}>
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
                        <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <div>
                                <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">{selectedResume.job_role}</h1>
                                <p className="text-sm text-gray-500">Created: {new Date(selectedResume.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className="flex gap-2">
                                {selectedResume.filename && (
                                    <>
                                        <button
                                            onClick={() => handleDownload(selectedResume.id, selectedResume.filename!)}
                                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                                        >
                                            <Download className="w-4 h-4" />
                                            Download
                                        </button>
                                        <button
                                            onClick={() => handleRescore(selectedResume.id)}
                                            disabled={scoring}
                                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                                        >
                                            <RefreshCw className={`w-4 h-4 ${scoring ? 'animate-spin' : ''}`} />
                                            Re-score
                                        </button>
                                    </>
                                )}
                                <button onClick={() => handleDelete(selectedResume.id)} className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg">
                                    <Trash2 className="w-5 h-5 text-red-500" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            {/* AI Score Card */}
                            {selectedResume.ai_score && (
                                <div className="mb-6">
                                    <div className={`p-6 rounded-xl border-2 ${getScoreBgColor(selectedResume.ai_score.overall)} border-current`}>
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                                <Award className="w-6 h-6" />
                                                AI Resume Score
                                            </h2>
                                            <div className={`text-4xl font-bold ${getScoreColor(selectedResume.ai_score.overall)}`}>
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
                                        <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
                                            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
                                                <Sparkles className="w-4 h-4 text-purple-600" />
                                                AI Feedback
                                            </h3>
                                            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                                {selectedResume.ai_score.feedback}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* File Info */}
                            {selectedResume.filename && (
                                <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">File Information</h3>
                                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                        <p>📄 <strong>Filename:</strong> {selectedResume.filename}</p>
                                        <p>📏 <strong>Size:</strong> {((selectedResume.file_size || 0) / 1024).toFixed(2)} KB</p>
                                        <p>📝 <strong>Type:</strong> {selectedResume.file_type?.toUpperCase()}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
                        <div className="text-center">
                            <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
                            <p>Select a resume or upload a new one</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Upload Resume</h2>
                            <button onClick={() => setShowUploadModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
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
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200"
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
                                    className="w-full px-4 py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                                >
                                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {uploadData.file ? uploadData.file.name : 'Click to select file'}
                                    </p>
                                </button>
                            </div>

                            {uploading && (
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full transition-all"
                                        style={{ width: `${uploadProgress}%` }}
                                    ></div>
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setShowUploadModal(false)}
                                    disabled={uploading}
                                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpload}
                                    disabled={!uploadData.file || !uploadData.job_role || uploading}
                                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50"
                                >
                                    {uploading ? 'Uploading...' : 'Upload & Score'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function ScoreItem({ label, score }: { label: string; score: number }) {
    const getColor = (s: number) => {
        if (s >= 76) return 'text-green-600 dark:text-green-400';
        if (s >= 51) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    return (
        <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded-lg">
            <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
            <span className={`text-sm font-bold ${getColor(score)}`}>{score}%</span>
        </div>
    );
}
