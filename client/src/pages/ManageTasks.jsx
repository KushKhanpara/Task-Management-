import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../api/axios';
import { Plus, CheckSquare, Pencil, Trash2, X, Filter, Users } from 'lucide-react';
import ConfirmModal from '../components/shared/ConfirmModal';
import { useAuth } from '../context/AuthContext';

const ManageTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        assignedTo: '',
        project: '',
        priority: 'medium',
        dueDate: '',
        status: 'pending'
    });

    // Filter State
    const [filterStatus, setFilterStatus] = useState('all');

    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            fetchTasks();
            fetchUsers();
            fetchProjects();
        }
    }, [user]);

    const fetchTasks = async () => {
        try {
            const { data } = await api.get('/tasks');
            // Filter by Company
            const companyTasks = data.filter(t => t.company === user.company);
            setTasks(companyTasks);
        } catch (error) {
            console.error('Failed to fetch tasks');
        }
    };

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/users');
            setUsers(data); // Assuming users route returns array
        } catch (error) { console.error(error); }
    };

    const fetchProjects = async () => {
        try {
            const { data } = await api.get('/projects');
            setProjects(data); // Assuming projects route
        } catch (error) { console.error(error); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation: Project Date Range
        const selectedProject = projects.find(p => p._id === formData.project);
        if (selectedProject) {
            const startDate = new Date(selectedProject.startDate);
            const endDate = new Date(selectedProject.endDate);
            const taskDate = new Date(formData.dueDate);

            if (taskDate < startDate || taskDate > endDate) {
                toast.error(`Due date must be between project dates: ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`);
                return;
            }
        }

        try {
            if (isEditing) {
                await api.put(`/tasks/${editId}`, formData);
                toast.success('Task Updated Successfully');
            } else {
                await api.post('/tasks', { ...formData, company: user.company });
                toast.success('Task Created Successfully');
            }
            resetForm();
            fetchTasks();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error saving task');
        }
    };

    const handleEdit = (task) => {
        setFormData({
            title: task.title,
            description: task.description || '',
            assignedTo: (Array.isArray(task.assignedTo) ? task.assignedTo[0] : task.assignedTo)?._id || task.assignedTo || '',
            project: task.project?._id || task.project || '',
            priority: task.priority || 'medium',
            dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
            status: task.status
        });
        setEditId(task._id);
        setIsEditing(true);
        setIsFormOpen(true);
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            assignedTo: '',
            project: '', // Ensure this matches backend schema (often just 'project' or 'projectId')
            priority: 'medium',
            dueDate: '',
            status: 'pending'
        });
        setEditId(null);
        setIsEditing(false);
        setIsFormOpen(false);
    };

    const handleDelete = async () => {
        if (!deleteModal.id) return;
        try {
            await api.delete(`/tasks/${deleteModal.id}`);
            toast.success('Task Deleted');
            fetchTasks();
        } catch (error) {
            toast.error('Failed to delete task');
        } finally {
            setDeleteModal({ isOpen: false, id: null });
        }
    };

    const filteredTasks = tasks.filter(task => {
        if (filterStatus === 'all') return true;
        return task.status === filterStatus;
    });

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-2xl font-bold text-white">Manage Tasks</h1>

                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-48">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full bg-slate-800 text-slate-300 text-sm rounded-lg px-4 py-2 border border-slate-700 focus:outline-none focus:border-primary-500 appearance-none cursor-pointer"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                        <Filter size={16} className="absolute right-3 top-2.5 text-slate-500 pointer-events-none" />
                    </div>

                    <button
                        onClick={() => isFormOpen ? resetForm() : setIsFormOpen(true)}
                        className="btn-primary whitespace-nowrap"
                    >
                        {isFormOpen ? <X size={18} /> : <Plus size={18} />}
                        <span className="ml-2">{isFormOpen ? 'Close Form' : 'Add Task'}</span>
                    </button>
                </div>
            </div>

            {isFormOpen && (
                <div className="glass-panel p-6 mb-8 animate-fade-in">
                    <h3 className="text-lg font-semibold text-white mb-4">{isEditing ? 'Edit Task' : 'Create New Task'}</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input className="input-field col-span-2" placeholder="Task Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                        <textarea className="input-field col-span-2 h-24" placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />

                        <select className="input-field" value={formData.assignedTo} onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })} required>
                            <option value="" disabled>Assign To Employee</option>
                            <option value="all" className="font-bold text-primary-400 font-bold italic">Assign to All Employees</option>
                            {users.filter(u => u.role !== 'admin').map(u => (
                                <option key={u._id} value={u._id}>{u.fullName}</option>
                            ))}
                        </select>

                        <select className="input-field" value={formData.project} onChange={(e) => setFormData({ ...formData, project: e.target.value })}>
                            <option value="">No Project (General)</option>
                            {projects.map(p => (
                                <option key={p._id} value={p._id}>{p.title}</option>
                            ))}
                        </select>

                        <select className="input-field" value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })}>
                            <option value="low">Low Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="high">High Priority</option>
                        </select>

                        <input
                            type="date"
                            className="input-field"
                            value={formData.dueDate}
                            min={projects.find(p => p._id === formData.project)?.startDate?.split('T')[0] || new Date().toISOString().split('T')[0]}
                            max={projects.find(p => p._id === formData.project)?.endDate?.split('T')[0]}
                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            required
                        />

                        <div className="col-span-2 flex justify-end gap-2 mt-4">
                            <button type="button" onClick={resetForm} className="px-4 py-2 text-slate-400 hover:text-white transition-colors">Cancel</button>
                            <button type="submit" className="btn-primary">{isEditing ? 'Update Task' : 'Create Task'}</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="glass-panel overflow-hidden">
                <table className="w-full text-left text-slate-400">
                    <thead className="bg-slate-800/50 text-slate-200 uppercase text-xs font-semibold">
                        <tr>
                            <th className="p-4">Title</th>
                            <th className="p-4">Assigned To</th>
                            <th className="p-4">Priority</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Due Date</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {filteredTasks.map((task) => (
                            <tr key={task._id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4 font-medium text-white">
                                    {task.title}
                                    {task.project && <span className="block text-xs text-slate-500 mt-1">{task.project.title || 'Project'}</span>}
                                </td>
                                <td className="p-4 flex items-center gap-2">
                                    {(() => {
                                        const assignedUsers = Array.isArray(task.assignedTo) ? task.assignedTo : (task.assignedTo ? [task.assignedTo] : []);
                                        const count = assignedUsers.length;
                                        const firstUser = assignedUsers[0];

                                        if (count === 0) return <span className="text-slate-600 italic">Unassigned</span>;
                                        if (count === 1) {
                                            return (
                                                <>
                                                    <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-[10px] overflow-hidden">
                                                        {firstUser?.image ? <img src={firstUser.image} className="w-full h-full object-cover" /> : firstUser?.fullName?.charAt(0)}
                                                    </div>
                                                    <span className="text-sm">{firstUser?.fullName}</span>
                                                </>
                                            );
                                        }
                                        return (
                                            <>
                                                <div className="w-6 h-6 rounded-full bg-primary-900/40 text-primary-400 flex items-center justify-center overflow-hidden border border-primary-500/30">
                                                    <Users size={12} />
                                                </div>
                                                <span className="text-sm font-medium text-primary-400">{count} Employees</span>
                                            </>
                                        );
                                    })()}
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs uppercase font-bold 
                                        ${task.priority === 'high' ? 'text-red-500 bg-red-500/10' :
                                            task.priority === 'low' ? 'text-blue-500 bg-blue-500/10' :
                                                'text-yellow-500 bg-yellow-500/10'}`}>
                                        {task.priority}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs uppercase font-bold 
                                        ${task.status === 'completed' ? 'text-green-500 bg-green-500/10' :
                                            task.status === 'in_progress' ? 'text-blue-500 bg-blue-500/10' :
                                                'text-slate-500 bg-slate-500/10'}`}>
                                        {task.status?.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="p-4 text-sm">{new Date(task.dueDate).toLocaleDateString()}</td>
                                <td className="p-4 text-right">
                                    <button onClick={() => handleEdit(task)} className="text-blue-400 hover:text-blue-300 p-2 hover:bg-blue-500/10 rounded-lg transition-colors mr-2">
                                        <Pencil size={18} />
                                    </button>
                                    <button onClick={() => setDeleteModal({ isOpen: true, id: task._id })} className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/10 rounded-lg transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredTasks.length === 0 && (
                            <tr>
                                <td colSpan="6" className="p-8 text-center text-slate-500">No tasks found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <ConfirmModal
                isOpen={deleteModal.isOpen}
                title="Delete Task"
                message="Are you sure? This will remove the task permanently."
                onConfirm={handleDelete}
                onCancel={() => setDeleteModal({ isOpen: false, id: null })}
            />
        </div>
    );
};

export default ManageTasks;
