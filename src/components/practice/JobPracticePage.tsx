import { useState, useEffect, useRef } from 'react';
import { Building2, Briefcase, Target, MessageSquare, ArrowRight, ArrowLeft, Play, Mic, MicOff, Volume2, VolumeX, TrendingUp, CheckCircle2, AlertCircle, Clock, Sparkles, Radio, Zap, Star, Trophy, FileText, Lightbulb, X, ChevronRight } from 'lucide-react';
import api from '../../services/api';
import { useSpeech } from '../../hooks/useSpeech';

interface InterviewSession {
    id: string;
    company: string;
    job_role: string;
    difficulty: string;
    interview_type: string;
    current_question_index: number;
    questions: Array<{
        question_text: string;
        user_answer: string;
        score: number;
        ai_feedback: string;
    }>;
    performance_report?: any;
}

// Company data with logo URLs - you can replace these with your actual logo paths
const COMPANIES = [
    {
        name: 'Google',
        gradient: 'from-blue-500 via-red-500 to-yellow-500',
        logo: '/src/assets/google.png', // Replace with your logo path
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        textColor: 'text-blue-600'
    },
    {
        name: 'Amazon',
        gradient: 'from-orange-500 to-yellow-600',
        logo: '/src/assets/amazon.png',
        bgColor: 'bg-orange-50 dark:bg-orange-900/20',
        textColor: 'text-orange-600'
    },
    {
        name: 'Microsoft',
        gradient: 'from-blue-600 to-cyan-500',
        logo: '/src/assets/microsoft.png',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        textColor: 'text-blue-600'
    },
    {
        name: 'Apple',
        gradient: 'from-gray-700 to-gray-400',
        logo: '/src/assets/apple.png',
        bgColor: 'bg-gray-50 dark:bg-gray-900/20',
        textColor: 'text-gray-700'
    },
    {
        name: 'Meta',
        gradient: 'from-blue-600 to-purple-600',
        logo: '/src/assets/meta.png',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        textColor: 'text-blue-600'
    },
    {
        name: 'Netflix',
        gradient: 'from-red-600 to-red-500',
        logo: '/src/assets/netflix.png',
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        textColor: 'text-red-600'
    },
    {
        name: 'Tesla',
        gradient: 'from-red-500 to-gray-700',
        logo: '/src/assets/tesla.png',
        bgColor: 'bg-gray-50 dark:bg-gray-900/20',
        textColor: 'text-gray-700'
    },
    {
        name: 'Spotify',
        gradient: 'from-green-500 to-green-400',
        logo: '/src/assets/spotify.png',
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        textColor: 'text-green-600'
    }
];

