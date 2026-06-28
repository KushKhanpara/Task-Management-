import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import ConfirmModal from '../components/shared/ConfirmModal';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Search, Pencil, Trash2, X, AlertTriangle } from 'lucide-react';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        password: '',
        role: 'employee',
        jobRole: '',
        department: '',
        image: '',
        birthDate: '',
        joiningDate: ''
    });
    const [uploading, setUploading] = useState(false);
    const [ageError, setAgeError] = useState('');
    const [maxDate, setMaxDate] = useState('');

    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

    const { user: currentUser } = useAuth();

    useEffect(() => {
        if (currentUser) {
            fetchUsers();
            // ... (date logic)
            const today = new Date();
            today.setFullYear(today.getFullYear() - 18);
            setMaxDate(today.toISOString().split('T')[0]);
        }
    }, [currentUser]);

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/users');
            // Filter by Company
            const companyUsers = data.filter(u => u.company === currentUser.company);
            setUsers(companyUsers);
        } catch (error) {
            toast.error('Failed to fetch users');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'birthDate') {
            validateAge(value);
        }
    };

    const validateAge = (date) => {
        if (!date) {
            setAgeError('');
            return;
        }
        const birthDate = new Date(date);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        if (age < 18) {
            setAgeError('User must be at least 18 years old.');
        } else {
            setAgeError('');
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validation for image files
        const fileType = file.type;
        const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!validImageTypes.includes(fileType)) {
            toast.error('Please upload only images (JPG, JPEG, PNG)');
            return;
        }

        const data = new FormData();
        data.append('image', file);
        setUploading(true);

        try {
            const { data: res } = await api.post('/upload', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFormData(prev => ({ ...prev, image: res.path }));
            toast.success('Image uploaded');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Image upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (ageError) return;

        try {
            if (isEditing) {
                await api.put(`/users/${editId}`, formData);
                toast.success('User Updated Successfully');
            } else {
                await api.post('/users', { ...formData, company: currentUser.company });
                toast.success('User Created Successfully');
            }
            resetForm();
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error saving user');
        }
    };

    const handleEdit = (user) => {
        setFormData({
            fullName: user.fullName,
            username: user.username,
            password: '', // Don't fill password on edit
            role: user.role,
            jobRole: user.jobRole || '',
            department: user.department || '',
            image: user.image || '',
            birthDate: user.birthDate ? user.birthDate.split('T')[0] : '',
            joiningDate: user.joiningDate ? user.joiningDate.split('T')[0] : ''
        });
        setEditId(user._id);
        setIsEditing(true);
        setIsFormOpen(true);
    };

    const resetForm = () => {
        setFormData({
            fullName: '',
            username: '',
            password: '',
            role: 'employee',
            jobRole: '',
            department: '',
            image: '',
            birthDate: '',
            joiningDate: ''
        });
        setEditId(null);
        setIsEditing(false);
        setIsFormOpen(false);
        setAgeError('');
    };

    const handleDelete = async () => {
        if (!deleteModal.id) return;
        try {
            await api.delete(`/users/${deleteModal.id}`);
            toast.success('Successfully Deleted');
            fetchUsers();
        } catch (error) {
            toast.error('Failed to delete user');
        } finally {
            setDeleteModal({ isOpen: false, id: null });
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-white">Manage Users</h1>
                <button
                    onClick={() => isFormOpen ? resetForm() : setIsFormOpen(true)}
                    className="btn-primary"
                >
                    {isFormOpen ? <X size={18} /> : <UserPlus size={18} />}
                    <span className="ml-2">{isFormOpen ? 'Close Form' : 'Add User'}</span>
                </button>
            </div>

            {isFormOpen && (
                <div className="glass-panel p-6 mb-8 animate-fade-in">
                    <h3 className="text-lg font-semibold text-white mb-4">{isEditing ? 'Edit User' : 'Create New User'}</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input className="input-field" placeholder="Full Name" value={formData.fullName} onChange={handleInputChange} name="fullName" required />
                        <input className="input-field" placeholder="Username" value={formData.username} onChange={handleInputChange} name="username" required />
                        <input
                            className="input-field"
                            type="password"
                            placeholder={isEditing ? 'Password (leave blank to keep current)' : 'Password'}
                            value={formData.password}
                            onChange={handleInputChange}
                            name="password"
                            required={!isEditing}
                        />
                        <select className="input-field" value={formData.role} onChange={handleInputChange} name="role">
                            <option value="employee">Employee</option>
                            <option value="admin">Admin</option>
                        </select>
                        <input className="input-field" placeholder="Job Role / Title" value={formData.jobRole} onChange={handleInputChange} name="jobRole" />
                        <input className="input-field" placeholder="Department" value={formData.department} onChange={handleInputChange} name="department" />

                        <div>
                            <label className="text-xs text-slate-400 mb-1 block">Date of Birth</label>
                            <input
                                type="date"
                                className={`input-field ${ageError ? 'border-red-500 focus:ring-red-500' : ''}`}
                                value={formData.birthDate}
                                onChange={handleInputChange}
                                name="birthDate"
                                max={maxDate}
                            />
                            {ageError && <p className="text-red-500 text-xs mt-1">{ageError}</p>}
                        </div>

                        <div>
                            <label className="text-xs text-slate-400 mb-1 block">Joining Date</label>
                            <input type="date" className="input-field" value={formData.joiningDate} onChange={handleInputChange} name="joiningDate" />
                        </div>

                        <div className="md:col-span-2">
                            <label className="text-xs text-slate-400 mb-1 block">Profile Image</label>
                            <div className="flex gap-4 items-center">
                                <input type="file" className="text-sm text-slate-400" onChange={handleFileChange} accept="image/*" />
                                {uploading && <span className="text-sm text-slate-400">Uploading...</span>}
                                {formData.image && <img src={formData.image} loading="lazy" alt="Preview" className="w-10 h-10 rounded-full object-cover border border-slate-600" />}
                            </div>
                        </div>

                        <div className="md:col-span-2 flex justify-end gap-2 mt-4">
                            <button type="button" onClick={resetForm} className="px-4 py-2 text-slate-400 hover:text-white transition-colors">Cancel</button>
                            <button type="submit" className="btn-primary">{isEditing ? 'Update User' : 'Create User'}</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="glass-panel overflow-hidden">
                <table className="w-full text-left text-slate-400">
                    <thead className="bg-slate-800/50 text-slate-200 uppercase text-xs font-semibold">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Username</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Job Title</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {users.map((user) => (
                            <tr key={user._id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4 text-white font-medium flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden flex items-center justify-center text-xs border border-slate-600">
                                        {user.image ? (
                                            <img src={user.image} loading="lazy" className="w-full h-full object-cover" />
                                        ) : (
                                            <span>{user.fullName.charAt(0)}</span>
                                        )}
                                    </div>
                                    {user.fullName}
                                </td>
                                <td className="p-4">{user.username}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs ${user.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4 text-slate-400">{user.jobRole || '-'}</td>
                                <td className="p-4 text-right">
                                    <button onClick={() => handleEdit(user)} className="text-blue-400 hover:text-blue-300 p-2 hover:bg-blue-500/10 rounded-lg transition-colors mr-2">
                                        <Pencil size={18} />
                                    </button>
                                    <button onClick={() => setDeleteModal({ isOpen: true, id: user._id })} className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/10 rounded-lg transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <ConfirmModal
                isOpen={deleteModal.isOpen}
                title="Delete User"
                message="Are you sure you want to delete this user? This action cannot be undone."
                onConfirm={handleDelete}
                onCancel={() => setDeleteModal({ isOpen: false, id: null })}
            />
        </div>
    );
};

export default ManageUsers;
