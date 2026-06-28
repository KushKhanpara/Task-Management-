import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { ArrowLeft, User, Calendar, CheckSquare } from 'lucide-react';

const ProjectDetails = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [projectRes, tasksRes] = await Promise.all([
                    api.get(`/projects/${id}`),
                    api.get(`/tasks?projectId=${id}`)
                ]);
                setProject(projectRes.data);
                setTasks(tasksRes.data);
            } catch (error) {
                toast.error('Failed to load project details');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <div className="text-center p-12 text-slate-500">Loading...</div>;
    if (!project) return <div className="text-center p-12 text-slate-500">Project not found</div>;

    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

    return (
        <div className="animate-fade-in">
            <Link to="/admin/projects" className="inline-flex items-center text-slate-400 hover:text-white mb-6 transition-colors">
                <ArrowLeft size={16} className="mr-2" /> Back to Projects
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Project Info */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-panel p-8">
                        <div className="flex justify-between items-start mb-6">
                            <h1 className="text-3xl font-bold text-white">{project.title}</h1>
                            <span className="px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-400 border border-slate-700">
                                {project.status || 'Active'}
                            </span>
                        </div>

                        <p className="text-slate-300 leading-relaxed mb-8 text-lg font-light">
                            {project.description}
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-slate-700/50">
                            <div>
                                <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Start Date</label>
                                <p className="text-white mt-1 font-medium">{new Date(project.startDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Due Date</label>
                                <p className="text-white mt-1 font-medium">{new Date(project.endDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Tasks</label>
                                <p className="text-white mt-1 font-medium">{completedTasks} / {tasks.length}</p>
                            </div>
                            <div>
                                <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Progress</label>
                                <p className={`mt-1 font-bold ${progress === 100 ? 'text-green-500' : 'text-blue-500'}`}>{progress}%</p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
                            <div className="bg-primary-500 h-full transition-all duration-1000 ease-out" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>

                    {/* Task List */}
                    <div className="glass-panel p-6">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <CheckSquare size={20} className="text-primary-500" /> Project Tasks
                        </h3>
                        <div className="space-y-3">
                            {tasks.map(task => (
                                <div key={task._id} className="p-4 rounded-xl bg-slate-800/30 hover:bg-slate-800/50 transition-colors border border-slate-700/50 flex justify-between items-center group">
                                    <div>
                                        <h4 className={`font-medium ${task.status === 'completed' ? 'text-slate-500 line-through' : 'text-white'}`}>
                                            {task.title}
                                        </h4>
                                        <p className="text-xs text-slate-500 mt-1">Assigned to: {task.assignedTo?.fullName || 'Unassigned'}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold 
                                        ${task.status === 'completed' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                        {task.status.replace('_', ' ')}
                                    </span>
                                </div>
                            ))}
                            {tasks.length === 0 && <p className="text-slate-500 italic">No tasks created for this project yet.</p>}
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="glass-panel p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <User size={18} className="text-primary-500" /> Team Members
                        </h3>
                        <div className="space-y-4">
                            {project.members && project.members.length > 0 ? (
                                project.members.map(member => (
                                    <div key={member._id} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors">
                                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xs overflow-hidden border border-slate-600">
                                            {member.image ? <img src={member.image} className="w-full h-full object-cover" /> : member.fullName?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-white text-sm font-medium">{member.fullName}</p>
                                            <p className="text-slate-500 text-xs">{member.jobRole || 'Member'}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-500 text-sm">No members assigned.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;