export default function InterviewPracticePage() {
    const [step, setStep] = useState(1);
    const [session, setSession] = useState<InterviewSession | null>(null);
    const [loading, setLoading] = useState(false);
    const [voiceMode, setVoiceMode] = useState(true);

    const [company, setCompany] = useState('');
    const [customCompany, setCustomCompany] = useState('');
    const [jobRole, setJobRole] = useState('Software Engineer');
    const [experienceLevel, setExperienceLevel] = useState('fresher');
    const [difficulty, setDifficulty] = useState('intermediate');
    const [interviewType, setInterviewType] = useState('hr');

    // Resume-based interview states
    const [resumes, setResumes] = useState<any[]>([]);
    const [selectedResume, setSelectedResume] = useState<any>(null);
    const [loadingResumes, setLoadingResumes] = useState(false);
    const [showGuidance, setShowGuidance] = useState(false);
    const [currentGuidance, setCurrentGuidance] = useState<any>(null);
    const [loadingHint, setLoadingHint] = useState(false);

    const [currentAnswer, setCurrentAnswer] = useState('');
    const [currentTranscript, setCurrentTranscript] = useState('');
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isInterviewActive, setIsInterviewActive] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const { isListening, isSpeaking, startListening, stopListening, speak, stopSpeaking } = useSpeech();

    // Fetch resumes when component mounts
    useEffect(() => {
        fetchResumes();
    }, []);

    const fetchResumes = async () => {
        setLoadingResumes(true);
        try {
            const response = await api.get('/resumes');
            setResumes(response.data.resumes || []);
        } catch (error) {
            console.error('Failed to fetch resumes:', error);
        } finally {
            setLoadingResumes(false);
        }
    };

    useEffect(() => {
        if (step === 6 && session) {  // Changed from 5 to 6
            timerRef.current = setInterval(() => setTimeElapsed(prev => prev + 1), 1000);
            return () => { if (timerRef.current) clearInterval(timerRef.current); };
        }
    }, [step, session]);

    useEffect(() => {
        if (voiceMode && isInterviewActive && !isSpeaking && !isListening && !isSubmitting) {
            const timeout = setTimeout(() => startListening(handleVoiceInput), 1500);
            return () => clearTimeout(timeout);
        }
    }, [voiceMode, isInterviewActive, isSpeaking, isListening, isSubmitting]);

    const startInterview = async () => {
        setLoading(true);
        try {
            const response = await api.post('/interview/start', {
                company: company === 'custom' ? customCompany : company,
                job_role: jobRole,
                difficulty,
                interview_type: interviewType,
                resume_id: selectedResume?._id  // Include resume if selected
            });

            setSession(response.data.session);
            setStep(6);  // Changed from 5 to 6 (added resume step)
            setTimeElapsed(0);
            setIsInterviewActive(true);

            if (voiceMode) {
                const question = response.data.question || response.data.session.questions[0]?.question_text;
                speak(`Welcome to your ${company} interview. Here's your first question: ${question}`);
            }
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to start interview');
        } finally {
            setLoading(false);
        }
    };

    const handleVoiceInput = (transcript: string) => {
        setCurrentTranscript(transcript);
        setCurrentAnswer(transcript);
        setTimeout(() => submitAnswer(transcript), 500);
    };

    const getHint = async () => {
        if (!session || loadingHint) return;

        setLoadingHint(true);
        try {
            const response = await api.post(`/interview/${session.id}/get-hint`, {
                answer: currentAnswer
            });
            setCurrentGuidance(response.data.guidance);
            setShowGuidance(true);

            // Auto-hide after 15 seconds
            setTimeout(() => setShowGuidance(false), 15000);
        } catch (error) {
            console.error('Failed to get hint:', error);
        } finally {
            setLoadingHint(false);
        }
    };

    const submitAnswer = async (answer?: string) => {
        const answerText = answer || currentAnswer;
        if (!session || !answerText.trim()) return;

        setIsSubmitting(true);
        stopListening();

        try {
            const response = await api.post(`/interview/${session.id}/answer`, {
                answer: answerText,
                time_taken: timeElapsed
            });

            if (response.data.is_complete) {
                const reportResponse = await api.post(`/interview/${session.id}/complete`);
                setSession({ ...session, performance_report: reportResponse.data.report });
                setIsInterviewActive(false);

                if (voiceMode) {
                    speak(`Interview complete! Your overall score is ${reportResponse.data.report.overall_score} percent. Great job!`);
                }

                setStep(7);  // Changed to 7 (performance report)
            } else {
                const nextQuestion = response.data.next_question;
                const updatedSession = { ...session };
                updatedSession.current_question_index += 1;
                setSession(updatedSession);

                if (voiceMode) {
                    const feedback = response.data.feedback?.feedback || 'Good answer.';
                    const score = response.data.feedback?.score || 0;
                    speak(`${feedback} Your score: ${score} out of 100. Next question: ${nextQuestion}`);
                }

                setCurrentAnswer('');
                setCurrentTranscript('');
                setTimeElapsed(0);
            }
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to submit answer');
            setIsInterviewActive(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600 dark:text-green-400';
        if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };



    return (
        <div className="relative min-h-screen p-6 overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-900/10 dark:to-purple-900/10"></div>
                <div className="absolute top-20 left-20 w-96 h-96 bg-indigo-300 dark:bg-indigo-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-300 dark:bg-pink-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            <div className="max-w-5xl mx-auto relative">
                {/* Animated Progress Bar */}
                <div className="mb-8 animate-fade-in">
                    <div className="flex items-center justify-between mb-3">
                        {[1, 2, 3, 4, 5, 6, 7].map((s) => (
                            <div key={s} className="relative flex-1 mx-1">
                                <div className={`h-3 rounded-full transition-all duration-500 ${step >= s
                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/50'
                                    : 'bg-gray-200 dark:bg-gray-700'
                                    }`}>
                                    {step === s && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-pulse"></div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center justify-center gap-2">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Step {step} of 7
                        </p>
                        {voiceMode && <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-xs font-bold flex items-center gap-1">
                            <Radio className="w-3 h-3 animate-pulse" /> LIVE
                        </span>}
                    </div>
                </div>

                {/* Step 1: Company Selection */}
                {step === 1 && (
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 animate-scale-in">
                        <div className="text-center mb-8">
                            <div className="inline-block p-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl mb-4 animate-float">
                                <Building2 className="w-12 h-12 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                Select Target Company
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">Choose a company to unlock its specific HR culture</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            {COMPANIES.map((comp, index) => (
                                <button
                                    key={comp.name}
                                    onClick={() => setCompany(comp.name)}
                                    className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 animate-slide-up ${company === comp.name
                                        ? `border-transparent shadow-2xl scale-105 ${comp.bgColor}`
                                        : 'border-gray-200 dark:border-gray-700 hover:border-indigo-400 hover:shadow-xl bg-white/50 dark:bg-gray-800/50'
                                        }`}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    {company === comp.name && (
                                        <div className={`absolute inset-0 bg-gradient-to-r ${comp.gradient} opacity-10 rounded-2xl`}></div>
                                    )}
                                    <div className="relative">
                                        {/* Logo Image */}
                                        <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center bg-white dark:bg-gray-800 rounded-xl p-2 shadow-md group-hover:scale-110 transition-transform duration-300">
                                            <img
                                                src={comp.logo}
                                                alt={`${comp.name} logo`}
                                                className="w-full h-full object-contain"
                                                onError={(e) => {
                                                    // Fallback to gradient background if image fails to load
                                                    e.currentTarget.style.display = 'none';
                                                    e.currentTarget.parentElement!.classList.add(`bg-gradient-to-r`, comp.gradient.split(' ')[0], comp.gradient.split(' ')[1]);
                                                }}
                                            />
                                        </div>
                                        <p className={`font-bold ${company === comp.name ? comp.textColor : 'text-gray-800 dark:text-gray-200'}`}>
                                            {comp.name}
                                        </p>
                                        {company === comp.name && (
                                            <CheckCircle2 className="w-6 h-6 text-green-500 absolute -top-2 -right-2 animate-scale-in" />
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="mb-6">
                            <button
                                onClick={() => setCompany('custom')}
                                className={`w-full p-4 rounded-xl border-2 transition-all hover:scale-[1.02] ${company === 'custom'
                                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 shadow-lg'
                                    : 'border-dashed border-gray-300 dark:border-gray-600 hover:border-indigo-400 bg-white/50 dark:bg-gray-800/50'
                                    }`}
                            >
                                <Sparkles className="w-5 h-5 inline mr-2" />
                                Add Custom Company
                            </button>
                            {company === 'custom' && (
                                <input
                                    type="text"
                                    value={customCompany}
                                    onChange={(e) => setCustomCompany(e.target.value)}
                                    placeholder="Enter company name"
                                    className="mt-3 w-full px-4 py-3 border-2 border-indigo-300 dark:border-indigo-700 rounded-xl focus:ring-4 focus:ring-indigo-500/20 transition-all bg-white dark:bg-gray-900 animate-scale-in"
                                />
                            )}
                        </div>

                        <button
                            onClick={() => setStep(2)}
                            disabled={!company || (company === 'custom' && !customCompany)}
                            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-2xl hover:shadow-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-bold text-lg flex items-center justify-center gap-2 group"
                        >
                            Continue
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                )}

                {/* Step 2: Resume Selection (NEW) */}
                {step === 2 && (
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 animate-scale-in">
                        <div className="text-center mb-8">
                            <div className="inline-block p-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl mb-4 animate-float">
                                <FileText className="w-12 h-12 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                Select Your Resume (Optional)
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                Get personalized questions based on your resume content
                            </p>
                        </div>

                        {loadingResumes ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                                <p className="mt-4 text-gray-600 dark:text-gray-400">Loading resumes...</p>
                            </div>
                        ) : resumes.length > 0 ? (
                            <div className="space-y-4 mb-6">
                                {resumes.map((resume, index) => (
                                    <div
                                        key={resume._id}
                                        onClick={() => setSelectedResume(selectedResume?._id === resume._id ? null : resume)}
                                        className={`p-6 rounded-xl border-2 cursor-pointer transition-all hover:scale-[1.02] animate-slide-up ${selectedResume?._id === resume._id
                                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 shadow-lg'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-400 bg-white/50 dark:bg-gray-800/50'
                                            }`}
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <FileText className={`w-5 h-5 ${selectedResume?._id === resume._id ? 'text-blue-600' : 'text-gray-600'
                                                        }`} />
                                                    <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">
                                                        {resume.job_role || 'Resume'}
                                                    </h3>
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                    {resume.filename}
                                                </p>
                                                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                                                    <span>Uploaded: {new Date(resume.created_at).toLocaleDateString()}</span>
                                                    {resume.ai_score && (
                                                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full font-bold">
                                                            AI Score: {resume.ai_score.overall}/100
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            {selectedResume?._id === resume._id && (
                                                <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/50 rounded-xl mb-6">
                                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600 dark:text-gray-400 mb-2">No resumes uploaded yet</p>
                                <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">Upload a resume in the Resumes section to get started</p>
                                <a
                                    href="/resumes"
                                    className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all"
                                >
                                    Go to Resumes Page
                                </a>
                            </div>
                        )}

                        {/* Voice Mode Toggle */}
                        <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-700">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${voiceMode ? 'bg-red-500' : 'bg-gray-400'}`}>
                                        {voiceMode ? <Mic className="w-5 h-5 text-white" /> : <MicOff className="w-5 h-5 text-white" />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 dark:text-gray-200">Voice Interview Mode</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {voiceMode ? 'Voice mode enabled - Speak your answers' : 'Voice mode disabled - Type your answers'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setVoiceMode(!voiceMode)}
                                    className={`px-6 py-2 rounded-xl font-bold transition-all ${voiceMode
                                        ? 'bg-red-500 hover:bg-red-600 text-white'
                                        : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                                        }`}
                                >
                                    {voiceMode ? 'Disable' : 'Enable'}
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setStep(1)}
                                className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all font-medium flex items-center gap-2"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Back
                            </button>
                            <button
                                onClick={() => {
                                    setSelectedResume(null);
                                    setStep(3);
                                }}
                                className="flex-1 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all font-medium"
                            >
                                Skip (Practice without resume)
                            </button>
                            <button
                                onClick={() => setStep(3)}
                                disabled={!selectedResume}
                                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-2xl hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold flex items-center justify-center gap-2 group"
                            >
                                Continue with Resume
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Position & Level (was Step 2) */}
                {step === 3 && (
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 animate-scale-in">
                        <div className="text-center mb-8">
                            <div className="inline-block p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl mb-4 animate-float">
                                <Briefcase className="w-12 h-12 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Position & Level
                            </h2>
                        </div>

                        <div className="space-y-6 mb-8">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Job Role</label>
                                <input
                                    type="text"
                                    value={jobRole}
                                    onChange={(e) => setJobRole(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-lg bg-white dark:bg-gray-900"
                                    placeholder="e.g., Software Engineer"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Experience Level</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {['intern', 'fresher', 'experienced', 'managerial'].map((level, index) => (
                                        <button
                                            key={level}
                                            onClick={() => setExperienceLevel(level)}
                                            className={`py-3 px-4 rounded-xl capitalize font-medium transition-all hover:scale-105 animate-slide-up ${experienceLevel === level
                                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                                                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                }`}
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => setStep(1)} className="flex-1 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-bold hover:scale-105">
                                <ArrowLeft className="w-5 h-5 inline mr-2" /> Back
                            </button>
                            <button onClick={() => setStep(4)} className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-2xl transition-all font-bold hover:scale-105">
                                Continue <ArrowRight className="w-5 h-5 inline ml-2" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 4: Difficulty (was Step 3) */}
                {step === 4 && (
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 animate-scale-in">
                        <div className="text-center mb-8">
                            <div className="inline-block p-4 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl mb-4 animate-float">
                                <Zap className="w-12 h-12 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                                Interview Intensity
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">Choose your challenge level</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {[
                                { id: 'beginner', name: 'Beginner', desc: 'Common HR questions, gentle pacing', icon: '🌱', gradient: 'from-green-500 to-emerald-600' },
                                { id: 'intermediate', name: 'Intermediate', desc: 'Situational & cultural fit rounds', icon: '⚡', gradient: 'from-yellow-500 to-orange-600' },
                                { id: 'advanced', name: 'Advanced', desc: 'High pressure, deep behavioral', icon: '🔥', gradient: 'from-red-500 to-pink-600' }
                            ].map((level, index) => (
                                <button
                                    key={level.id}
                                    onClick={() => setDifficulty(level.id)}
                                    className={`group relative p-6 rounded-2xl border-2 text-left transition-all duration-300 hover:scale-105 animate-slide-up ${difficulty === level.id
                                        ? 'border-transparent shadow-2xl scale-105'
                                        : 'border-gray-200 dark:border-gray-700 hover:shadow-xl bg-white/50 dark:bg-gray-800/50'
                                        }`}
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    {difficulty === level.id && (
                                        <div className={`absolute inset-0 bg-gradient-to-r ${level.gradient} opacity-10 rounded-2xl`}></div>
                                    )}
                                    <div className="relative">
                                        <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">{level.icon}</div>
                                        <h3 className="font-bold text-xl mb-2">{level.name}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{level.desc}</p>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => setStep(3)} className="flex-1 py-4 border-2 rounded-xl font-bold hover:scale-105 transition-all">Back</button>
                            <button onClick={() => setStep(5)} className="flex-1 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:shadow-2xl font-bold hover:scale-105 transition-all">Continue</button>
                        </div>
                    </div>
                )}

                {/* Step 5: Interview Type (was Step 4) */}
                {step === 5 && (
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 animate-scale-in">
                        <div className="text-center mb-8">
                            <div className="inline-block p-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl mb-4 animate-float">
                                <MessageSquare className="w-12 h-12 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                                Select Interview Round
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {[
                                { id: 'personal', name: 'Personal Interview', desc: 'Personality, culture fit, motivation', icon: '👤' },
                                { id: 'hr', name: 'HR Interview', desc: 'Behavioral & situational questions', icon: '💼' },
                                { id: 'technical', name: 'Technical Interview', desc: 'Role-specific knowledge', icon: '💻' }
                            ].map((type, index) => (
                                <button
                                    key={type.id}
                                    onClick={() => setInterviewType(type.id)}
                                    className={`p-6 rounded-2xl border-2 transition-all hover:scale-105 animate-slide-up ${interviewType === type.id
                                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 shadow-xl scale-105'
                                        : 'border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50'
                                        }`}
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="text-4xl mb-3">{type.icon}</div>
                                    <h3 className="font-bold text-lg mb-2">{type.name}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{type.desc}</p>
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => setStep(4)} className="flex-1 py-4 border-2 rounded-xl font-bold hover:scale-105 transition-all">Back</button>
                            <button
                                onClick={startInterview}
                                disabled={loading}
                                className="flex-1 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl hover:shadow-2xl font-bold flex items-center justify-center gap-2 group hover:scale-105 transition-all"
                            >
                                {loading ? 'Starting...' : (
                                    <>
                                        <Radio className="w-5 h-5 animate-pulse" />
                                        Start Voice Interview
                                        <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 5: Voice Interview - keeping original implementation */}
                {step === 5 && session && (
                    <div className="space-y-4">
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 animate-fade-in">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                                <div>
                                    <h3 className="font-bold text-2xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                        {company} Interview
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">{jobRole} • Question {session.current_question_index + 1}</p>
                                </div>
                                <div className="flex items-center gap-3 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl">
                                    <Clock className="w-6 h-6 text-indigo-600" />
                                    <span className="font-mono text-2xl font-bold text-indigo-600">{formatTime(timeElapsed)}</span>
                                </div>
                            </div>

                            {/* Voice Status - Large & Animated */}
                            <div className="mb-8 p-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-2xl text-center border-2 border-indigo-200 dark:border-indigo-800">
                                {isSpeaking && (
                                    <div className="flex flex-col items-center gap-4 animate-fade-in">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-indigo-500 rounded-full animate-ping opacity-75"></div>
                                            <Volume2 className="relative w-24 h-24 text-indigo-600 animate-pulse" />
                                        </div>
                                        <p className="text-2xl font-bold">AI is speaking...</p>
                                        <p className="text-gray-600">Listen carefully to the question</p>
                                        <button
                                            onClick={stopSpeaking}
                                            className="mt-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-bold flex items-center gap-2 hover:scale-105 transition-all"
                                        >
                                            <VolumeX className="w-5 h-5" /> Stop
                                        </button>
                                    </div>
                                )}

                                {isListening && !isSpeaking && (
                                    <div className="flex flex-col items-center gap-4 animate-fade-in">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
                                            <Mic className="relative w-24 h-24 text-red-600 animate-pulse" />
                                        </div>
                                        <p className="text-2xl font-bold">Listening...</p>
                                        <p className="text-gray-600">Speak your answer clearly</p>
                                        <div className="flex gap-2 mt-2">
                                            {[...Array(5)].map((_, i) => (
                                                <div key={i} className="w-2 h-8 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}></div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {isSubmitting && (
                                    <div className="flex flex-col items-center gap-4 animate-fade-in">
                                        <Sparkles className="w-24 h-24 text-purple-600 animate-spin" />
                                        <p className="text-2xl font-bold">Analyzing your answer...</p>
                                        <p className="text-gray-600">AI is evaluating your response</p>
                                    </div>
                                )}

                                {!isSpeaking && !isListening && !isSubmitting && (
                                    <div className="flex flex-col items-center gap-4 animate-fade-in">
                                        <MicOff className="w-24 h-24 text-gray-400" />
                                        <p className="text-2xl font-bold">Preparing...</p>
                                    </div>
                                )}
                            </div>

                            {/* Question Display */}
                            <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl mb-6 shadow-xl">
                                <p className="text-sm text-indigo-100 mb-2 font-medium">Current Question:</p>
                                <p className="text-xl font-bold text-white leading-relaxed">
                                    {session.questions[session.current_question_index]?.question_text}
                                </p>
                            </div>

                            {/* Transcript */}
                            {currentTranscript && (
                                <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-2xl mb-6 border-2 border-green-300 dark:border-green-700 animate-fade-in">
                                    <div className="flex items-center gap-2 mb-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                                        <p className="text-sm font-bold text-green-800 dark:text-green-200">Your Answer (Transcript):</p>
                                    </div>
                                    <p className="text-gray-800 dark:text-gray-200">{currentTranscript}</p>
                                </div>
                            )}

                            {/* Ask for Help Button - Show if resume selected */}
                            {selectedResume && !showGuidance && !isSubmitting && (
                                <button
                                    onClick={getHint}
                                    disabled={loadingHint}
                                    className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:scale-105 mb-4 animate-fade-in"
                                >
                                    <Lightbulb className="w-5 h-5" />
                                    {loadingHint ? 'Getting hints...' : '💡 Ask for Help'}
                                </button>
                            )}

                            {/* End Button */}
                            <button
                                onClick={() => {
                                    setIsInterviewActive(false);
                                    stopListening();
                                    stopSpeaking();
                                    setStep(1);
                                }}
                                className="w-full py-4 border-2 border-red-600 text-red-600 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all font-bold hover:scale-105"
                            >
                                End Interview
                            </button>
                        </div>

                        {/* Guidance Panel - Floating panel with hints */}
                        {selectedResume && showGuidance && currentGuidance && (
                            <div className="fixed bottom-6 right-6 max-w-md bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border-2 border-yellow-500 animate-scale-in z-50">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Lightbulb className="w-6 h-6 text-yellow-500 animate-pulse" />
                                        <h3 className="font-bold text-lg">💡 Resume Hints</h3>
                                    </div>
                                    <button
                                        onClick={() => setShowGuidance(false)}
                                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {currentGuidance.hints && currentGuidance.hints.length > 0 && (
                                    <div className="space-y-2 mb-4">
                                        <p className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-2">💬 Suggestions:</p>
                                        {currentGuidance.hints.map((hint: string, i: number) => (
                                            <div key={i} className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
                                                <span className="text-yellow-600 dark:text-yellow-400 text-sm">{hint}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {currentGuidance.relevantPoints && currentGuidance.relevantPoints.length > 0 && (
                                    <div>
                                        <p className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-2">📋 From Your Resume:</p>
                                        <div className="space-y-1">
                                            {currentGuidance.relevantPoints.map((point: string, i: number) => (
                                                <div key={i} className="text-xs text-gray-600 dark:text-gray-400 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-700">
                                                    • {point}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Step 6: Performance Report - keeping original implementation */}
                {step === 6 && session?.performance_report && (
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 animate-scale-in">
                        <div className="text-center mb-8">
                            <div className="inline-block p-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-4 animate-bounce">
                                <Trophy className="w-16 h-16 text-white" />
                            </div>
                            <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-2">
                                Interview Complete!
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 text-lg">Here's your performance report</p>
                        </div>

                        {/* Score Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                            {[
                                { label: 'Overall', score: session.performance_report.overall_score, icon: Star },
                                { label: 'Communication', score: session.performance_report.communication_score, icon: MessageSquare },
                                { label: 'Content', score: session.performance_report.content_score, icon: Target },
                                { label: 'Confidence', score: session.performance_report.confidence_score, icon: Zap },
                                { label: 'Culture Fit', score: session.performance_report.culture_fit_score, icon: CheckCircle2 }
                            ].map((item, index) => (
                                <div key={item.label} className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-2xl shadow-lg hover:scale-105 transition-transform animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                                    <item.icon className="w-8 h-8 mx-auto mb-2 text-gray-600 dark:text-gray-400" />
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-medium">{item.label}</p>
                                    <p className={`text-3xl font-bold ${getScoreColor(item.score)}`}>{item.score}%</p>
                                </div>
                            ))}
                        </div>

                        {/* Feedback Sections */}
                        <div className="space-y-4 mb-8">
                            <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border-2 border-green-200 dark:border-green-800 animate-slide-up" style={{ animationDelay: '100ms' }}>
                                <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-green-800 dark:text-green-200">
                                    <CheckCircle2 className="w-6 h-6" /> Strengths
                                </h3>
                                <ul className="space-y-2">
                                    {session.performance_report.strengths.map((s: string, i: number) => (
                                        <li key={i} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                                            <span className="text-green-600 font-bold">✓</span>
                                            <span>{s}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl border-2 border-yellow-200 dark:border-yellow-800 animate-slide-up" style={{ animationDelay: '200ms' }}>
                                <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                                    <AlertCircle className="w-6 h-6" /> Areas for Improvement
                                </h3>
                                <ul className="space-y-2">
                                    {session.performance_report.weaknesses.map((w: string, i: number) => (
                                        <li key={i} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                                            <span className="text-yellow-600 font-bold">→</span>
                                            <span>{w}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border-2 border-blue-200 dark:border-blue-800 animate-slide-up" style={{ animationDelay: '300ms' }}>
                                <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-blue-800 dark:text-blue-200">
                                    <TrendingUp className="w-6 h-6" /> Improvement Plan
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{session.performance_report.improvement_plan}</p>
                            </div>
                        </div>

                        {/* Resume Insights - Show if resume was used */}
                        {(session as any).resume_analysis && session.performance_report?.resumeInsights && (
                            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 animate-slide-up mt-6" style={{ animationDelay: '400ms' }}>
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <FileText className="w-6 h-6 text-blue-600" />
                                    Resume Alignment Analysis
                                </h3>

                                {/* Alignment Score */}
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium">Resume Alignment Score</span>
                                        <span className="text-2xl font-bold text-blue-600">
                                            {session.performance_report.resume_alignment_score || 0}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                        <div
                                            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-1000"
                                            style={{ width: `${session.performance_report.resume_alignment_score || 0}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Mentioned vs Missed */}
                                <div className="grid md:grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <h4 className="font-bold text-green-600 dark:text-green-400 mb-2 flex items-center gap-2">
                                            <CheckCircle2 className="w-5 h-5" />
                                            Mentioned ({session.performance_report.resumeInsights.mentionedSkills?.length || 0})
                                        </h4>
                                        <div className="space-y-1">
                                            {session.performance_report.resumeInsights.mentionedSkills?.map((skill: string, i: number) => (
                                                <div key={i} className="px-3 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg text-sm">
                                                    ✓ {skill}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
                                            <AlertCircle className="w-5 h-5" />
                                            Missed Opportunities ({session.performance_report.resumeInsights.missedSkills?.length || 0})
                                        </h4>
                                        <div className="space-y-1">
                                            {session.performance_report.resumeInsights.missedSkills?.map((skill: string, i: number) => (
                                                <div key={i} className="px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm">
                                                    ✗ {skill}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Improvement Suggestions */}
                                {session.performance_report.resumeInsights.improvementSuggestions?.length > 0 && (
                                    <div>
                                        <h4 className="font-bold mb-3 flex items-center gap-2">
                                            <TrendingUp className="w-5 h-5 text-purple-600" />
                                            📈 Improvement Roadmap
                                        </h4>
                                        <div className="space-y-2">
                                            {session.performance_report.resumeInsights.improvementSuggestions.map((suggestion: any, i: number) => (
                                                <div key={i} className={`p-4 rounded-lg border-l-4 ${suggestion.priority === 'high' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                                                    suggestion.priority === 'medium' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                                                        'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                    }`}>
                                                    <div className="flex items-start gap-2">
                                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${suggestion.priority === 'high' ? 'bg-red-200 dark:bg-red-800 text-red-700 dark:text-red-300' :
                                                            suggestion.priority === 'medium' ? 'bg-yellow-200 dark:bg-yellow-800 text-yellow-700 dark:text-yellow-300' :
                                                                'bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-300'
                                                            }`}>
                                                            {suggestion.priority.toUpperCase()}
                                                        </span>
                                                        <div className="flex-1">
                                                            <p className="font-medium text-sm">{suggestion.category}</p>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{suggestion.suggestion}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <button
                            onClick={() => {
                                setStep(1);
                                setSession(null);
                                setCurrentAnswer('');
                                setCurrentTranscript('');
                                setCompany('');
                            }}
                            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-2xl hover:shadow-indigo-500/50 transition-all font-bold text-lg flex items-center justify-center gap-2 group hover:scale-105"
                        >
                            <Play className="w-6 h-6" />
                            Start New Interview
                            <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                        </button>
                    </div>
                )}
            </div>

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
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
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
                    animation: scale-in 0.4s ease-out;
                }
            `}</style>
        </div>
    );
}
