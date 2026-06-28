import React, { useState, useEffect, useMemo } from 'react';
import api from '../api/axios';
import { Calendar, Search, Plus, X, Clock, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const DailyLogs = () => {
    const { user } = useAuth();
    const [logs, setLogs] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [logData, setLogData] = useState({
        description: '',
        hoursWorked: '',
        date: new Date().toISOString().split('T')[0]
    });

    const fetchLogs = async () => {
        try {
            const { data } = await api.get('/logs');
            setLogs(data);
        } catch (error) {
            console.error('Failed to fetch logs');
            toast.error('Failed to fetch logs history');
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const submitLog = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post('/logs', logData);
            setLogData({
                description: '',
                hoursWorked: '',
                date: new Date().toISOString().split('T')[0]
            });
            setShowForm(false);
            fetchLogs();
            toast.success('Daily report submitted successfully');
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to submit report';
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredLogs = useMemo(() => {
        let filtered = logs;

        if (selectedDate) {
            filtered = filtered.filter(log => {
                const logDate = (log.date || '').split('T')[0];
                return logDate === selectedDate;
            });
        }

        if (searchQuery) {
            const lowerQ = searchQuery.toLowerCase();
            filtered = filtered.filter(log =>
                log.user?.fullName?.toLowerCase().includes(lowerQ) ||
                log.description?.toLowerCase().includes(lowerQ)
            );
        }

        return filtered;
    }, [logs, selectedDate, searchQuery]);

    const isEmployee = user?.role === 'employee';

    return (
        <div className="animate-fade-in pb-10">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Daily Logs History</h1>
                    <p className="text-slate-400 text-sm mt-1">Review work updates and progress reports</p>
                </div>

                <div className="flex flex-wrap gap-4 w-full md:w-auto">
                    {isEmployee && (
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${showForm ? 'bg-slate-700 text-white' : 'bg-primary-500 hover:bg-primary-600 text-white'
                                }`}
                        >
                            {showForm ? <X size={18} /> : <Plus size={18} />}
                            {showForm ? 'Cancel' : 'Submit New Report'}
                        </button>
                    )}

                    <div className="relative flex-1 md:w-64 min-w-[200px]">
                        <Search size={16} className="absolute left-3 top-2.5 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search employee or description..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-800 text-slate-300 text-sm rounded-lg pl-10 pr-4 py-2 border border-slate-700 focus:outline-none focus:border-primary-500"
                        />
                    </div>

                    <div className="flex items-center gap-2 bg-slate-800 p-1.5 rounded-lg border border-slate-700">
                        <Calendar size={16} className="text-slate-400 ml-1" />
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-transparent text-white text-sm focus:outline-none [color-scheme:dark]"
                        />
                    </div>
                </div>
            </div>

            {/* Submission Form (Conditional) */}
            {isEmployee && showForm && (
                <div className="glass-panel p-6 mb-8 border-primary-500/30 animate-scale-in">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <FileText className="text-primary-500" size={20} />
                        Submit Daily Work Report
                    </h2>
                    <form onSubmit={submitLog} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                            <label className="text-sm text-slate-400 mb-1 block font-medium">What did you work on?</label>
                            <textarea
                                className="input-field w-full h-32 resize-none text-sm"
                                placeholder="- Implemented user authentication flow&#10;- Designed dashboard widgets&#10;- Fixed layout issues on mobile..."
                                value={logData.description}
                                onChange={(e) => setLogData({ ...logData, description: e.target.value })}
                                required
                            ></textarea>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-slate-400 mb-1 block font-medium">Hours Spent</label>
                                <div className="relative">
                                    <Clock size={16} className="absolute left-3 top-3 text-slate-500" />
                                    <input
                                        type="number"
                                        className="input-field w-full pl-10"
                                        placeholder="0.0"
                                        step="0.5"
                                        min="0"
                                        max="24"
                                        value={logData.hoursWorked}
                                        onChange={(e) => setLogData({ ...logData, hoursWorked: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-slate-400 mb-1 block font-medium">Date Of Work</label>
                                <div className="relative">
                                    <Calendar size={16} className="absolute left-3 top-3 text-slate-500" />
                                    <input
                                        type="date"
                                        className="input-field w-full pl-10 [color-scheme:dark]"
                                        value={logData.date}
                                        onChange={(e) => setLogData({ ...logData, date: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="btn-primary w-full h-11 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Work Update'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="glass-panel overflow-hidden border-slate-700/50">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-slate-400">
                        <thead className="bg-slate-800/80 text-slate-200 uppercase text-[10px] tracking-wider font-bold">
                            <tr>
                                <th className="p-4">Date of Work</th>
                                <th className="p-4">Employee</th>
                                <th className="p-4">Work Description</th>
                                <th className="p-4">Hours</th>
                                <th className="p-4 text-right">Submitted At</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {filteredLogs.map((log) => (
                                <tr key={log._id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="p-4 font-medium text-white whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="text-primary-500 opacity-60" />
                                            {new Date(log.date).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        {(() => {
                                            const user = Array.isArray(log.user) ? log.user[0] : log.user;
                                            return (
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-xs text-white font-bold overflow-hidden border border-slate-600 shadow-sm">
                                                        {user?.image ? (
                                                            <img src={user.image} className="w-full h-full object-cover" alt="" />
                                                        ) : (
                                                            <span>{user?.fullName?.charAt(0) || '?'}</span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-200 leading-none mb-1">{user?.fullName || 'Unknown User'}</p>
                                                        <p className="text-[10px] text-slate-500 uppercase tracking-tighter">{user?.jobRole || 'Employee'}</p>
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </td>
                                    <td className="p-4 max-w-lg">
                                        <p className="text-sm text-slate-300 line-clamp-2 italic group-hover:line-clamp-none transition-all duration-300">
                                            "{log.description}"
                                        </p>
                                    </td>
                                    <td className="p-4 text-sm">
                                        <span className="bg-primary-500/10 text-primary-400 px-2.5 py-1 rounded-full font-bold border border-primary-500/20">
                                            {log.hoursWorked || '0'}h
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex flex-col items-end">
                                            <span className="text-xs text-slate-400 mb-0.5">{new Date(log.createdAt).toLocaleDateString()}</span>
                                            <span className="text-[10px] text-slate-600">{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredLogs.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center text-slate-500 italic">
                                        <div className="flex flex-col items-center gap-3 opacity-40">
                                            <FileText size={48} />
                                            <p>No activity logs found matching your filters.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DailyLogs;

