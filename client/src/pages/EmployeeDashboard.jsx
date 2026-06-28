import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../api/axios';
import { AlertCircle } from 'lucide-react';
import LeaderboardChart from '../components/charts/LeaderboardChart';

const EmployeeDashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [logs, setLogs] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [logData, setLogData] = useState({ description: '', hoursWorked: '' });

    const fetchTasks = async () => {
        try {
            const { data } = await api.get('/tasks/my');
            setTasks(data);
        } catch (error) {
            console.error('Failed to fetch tasks');
        }
    };

    const fetchLogs = async () => {
        try {
            const { data } = await api.get('/logs/my');
            setLogs(data);
        } catch (error) {
            console.error('Failed to fetch logs');
        } finally {
            setLoading(false);
        }
    };

    const fetchProjects = async () => {
        try {
            const { data } = await api.get('/projects/my');
            setProjects(data);
        } catch (error) {
            console.error('Failed to fetch projects');
        }
    };

    const fetchData = () => {
        fetchTasks();
        fetchLogs();
        fetchProjects();
    };

    useEffect(() => {
        fetchData();
    }, []);

    const submitLog = async (e) => {
        e.preventDefault();
        try {
            await api.post('/logs', logData);
            setLogData({ description: '', hoursWorked: '' });
            fetchLogs();
            toast.success('Daily log submitted successfully');
        } catch (error) {
            toast.error('Failed to submit log');
        }
    };

    return (
        <div className="animate-fade-in pb-10">
            {/* Top Section: Log Form & Recent Logs */}
            <div className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Daily Log Form */}
                <div className="lg:col-span-1 glass-panel p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Daily Work Update</h2>
                    <form onSubmit={submitLog} className="space-y-4">
                        <div>
                            <label className="text-sm text-slate-400 mb-1 block">What did you work on today?</label>
                            <textarea
                                className="input-field w-full h-32 resize-none"
                                placeholder="- Completed login page&#10;- Fixed bug in header..."
                                value={logData.description}
                                onChange={(e) => setLogData({ ...logData, description: e.target.value })}
                                name="description"
                                required
                            ></textarea>
                        </div>
                        <div>
                            <label className="text-sm text-slate-400 mb-1 block">Hours Worked</label>
                            <input
                                type="number"
                                className="input-field w-full"
                                placeholder="0"
                                value={logData.hoursWorked}
                                onChange={(e) => setLogData({ ...logData, hoursWorked: e.target.value })}
                                name="hoursWorked"
                            />
                        </div>
                        <button type="submit" className="btn-primary w-full">Submit Report</button>
                    </form>
                </div>

                {/* Recent Logs History Table */}
                <div className="lg:col-span-2 glass-panel p-6 overflow-hidden flex flex-col">
                    <h2 className="text-xl font-bold text-white mb-4">My Recent Reports</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-slate-400">
                            <thead className="bg-slate-800/50 text-slate-300 text-xs uppercase font-semibold">
                                <tr>
                                    <th className="p-3">Date</th>
                                    <th className="p-3">Description</th>
                                    <th className="p-3">Hours</th>
                                    <th className="p-3">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/50">
                                {logs.length > 0 ? (
                                    logs.map((log) => (
                                        <tr key={log._id} className="hover:bg-slate-800/30 transition-colors">
                                            <td className="p-3 font-medium text-primary-400 whitespace-nowrap">
                                                {new Date(log.date).toLocaleDateString()}
                                            </td>
                                            <td className="p-3 text-slate-300 max-w-xs truncate">{log.description}</td>
                                            <td className="p-3">{log.hoursWorked || '-'}</td>
                                            <td className="p-3 text-xs text-slate-500">
                                                {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="p-6 text-center text-slate-500 italic">No reports submitted yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* My Projects Table */}
            <div className="mb-8 glass-panel p-6">
                <h2 className="text-xl font-bold text-white mb-4">My Projects</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-slate-400">
                        <thead className="bg-slate-800/50 text-slate-300 text-xs uppercase font-semibold">
                            <tr>
                                <th className="p-3">Project Title</th>
                                <th className="p-3">Role In Project</th>
                                <th className="p-3">Start Date</th>
                                <th className="p-3">End Date</th>
                                <th className="p-3">Team Size</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            {projects.length > 0 ? (
                                projects.map((project) => (
                                    <tr key={project._id} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="p-3 text-white font-medium">{project.title}</td>
                                        <td className="p-3 text-sm text-blue-400">Member</td>
                                        <td className="p-3">{new Date(project.startDate).toLocaleDateString()}</td>
                                        <td className="p-3">{new Date(project.endDate).toLocaleDateString()}</td>
                                        <td className="p-3">{project.members?.length || 0} Members</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-6 text-center text-slate-500 italic">No projects assigned to you.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Leaderboard Chart */}
            <div className="mb-8">
                <LeaderboardChart />
            </div>

            {/* Kanban Board */}
            <h2 className="text-xl font-bold text-white mb-4">My Tasks</h2>
            {tasks.length > 0 ? (
                <div className="glass-panel p-4 bg-transparent border-0 shadow-none">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {['pending', 'in_progress', 'completed'].map(status => (
                            <div key={status} className="flex-1 min-w-[280px]">
                                <div className={`p-4 rounded-xl border mb-4 font-semibold flex items-center justify-between 
                                    ${status === 'pending' ? 'text-yellow-500 border-yellow-500/20 bg-yellow-500/10' :
                                        status === 'in_progress' ? 'text-blue-500 border-blue-500/20 bg-blue-500/10' :
                                            'text-green-500 border-green-500/20 bg-green-500/10'}`}>
                                    <h3 className="uppercase tracking-wider text-sm">{status.replace('_', ' ')}</h3>
                                    <span className="bg-white/20 px-2 py-0.5 rounded text-xs">
                                        {tasks.filter(t => t.status === status).length}
                                    </span>
                                </div>
                                <div className="bg-slate-800/30 rounded-xl p-4 min-h-[400px] border border-slate-700/50 space-y-3">
                                    {tasks.filter(t => t.status === status).map(task => (
                                        <div key={task._id} className="glass-panel p-4 hover:border-slate-500 transition-all group relative">
                                            <div className="flex justify-between items-start mb-2">
                                                {task.priority === 'high' && <span className="w-2 h-2 rounded-full bg-red-500"></span>}
                                            </div>
                                            <h4 className="text-white font-medium text-sm mb-1">{task.title}</h4>
                                            <p className="text-slate-400 text-xs line-clamp-2 mb-3">{task.description}</p>

                                            <select
                                                value={task.status}
                                                onChange={async (e) => {
                                                    try {
                                                        await api.put(`/tasks/${task._id}/status`, { status: e.target.value });
                                                        toast.success('Status updated');
                                                        fetchTasks();
                                                    } catch (err) {
                                                        toast.error('Failed');
                                                    }
                                                }}
                                                className="bg-slate-900/50 border border-slate-700 text-xs text-slate-300 rounded px-2 py-1 w-full focus:outline-none focus:border-primary-500"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="in_progress">In Progress</option>
                                                <option value="completed">Completed</option>
                                            </select>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            ) : (
                <div className="text-center text-slate-500 mt-20">
                    <AlertCircle size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No tasks assigned to you yet.</p>
                </div>
            )}
        </div>
    );
};

export default EmployeeDashboard;
