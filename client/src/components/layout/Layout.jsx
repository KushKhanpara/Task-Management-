import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header'; // Ensure Header.jsx is created

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();

    const getPageTitle = (pathname) => {
        if (pathname.includes('/admin/users')) return 'Manage Users';
        if (pathname.includes('/admin/projects')) return 'Manage Projects';
        if (pathname.includes('/admin/tasks')) return 'Manage Tasks';
        if (pathname === '/admin') return 'Dashboard';
        if (pathname === '/dashboard') return 'My Tasks';
        if (pathname === '/daily-logs') return 'Daily Logs';
        return 'Dashboard';
    };

    return (
        <div className="flex h-screen bg-slate-900 overflow-hidden">
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            />

            <main className="flex-1 overflow-auto bg-slate-900 relative">
                <Header currentPageLabel={getPageTitle(location.pathname)} />
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
