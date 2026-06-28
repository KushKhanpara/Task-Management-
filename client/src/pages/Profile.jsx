import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { User, Mail, Lock, Camera, Save, Building, Briefcase, MapPin } from 'lucide-react';

const Profile = () => {
    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
        password: '',
        confirmPassword: '',
        image: user?.image || ''
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
            toast.error('Image upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password && formData.password !== formData.confirmPassword) {
            return toast.error('Passwords do not match');
        }

        setLoading(true);
        try {
            const { data } = await api.put('/auth/profile', formData);
            setUser(data);
            toast.success('Profile updated successfully');
            setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
        } catch (error) {
            toast.error(error.response?.data?.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 animate-fade-in">
            <h1 className="text-3xl font-bold text-white mb-8">User Profile</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Stats & Brief Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass-panel p-6 text-center">
                        <div className="relative w-32 h-32 mx-auto mb-4 group">
                            <div className="w-full h-full rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white text-4xl font-bold overflow-hidden border-4 border-slate-700 shadow-2xl">
                                {formData.image ? (
                                    <img src={formData.image} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span>{user?.fullName?.charAt(0)}</span>
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 p-2 bg-primary-500 rounded-full cursor-pointer hover:bg-primary-400 transition-colors shadow-lg border-2 border-slate-800">
                                <Camera size={18} className="text-white" />
                                <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                            </label>
                            {uploading && (
                                <div className="absolute inset-0 bg-slate-900/60 rounded-full flex items-center justify-center">
                                    <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}
                        </div>
                        <h2 className="text-xl font-bold text-white">{user?.fullName}</h2>
                        <p className="text-slate-400 text-sm capitalize">{user?.role} • {user?.jobRole}</p>
                    </div>

                    <div className="glass-panel p-6 space-y-4">
                        <div className="flex items-center gap-3 text-slate-300">
                            <Building size={18} className="text-primary-400" />
                            <span className="text-sm">{user?.company}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-300">
                            <Briefcase size={18} className="text-purple-400" />
                            <span className="text-sm">{user?.department}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-300">
                            <User size={18} className="text-green-400" />
                            <span className="text-sm">@{user?.username}</span>
                        </div>
                    </div>
                </div>

                {/* Right: Edit Form */}
                <div className="lg:col-span-2">
                    <div className="glass-panel p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                                        <User size={16} /> Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        className="input-field"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                                        <Mail size={16} /> Email Address
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="input-field"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-700/50">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <Lock size={18} /> Change Password
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400">New Password</label>
                                        <input
                                            type="password"
                                            name="password"
                                            className="input-field"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            placeholder="Leave blank to keep current"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400">Confirm Password</label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            className="input-field"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            placeholder="Leave blank to keep current"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={loading || uploading}
                                    className="btn-primary w-full md:w-auto"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <Save size={18} /> Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
