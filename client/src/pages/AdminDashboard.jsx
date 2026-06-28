import React, { useState, useEffect, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import api from '../api/axios';
import { Users, CheckSquare, Activity, Calendar } from 'lucide-react';
import LeaderboardChart from '../components/charts/LeaderboardChart';
import TaskStatusChart from '../components/charts/TaskStatusChart';
import Loader from '../components/shared/Loader';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        users: 0,
        tasks: 0,
        completed: 0,
        pending: 0,
        in_progress: 0
    });
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, tasksRes, logsRes] = await Promise.all([
                    api.get('/users'),
                    api.get('/tasks/stats'),
                    api.get('/logs')
                ]);

                setStats({
                    users: usersRes.data.length,
                    tasks: tasksRes.data.total,
                    completed: tasksRes.data.completed,
                    pending: tasksRes.data.pending,
                    in_progress: tasksRes.data.in_progress
                });

                const sortedLogs = logsRes.data.sort((a, b) =>
                    new Date(b.createdAt) - new Date(a.createdAt)
                );
                setLogs(sortedLogs);
            } catch (error) {
                console.error('Failed to fetch dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredLogs = useMemo(() => {
        if (!selectedDate) {
            return logs;
        }
        return logs.filter(log => {
            const logDate = (log.date || '').split('T')[0];
            return logDate === selectedDate;
        });
    }, [logs, selectedDate]);

    const statCards = [
        { label: 'Total Users', value: stats.users, icon: Users, color: 'text-blue-500', from: 'from-blue-500/20', to: 'to-blue-600/5', border: 'border-blue-500/30' },
        { label: 'Total Tasks', value: stats.tasks, icon: CheckSquare, color: 'text-purple-500', from: 'from-purple-500/20', to: 'to-purple-600/5', border: 'border-purple-500/30' },
        { label: 'Completed', value: stats.completed, icon: Activity, color: 'text-green-500', from: 'from-green-500/20', to: 'to-green-600/5', border: 'border-green-500/30' },
    ];

    if (loading) return <Loader />;

    return (
        <div className="animate-fade-in space-y-8">
            <h1 className="text-3xl font-bold text-white tracking-tight">Admin Dashboard</h1>

            {/* Stat Cards - Enhanced */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statCards.map((stat, i) => (
                    <div key={i} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.from} ${stat.to} border ${stat.border} p-6 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] backdrop-blur-sm group`}>
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <stat.icon size={64} />
                        </div>
                        <div className="flex items-center gap-4 relative z-10">
                            <div className={`p-4 rounded-xl bg-slate-900/50 backdrop-blur-md ${stat.color} shadow-inner`}>
                                <stat.icon size={28} />
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">{stat.label}</p>
                                <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Leaderboard Chart */}
            <div className="rounded-2xl border border-slate-700/50 bg-slate-800/20 backdrop-blur-xl p-1 shadow-lg">
                <LeaderboardChart />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Task Status Chart */}
                <div className="lg:col-span-1">
                    <TaskStatusChart stats={stats} />
                </div>

                {/* Daily Work Reports Table - Enhanced */}
                <div className="lg:col-span-2 glass-panel p-6 overflow-hidden flex flex-col h-full shadow-lg border border-slate-700/50">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Calendar size={20} className="text-primary-500" /> Daily Work Reports
                        </h3>

                        <div className="flex items-center gap-2 bg-slate-900/80 p-2 rounded-xl border border-slate-700 shadow-inner">
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="bg-transparent text-white text-sm focus:outline-none [color-scheme:dark] px-2"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-slate-700/30">
                        <table className="w-full text-left text-slate-400">
                            <thead className="bg-slate-900/80 text-slate-300 uppercase text-xs font-bold tracking-wider">
                                <tr>
                                    <th className="p-4 pl-6">Employee</th>
                                    <th className="p-4">Report</th>
                                    <th className="p-4 text-right pr-6">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/50 bg-slate-800/20">
                                {filteredLogs.length > 0 ? (
                                    filteredLogs.map((log) => (
                                        <tr key={log._id} className="hover:bg-primary-500/5 transition-colors group">
                                            <td className="p-4 pl-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center text-white font-bold text-sm shadow-md border-2 border-slate-700 group-hover:border-primary-500/50 transition-colors">
                                                        {log.user?.image ? <img src={log.user.image} className="w-full h-full rounded-full object-cover" /> : log.user?.fullName?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-semibold group-hover:text-primary-400 transition-colors">{log.user?.fullName}</p>
                                                        <p className="text-xs text-slate-500">{log.user?.jobRole || 'Employee'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 max-w-xs">
                                                <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed">{log.description}</p>
                                                {log.hoursWorked &&
                                                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-700/50 text-slate-400 border border-slate-600">
                                                        {log.hoursWorked} HRS
                                                    </span>
                                                }
                                            </td>
                                            <td className="p-4 pr-6 text-right whitespace-nowrap">
                                                <div className="flex flex-col items-end">
                                                    <span className="text-xs font-medium text-slate-400 block mb-1">{new Date(log.date).toLocaleDateString()}</span>
                                                    <span className="text-[10px] text-slate-600 bg-slate-800 px-1.5 py-0.5 rounded">{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="p-12 text-center text-slate-500 flex flex-col items-center justify-center w-full">
                                            <Calendar size={48} className="mb-4 opacity-20" />
                                            <p className="text-lg font-medium">No reports found</p>
                                            <p className="text-sm opacity-70">Try selecting a different date</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <NavLink to="/admin/users" className="glass-panel p-8 hover:bg-slate-800/40 transition-all group block border-l-4 border-l-transparent hover:border-l-blue-500 relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-colors"></div>
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors flex items-center gap-2"> Manage Users <Users size={20} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" /></h3>
                    <p className="text-slate-400 max-w-sm">Create new accounts, remove users, and manage roles and permissions efficiently.</p>
                </NavLink>
                <NavLink to="/admin/tasks" className="glass-panel p-8 hover:bg-slate-800/40 transition-all group block border-l-4 border-l-transparent hover:border-l-purple-500 relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-purple-500/10 transition-colors"></div>
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors flex items-center gap-2"> Manage Tasks <CheckSquare size={20} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" /></h3>
                    <p className="text-slate-400 max-w-sm">Assign tasks, track progress, set deadlines, and monitor team productivity.</p>
                </NavLink>
            </div>
        </div>
    );
};

export default AdminDashboard;
