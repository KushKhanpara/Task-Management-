import React, { useMemo } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Users, CheckSquare, Menu, X, Folder, FileText, LogOut, User as UserIcon, CreditCard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
    const { user, logout } = useAuth();

    // Map icon names to components
    const iconMap = {
        'layout-dashboard': LayoutDashboard,
        'users': Users,
        'check-square': CheckSquare,
        'folder': Folder,
        'file-text': FileText,
        'user': UserIcon,
        'credit-card': CreditCard
    };

    const navItems = [
        { label: 'Dashboard', path: '/admin', iconName: 'layout-dashboard', roles: ['admin'] },
        { label: 'Manage Users', path: '/admin/users', iconName: 'users', roles: ['admin'] },
        { label: 'Manage Projects', path: '/admin/projects', iconName: 'folder', roles: ['admin'] },
        { label: 'Manage Tasks', path: '/admin/tasks', iconName: 'check-square', roles: ['admin'] },
        { label: 'Daily Logs', path: '/daily-logs', iconName: 'file-text', roles: ['admin', 'employee'] },
        { label: 'My Tasks', path: '/dashboard', iconName: 'check-square', roles: ['employee'] },
        { label: 'Profile', path: '/profile', iconName: 'user', roles: ['admin', 'employee'] }
    ];

    const currentNavItems = useMemo(() => {
        if (!user) return [];
        const userRole = user.role?.toLowerCase();
        return navItems.filter(item => item.roles.includes(userRole));
    }, [user]);

    return (
        <aside
            className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-800 border-r border-slate-700 transition-all duration-300 flex flex-col relative z-20`}
        >
            <div className="p-4 flex items-center justify-between border-b border-slate-700 h-16">
                {isSidebarOpen ? (
                    <div className="flex items-center gap-2">
                        <img src="/logo.png" alt="TaskFlow" className="h-8 w-8 object-contain" />
                        <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-purple-500 bg-clip-text text-transparent">TaskFlow</span>
                    </div>
                ) : (
                    <img src="/logo.png" alt="TaskFlow" className="h-8 w-8 object-contain mx-auto" />
                )}
                <button
                    onClick={toggleSidebar}
                    className="p-2 hover:bg-slate-700 rounded-lg text-slate-400"
                >
                    {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {currentNavItems.map((item) => {
                    const Icon = iconMap[item.iconName] || Folder;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/admin' || item.path === '/dashboard'}
                            className={({ isActive }) => `
                                flex items-center gap-3 p-3 rounded-xl transition-all 
                                ${isActive
                                    ? 'bg-primary-500/10 text-primary-500 border border-primary-500/20'
                                    : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'}
                            `}
                        >
                            <Icon size={20} />
                            {isSidebarOpen && <span>{item.label}</span>}
                        </NavLink>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-700 mt-auto">
                {isSidebarOpen && user && (
                    <Link to="/profile" className="block hover:opacity-90 transition-opacity">
                        <div className="bg-slate-700/50 rounded-xl p-4 mb-4 border border-slate-600/50">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm overflow-hidden border border-slate-500 shadow-sm">
                                    {user.image ? (
                                        <img src={user.image} loading="lazy" alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <span>{(user.fullName || user.username || 'U').charAt(0)}</span>
                                    )}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-white text-sm font-semibold truncate">{user.fullName}</p>
                                    <p className="text-xs text-slate-400 truncate capitalize">{user.role}</p>
                                </div>
                            </div>
                            <div className="space-y-1 text-xs text-slate-400">
                                <div className="flex justify-between">
                                    <span>Dept:</span>
                                    <span className="text-slate-200">{user.department || '-'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Joined:</span>
                                    <span className="text-slate-200">{user.joiningDate ? new Date(user.joiningDate).toLocaleDateString() : '-'}</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                )}

                <button
                    onClick={logout}
                    className="flex items-center gap-3 p-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
                >
                    <LogOut size={20} />
                    {isSidebarOpen && <span>Logout</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
