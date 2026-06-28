import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../api/axios';
import { Plus, Folder, Pencil, Trash2, X, Calendar, Users } from 'lucide-react';
import ConfirmModal from '../components/shared/ConfirmModal';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ManageProjects = () => {
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        members: [] // Array of user IDs
    });

    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

    const { user } = useAuth(); // Get user from AuthContext

    // ... (rest of state)

    useEffect(() => {
        if (user) {
            fetchProjects();
            fetchUsers();
        }
    }, [user]);

    const fetchProjects = async () => {
        try {
            const { data } = await api.get('/projects');
            // Filter by Company (Multi-tenancy)
            const companyProjects = data.filter(p => p.company === user.company);
            setProjects(companyProjects);
        } catch (error) {
            console.error('Failed to fetch projects');
        }
    };

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/users');
            setUsers(data);
        } catch (error) { console.error(error); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (!isEditing && new Date(formData.startDate) < today) {
            toast.error('Start Date cannot be in the past');
            return;
        }

        // Validation: End Date must be after Start Date
        if (new Date(formData.endDate) < new Date(formData.startDate)) {
            toast.error('End Date must be after Start Date');
            return;
        }

        try {
            if (isEditing) {
                await api.put(`/projects/${editId}`, formData);
                toast.success('Project Updated Successfully');
            } else {
                await api.post('/projects', { ...formData, company: user.company });
                toast.success('Project Created Successfully');
            }
            resetForm();
            fetchProjects();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error saving project');
        }
    };

    const handleEdit = (project) => {
        setFormData({
            title: project.title,
            description: project.description || '',
            startDate: project.startDate ? project.startDate.split('T')[0] : '',
            endDate: project.endDate ? project.endDate.split('T')[0] : '',
            members: project.members ? project.members.map(m => m._id || m) : []
        });
        setEditId(project._id);
        setIsEditing(true);
        setIsFormOpen(true);
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            startDate: '',
            endDate: '',
            members: []
        });
        setEditId(null);
        setIsEditing(false);
        setIsFormOpen(false);
    };

    const handleDelete = async () => {
        if (!deleteModal.id) return;
        try {
            await api.delete(`/projects/${deleteModal.id}`);
            toast.success('Project Deleted');
            fetchProjects();
        } catch (error) {
            toast.error('Failed to delete project');
        } finally {
            setDeleteModal({ isOpen: false, id: null });
        }
    };

    const toggleMember = (userId) => {
        setFormData(prev => {
            const exists = prev.members.includes(userId);
            if (exists) {
                return { ...prev, members: prev.members.filter(id => id !== userId) };
            }
            return { ...prev, members: [...prev.members, userId] };
        });
    };

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-white">Manage Projects</h1>
                <button
                    onClick={() => isFormOpen ? resetForm() : setIsFormOpen(true)}
                    className="btn-primary"
                >
                    {isFormOpen ? <X size={18} /> : <Plus size={18} />}
                    <span className="ml-2">{isFormOpen ? 'Close Form' : 'Add Project'}</span>
                </button>
            </div>

            {isFormOpen && (
                <div className="glass-panel p-6 mb-8 animate-fade-in">
                    <h3 className="text-lg font-semibold text-white mb-4">{isEditing ? 'Edit Project' : 'Create New Project'}</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input className="input-field col-span-2" placeholder="Project Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                        <textarea className="input-field col-span-2 h-24" placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />

                        <div className="col-span-2">
                            <label className="text-xs text-slate-400 mb-2 block">Team Members</label>
                            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 bg-slate-900/50 rounded-lg border border-slate-700">
                                {users.filter(u => u.role !== 'admin').map(user => (
                                    <button
                                        key={user._id}
                                        type="button"
                                        onClick={() => toggleMember(user._id)}
                                        className={`px-3 py-1 rounded-full text-xs transition-all border ${formData.members.includes(user._id)
                                            ? 'bg-primary-500 text-white border-primary-500'
                                            : 'bg-slate-800 text-slate-400 border-slate-600 hover:border-slate-400'
                                            }`}
                                    >
                                        {user.fullName}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-slate-400 mb-1 block">Start Date</label>
                            <input
                                type="date"
                                className="input-field"
                                value={formData.startDate}
                                min={!isEditing ? new Date().toISOString().split('T')[0] : ''}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 mb-1 block">End Date</label>
                            <input
                                type="date"
                                className="input-field"
                                value={formData.endDate}
                                min={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                required
                            />
                        </div>

                        <div className="col-span-2 flex justify-end gap-2 mt-4">
                            <button type="button" onClick={resetForm} className="px-4 py-2 text-slate-400 hover:text-white transition-colors">Cancel</button>
                            <button type="submit" className="btn-primary">{isEditing ? 'Update Project' : 'Create Project'}</button>
                        </div>
                    </form>
                </div>
            )}


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <div key={project._id} className="glass-panel p-6 hover:border-primary-500/50 transition-all group relative">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/20">
                                <Folder size={20} />
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleEdit(project)} className="p-1.5 text-blue-400 hover:bg-blue-500/10 rounded"><Pencil size={16} /></button>
                                <button onClick={() => setDeleteModal({ isOpen: true, id: project._id })} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded"><Trash2 size={16} /></button>
                            </div>
                        </div>

                        <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
                        <p className="text-sm text-slate-400 mb-4 line-clamp-2 min-h-[40px]">{project.description}</p>

                        <div className="flex flex-col gap-2 text-xs text-slate-500 border-t border-slate-700/50 pt-4">
                            <div className="flex items-center gap-2">
                                <Calendar size={14} />
                                <span>{new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users size={14} />
                                <span>{project.members?.length || 0} Members</span>
                            </div>
                        </div>

                        <Link to={`/admin/projects/${project._id}`} className="mt-4 block text-center py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white text-sm transition-colors">
                            View Details
                        </Link>
                    </div>
                ))}
                {projects.length === 0 && (
                    <div className="col-span-full p-12 text-center text-slate-500">
                        <Folder size={48} className="mx-auto mb-4 opacity-30" />
                        <p>No projects found. Create one to get started.</p>
                    </div>
                )}
            </div>

            <ConfirmModal
                isOpen={deleteModal.isOpen}
                title="Delete Project"
                message="Are you sure? This will remove the project and unassign all tasks."
                onConfirm={handleDelete}
                onCancel={() => setDeleteModal({ isOpen: false, id: null })}
            />
        </div>
    );
};

export default ManageProjects;
