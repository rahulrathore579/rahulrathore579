import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { Sparkles, CheckSquare, FileText, Briefcase, MessageSquare, Clipboard, Target } from 'lucide-react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import TasksPage from '../components/tasks/TasksPage';
import NotesPage from '../components/notes/NotesPage';
import AssistantPage from '../components/assistant/AssistantPage';
import ResumesPage from '../components/resumes/ResumesPage';
import JobPracticePage from '../components/practice/JobPracticePage';
import ApplicationsPage from '../components/applications/ApplicationsPage';
import DailyTrackerPage from '../components/tracker/DailyTrackerPage';

export default function Dashboard() {
    console.log('Dashboard: Rendering sub-routes...');
    return (
        <DashboardLayout>
            <Routes>
                <Route index element={<DashboardHome />} />
                <Route path="assistant" element={<AssistantPage />} />
                <Route path="tasks" element={<TasksPage />} />
                <Route path="tracker" element={<DailyTrackerPage />} />
                <Route path="notes" element={<NotesPage />} />
                <Route path="resumes" element={<ResumesPage />} />
                <Route path="practice" element={<JobPracticePage />} />
                <Route path="applications" element={<ApplicationsPage />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </DashboardLayout>
    );
}


function DashboardHome() {
    const features = [
        {
            icon: Sparkles,
            title: 'AI Assistant',
            description: 'Get personalized help with tasks, resumes, and interview prep',
            color: 'from-purple-500 to-pink-500',
            link: '/dashboard/assistant'
        },
        {
            icon: Target,
            title: 'Daily Tracker',
            description: 'Build consistent habits and track your daily progress',
            color: 'from-emerald-500 to-teal-500',
            link: '/dashboard/tracker'
        },
        {
            icon: CheckSquare,
            title: 'Tasks',
            description: 'Manage your daily tasks and track progress',
            color: 'from-blue-500 to-cyan-500',
            link: '/dashboard/tasks'
        },
        {
            icon: FileText,
            title: 'Notes',
            description: 'Keep track of important information and ideas',
            color: 'from-green-500 to-teal-500',
            link: '/dashboard/notes'
        },
        {
            icon: Briefcase,
            title: 'Resumes',
            description: 'Create and manage multiple resumes for different roles',
            color: 'from-orange-500 to-red-500',
            link: '/dashboard/resumes'
        },
        {
            icon: MessageSquare,
            title: 'Job Practice',
            description: 'Practice interviews and improve communication skills',
            color: 'from-indigo-500 to-purple-500',
            link: '/dashboard/practice'
        },
        {
            icon: Clipboard,
            title: 'Applications',
            description: 'Track your job applications and interview progress',
            color: 'from-pink-500 to-rose-500',
            link: '/dashboard/applications'
        }
    ];

    return (
        <div className="relative p-8 min-h-screen overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20"></div>
                <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 dark:bg-yellow-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 dark:bg-pink-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            {/* Header with fade-in animation */}
            <div className="mb-8 animate-fade-in">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 animate-gradient">
                    Welcome to Your Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Your AI-powered personal assistant for career growth
                </p>
            </div>

            {/* Feature Cards with staggered animation */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                        <Link
                            key={index}
                            to={feature.link}
                            className="group relative block p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-200/50 dark:border-gray-700/50 overflow-hidden animate-slide-up"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Gradient border on hover */}
                            <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl p-[2px] -z-10">
                                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} blur-sm`}></div>
                            </div>

                            {/* Shine effect on hover */}
                            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                            {/* Icon with floating animation */}
                            <div className={`relative w-14 h-14 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg animate-float`}
                                style={{ animationDelay: `${index * 150}ms` }}>
                                <Icon className="w-7 h-7 text-white" />
                                {/* Glow effect */}
                                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-xl blur-md opacity-0 group-hover:opacity-75 transition-opacity duration-500`}></div>
                            </div>

                            {/* Content */}
                            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text transition-all duration-300"
                                style={{ backgroundImage: `linear-gradient(to right, ${feature.color.split(' ')[1]}, ${feature.color.split(' ')[3]})` }}>
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                {feature.description}
                            </p>

                            {/* Arrow indicator */}
                            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Add custom CSS for animations */}
            <style>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    25% { transform: translate(20px, -50px) scale(1.1); }
                    50% { transform: translate(-20px, 20px) scale(0.9); }
                    75% { transform: translate(50px, 50px) scale(1.05); }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                @keyframes gradient {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
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
                .animate-gradient {
                    background-size: 200% 200%;
                    animation: gradient 3s ease infinite;
                }
                .animate-fade-in {
                    animation: fade-in 0.8s ease-out;
                }
                .animate-slide-up {
                    animation: slide-up 0.6s ease-out backwards;
                }
            `}</style>
        </div>
    );
}
