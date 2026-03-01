import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    Sparkles,
    CheckSquare,
    FileText,
    Briefcase,
    MessageSquare,
    LogOut,
    Menu,
    X,
    Moon,
    Sun,
    Home,
    Target
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();

    const menuItems = [
        { icon: Sparkles, label: 'AI Assistant', path: '/dashboard/assistant' },
        { icon: Target, label: 'Daily Tracker', path: '/dashboard/tracker' },
        { icon: CheckSquare, label: 'Tasks', path: '/dashboard/tasks' },
        { icon: FileText, label: 'Notes', path: '/dashboard/notes' },
        { icon: Briefcase, label: 'Resumes', path: '/dashboard/resumes' },
        { icon: MessageSquare, label: 'Job Practice', path: '/dashboard/practice' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 flex relative overflow-hidden">
            {/* Animated background blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/5 rounded-full filter blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/10 dark:bg-purple-600/5 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Sidebar */}
            <aside
                className={`${isSidebarOpen ? 'w-64' : 'w-20'
                    } bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 transition-all duration-500 ease-in-out flex flex-col shadow-xl relative z-10`}
            >
                {/* Logo */}
                <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex items-center justify-between">
                        {isSidebarOpen && (
                            <div className="flex items-center gap-2 animate-fade-in">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg relative overflow-hidden group">
                                    <Sparkles className="w-5 h-5 text-white relative z-10" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                                <span className="font-bold text-gray-800 dark:text-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Assistant
                                </span>
                            </div>
                        )}
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 rounded-lg transition-all duration-300 hover:scale-110 group"
                        >
                            {isSidebarOpen ? (
                                <X className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:rotate-90 transition-transform duration-300" />
                            ) : (
                                <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:scale-110 transition-transform duration-300" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map((item, index) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 overflow-hidden ${isActive
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 hover:scale-105'
                                    }`}
                                title={!isSidebarOpen ? item.label : ''}
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {/* Glow effect for active item */}
                                {isActive && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 blur-md opacity-50 -z-10"></div>
                                )}

                                {/* Shine effect on hover */}
                                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                                <Icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:rotate-12'}`} />
                                {isSidebarOpen && (
                                    <span className="font-medium transition-all duration-300 group-hover:translate-x-1">
                                        {item.label}
                                    </span>
                                )}

                                {/* Active indicator */}
                                {isActive && isSidebarOpen && (
                                    <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Section */}
                <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 space-y-2">
                    <Link
                        to="/"
                        className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-green-500/10 hover:to-teal-500/10 transition-all duration-300 hover:scale-105 relative overflow-hidden"
                        title={!isSidebarOpen ? 'Portfolio' : ''}
                    >
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                        <Home className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                        {isSidebarOpen && <span className="font-medium">Portfolio</span>}
                    </Link>

                    <button
                        onClick={toggleTheme}
                        className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-yellow-500/10 hover:to-orange-500/10 transition-all duration-300 hover:scale-105 relative overflow-hidden"
                        title={!isSidebarOpen ? 'Toggle Theme' : ''}
                    >
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                        {isDark ? (
                            <Sun className="w-5 h-5 flex-shrink-0 group-hover:rotate-180 transition-transform duration-500" />
                        ) : (
                            <Moon className="w-5 h-5 flex-shrink-0 group-hover:-rotate-12 transition-transform duration-300" />
                        )}
                        {isSidebarOpen && <span className="font-medium">Theme</span>}
                    </button>

                    {isSidebarOpen && user && (
                        <div className="px-3 py-2 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl border border-gray-200/50 dark:border-gray-700/50 animate-fade-in">
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                                {user.name}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                {user.email}
                            </p>
                        </div>
                    )}

                    <button
                        onClick={handleLogout}
                        className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-gradient-to-r hover:from-red-500/10 hover:to-pink-500/10 transition-all duration-300 hover:scale-105 relative overflow-hidden"
                        title={!isSidebarOpen ? 'Logout' : ''}
                    >
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                        <LogOut className="w-5 h-5 flex-shrink-0 group-hover:translate-x-1 transition-transform duration-300" />
                        {isSidebarOpen && <span className="font-medium">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto relative z-0">
                {children}
            </main>

            {/* Add custom animations */}
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}
