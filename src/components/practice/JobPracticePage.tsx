import { useState, useEffect, useRef } from 'react';
import { Building2, Briefcase, Target, MessageSquare, ArrowRight, ArrowLeft, Play, Mic, MicOff, Volume2, VolumeX, Award, TrendingUp, CheckCircle2, AlertCircle, Clock, Sparkles, Radio, Zap, Star, Trophy } from 'lucide-react';
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

const COMPANIES = [
    { name: 'Google', gradient: 'from-blue-500 via-red-500 to-yellow-500', icon: '🔍' },
    { name: 'Amazon', gradient: 'from-orange-500 to-yellow-600', icon: '📦' },
    { name: 'Microsoft', gradient: 'from-blue-600 to-cyan-500', icon: '🪟' },
    { name: 'Apple', gradient: 'from-gray-700 to-gray-400', icon: '🍎' },
    { name: 'Meta', gradient: 'from-blue-600 to-purple-600', icon: '👥' },
    { name: 'Netflix', gradient: 'from-red-600 to-red-500', icon: '🎬' },
    { name: 'Tesla', gradient: 'from-red-500 to-gray-700', icon: '⚡' },
    { name: 'Spotify', gradient: 'from-green-500 to-green-400', icon: '🎵' }
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

    const [currentAnswer, setCurrentAnswer] = useState('');
    const [currentTranscript, setCurrentTranscript] = useState('');
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isInterviewActive, setIsInterviewActive] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const { isListening, isSpeaking, startListening, stopListening, speak, stopSpeaking } = useSpeech();

    useEffect(() => {
        if (step === 5 && session) {
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
                interview_type: interviewType
            });

            setSession(response.data.session);
            setStep(5);
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

                setStep(6);
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

    const getScoreBg = (score: number) => {
        if (score >= 80) return 'from-green-500 to-emerald-600';
        if (score >= 60) return 'from-yellow-500 to-orange-600';
        return 'from-red-500 to-pink-600';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 p-6">
            <div className="max-w-5xl mx-auto">
                {/* Animated Progress Bar */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-3">
                        {[1, 2, 3, 4, 5, 6].map((s) => (
                            <div key={s} className="relative flex-1 mx-1">
                                <div className={`h-3 rounded-full transition-all duration-500 ${step >= s
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/50'
                                        : 'bg-gray-200 dark:bg-gray-700'
                                    }`}>
                                    {step === s && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center justify-center gap-2">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Step {step} of 6
                        </p>
                        {voiceMode && <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-xs font-bold flex items-center gap-1">
                            <Radio className="w-3 h-3 animate-pulse" /> LIVE
                        </span>}
                    </div>
                </div>

                {/* Step 1: Company Selection */}
                {step === 1 && (
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
                        <div className="text-center mb-8">
                            <div className="inline-block p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4">
                                <Building2 className="w-12 h-12 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                Select Target Company
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">Choose a company to unlock its specific HR culture</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            {COMPANIES.map((comp) => (
                                <button
                                    key={comp.name}
                                    onClick={() => setCompany(comp.name)}
                                    className={`group relative p-6 rounded-xl border-2 transition-all duration-300 ${company === comp.name
                                            ? 'border-transparent shadow-2xl scale-105'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-400 hover:scale-105 hover:shadow-xl'
                                        }`}
                                >
                                    {company === comp.name && (
                                        <div className={`absolute inset-0 bg-gradient-to-r ${comp.gradient} opacity-10 rounded-xl`}></div>
                                    )}
                                    <div className="relative">
                                        <div className="text-4xl mb-2">{comp.icon}</div>
                                        <p className="font-bold text-gray-800 dark:text-gray-200">{comp.name}</p>
                                        {company === comp.name && (
                                            <CheckCircle2 className="w-5 h-5 text-green-500 absolute top-0 right-0" />
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="mb-6">
                            <button
                                onClick={() => setCompany('custom')}
                                className={`w-full p-4 rounded-xl border-2 transition-all ${company === 'custom'
                                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30'
                                        : 'border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400'
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
                                    className="mt-3 w-full px-4 py-3 border-2 border-blue-300 dark:border-blue-700 rounded-xl focus:ring-4 focus:ring-blue-500/20 transition-all"
                                />
                            )}
                        </div>

                        <button
                            onClick={() => setStep(2)}
                            disabled={!company || (company === 'custom' && !customCompany)}
                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-2xl hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-bold text-lg flex items-center justify-center gap-2 group"
                        >
                            Continue
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                )}

                {/* Step 2: Position & Level */}
                {step === 2 && (
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
                        <div className="text-center mb-8">
                            <div className="inline-block p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl mb-4">
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
                                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-lg"
                                    placeholder="e.g., Software Engineer"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Experience Level</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {['intern', 'fresher', 'experienced', 'managerial'].map((level) => (
                                        <button
                                            key={level}
                                            onClick={() => setExperienceLevel(level)}
                                            className={`py-3 px-4 rounded-xl capitalize font-medium transition-all ${experienceLevel === level
                                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                                                    : 'bg-gray-100 dark:bg-gray-700 hover:scale-105'
                                                }`}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => setStep(1)} className="flex-1 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-bold">
                                <ArrowLeft className="w-5 h-5 inline mr-2" /> Back
                            </button>
                            <button onClick={() => setStep(3)} className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-2xl transition-all font-bold">
                                Continue <ArrowRight className="w-5 h-5 inline ml-2" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Difficulty */}
                {step === 3 && (
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
                        <div className="text-center mb-8">
                            <div className="inline-block p-4 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl mb-4">
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
                            ].map((level) => (
                                <button
                                    key={level.id}
                                    onClick={() => setDifficulty(level.id)}
                                    className={`group relative p-6 rounded-2xl border-2 text-left transition-all duration-300 ${difficulty === level.id
                                            ? 'border-transparent shadow-2xl scale-105'
                                            : 'border-gray-200 dark:border-gray-700 hover:scale-105 hover:shadow-xl'
                                        }`}
                                >
                                    {difficulty === level.id && (
                                        <div className={`absolute inset-0 bg-gradient-to-r ${level.gradient} opacity-10 rounded-2xl`}></div>
                                    )}
                                    <div className="relative">
                                        <div className="text-5xl mb-3">{level.icon}</div>
                                        <h3 className="font-bold text-xl mb-2">{level.name}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{level.desc}</p>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => setStep(2)} className="flex-1 py-4 border-2 rounded-xl font-bold">Back</button>
                            <button onClick={() => setStep(4)} className="flex-1 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:shadow-2xl font-bold">Continue</button>
                        </div>
                    </div>
                )}

                {/* Step 4: Interview Type */}
                {step === 4 && (
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
                        <div className="text-center mb-8">
                            <div className="inline-block p-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl mb-4">
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
                            ].map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => setInterviewType(type.id)}
                                    className={`p-6 rounded-2xl border-2 transition-all ${interviewType === type.id
                                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 shadow-xl scale-105'
                                            : 'border-gray-200 dark:border-gray-700 hover:scale-105'
                                        }`}
                                >
                                    <div className="text-4xl mb-3">{type.icon}</div>
                                    <h3 className="font-bold text-lg mb-2">{type.name}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{type.desc}</p>
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => setStep(3)} className="flex-1 py-4 border-2 rounded-xl font-bold">Back</button>
                            <button
                                onClick={startInterview}
                                disabled={loading}
                                className="flex-1 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl hover:shadow-2xl font-bold flex items-center justify-center gap-2 group"
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

                {/* Step 5: Voice Interview */}
                {step === 5 && session && (
                    <div className="space-y-4">
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                                <div>
                                    <h3 className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        {company} Interview
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">{jobRole} • Question {session.current_question_index + 1}</p>
                                </div>
                                <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                                    <Clock className="w-6 h-6 text-blue-600" />
                                    <span className="font-mono text-2xl font-bold text-blue-600">{formatTime(timeElapsed)}</span>
                                </div>
                            </div>

                            {/* Voice Status - Large & Animated */}
                            <div className="mb-8 p-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-2xl text-center border-2 border-blue-200 dark:border-blue-800">
                                {isSpeaking && (
                                    <div className="flex flex-col items-center gap-4 animate-fade-in">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div>
                                            <Volume2 className="relative w-24 h-24 text-blue-600 animate-pulse" />
                                        </div>
                                        <p className="text-2xl font-bold">AI is speaking...</p>
                                        <p className="text-gray-600">Listen carefully to the question</p>
                                        <button
                                            onClick={stopSpeaking}
                                            className="mt-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-bold flex items-center gap-2"
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
                            <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-xl">
                                <p className="text-sm text-blue-100 mb-2 font-medium">Current Question:</p>
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

                            {/* End Button */}
                            <button
                                onClick={() => {
                                    setIsInterviewActive(false);
                                    stopListening();
                                    stopSpeaking();
                                    setStep(1);
                                }}
                                className="w-full py-4 border-2 border-red-600 text-red-600 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all font-bold"
                            >
                                End Interview
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 6: Performance Report */}
                {step === 6 && session?.performance_report && (
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
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
                            ].map((item) => (
                                <div key={item.label} className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-2xl shadow-lg hover:scale-105 transition-transform">
                                    <item.icon className="w-8 h-8 mx-auto mb-2 text-gray-600 dark:text-gray-400" />
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-medium">{item.label}</p>
                                    <p className={`text-3xl font-bold ${getScoreColor(item.score)}`}>{item.score}%</p>
                                </div>
                            ))}
                        </div>

                        {/* Feedback Sections */}
                        <div className="space-y-4 mb-8">
                            <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border-2 border-green-200 dark:border-green-800">
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

                            <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl border-2 border-yellow-200 dark:border-yellow-800">
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

                            <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border-2 border-blue-200 dark:border-blue-800">
                                <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-blue-800 dark:text-blue-200">
                                    <TrendingUp className="w-6 h-6" /> Improvement Plan
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{session.performance_report.improvement_plan}</p>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setStep(1);
                                setSession(null);
                                setCurrentAnswer('');
                                setCurrentTranscript('');
                                setCompany('');
                            }}
                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-2xl hover:shadow-blue-500/50 transition-all font-bold text-lg flex items-center justify-center gap-2 group"
                        >
                            <Play className="w-6 h-6" />
                            Start New Interview
                            <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
