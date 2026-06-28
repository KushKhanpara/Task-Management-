import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Lock, User, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const user = await login(username, password);
            if (user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid username or password');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-600/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md"
            >
                <div className="flex flex-col items-center mb-10">
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="mb-6 p-4 rounded-2xl bg-gradient-to-tr from-primary-600 to-purple-600 shadow-2xl shadow-primary-500/20"
                    >
                        <img src="/logo.png" alt="TaskFlow" className="h-12 w-12 object-contain brightness-0 invert" />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl font-black text-white mb-2">Welcome Back</h1>
                        <div className="flex items-center justify-center gap-2 text-primary-400 font-medium bg-primary-500/10 px-4 py-1 rounded-full text-sm">
                            <Sparkles className="w-4 h-4" />
                            <span>Unleash your productivity</span>
                        </div>
                    </motion.div>
                </div>

                <div className="glass-panel p-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-purple-500"></div>

                    {error && (
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-sm flex items-center gap-3"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-400 ml-1 uppercase tracking-widest">Admin ID</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary-400 transition-colors" />
                                <input
                                    type="text"
                                    required
                                    autoComplete="off"
                                    className="w-full bg-slate-900/50 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 transition-all placeholder:text-slate-600"
                                    placeholder="ADMIN-XXXX"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-400 ml-1 uppercase tracking-widest">Secret Key</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary-400 transition-colors" />
                                <input
                                    type="password"
                                    required
                                    autoComplete="new-password"
                                    className="w-full bg-slate-900/50 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 transition-all placeholder:text-slate-600"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-400 text-white rounded-2xl font-black text-lg hover:shadow-2xl hover:shadow-primary-500/40 transition-all flex items-center justify-center gap-3"
                        >
                            Sign In <ArrowRight className="w-5 h-5" />
                        </motion.button>

                        <div className="pt-4 text-center">
                            <p className="text-slate-400 text-sm font-medium">
                                New to TaskFlow?{' '}
                                <Link to="/register" className="text-white hover:text-primary-400 font-bold transition-colors underline underline-offset-4 decoration-primary-500/30">
                                    Explore Plans
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
