import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { Sparkles, CheckSquare, FileText, Briefcase, MessageSquare, Clipboard } from 'lucide-react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import TasksPage from '../components/tasks/TasksPage';
import NotesPage from '../components/notes/NotesPage';
import AssistantPage from '../components/assistant/AssistantPage';
import ResumesPage from '../components/resumes/ResumesPage';
import JobPracticePage from '../components/practice/JobPracticePage';
import ApplicationsPage from '../components/applications/ApplicationsPage';

export default function Dashboard() {
    return (
        <DashboardLayout>
            <Routes>
                <Route path="/" element={<DashboardHome />} />
                <Route path="/assistant" element={<AssistantPage />} />
                <Route path="/tasks" element={<TasksPage />} />
                <Route path="/notes" element={<NotesPage />} />
                <Route path="/resumes" element={<ResumesPage />} />
                <Route path="/practice" element={<JobPracticePage />} />
                <Route path="/applications" element={<ApplicationsPage />} />
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
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                    Welcome to Your Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Your AI-powered personal assistant for career growth
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                        <Link
                            key={index}
                            to={feature.link}
                            className="block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                        >
                            <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-300`}>
                                <Icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                {feature.description}
                            </p>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
