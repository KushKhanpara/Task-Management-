import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Users, Layout as LayoutIcon, CheckCircle, ArrowRight, Play, Star, Menu, X, Sparkles, Globe, Clock, BarChart, Mail, Phone, MapPin, User, MessageCircle, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { scrollY } = useScroll();

    const headerBg = useTransform(scrollY, [0, 50], ["rgba(2, 6, 23, 0)", "rgba(2, 6, 23, 0.8)"]);
    const headerBlur = useTransform(scrollY, [0, 50], ["blur(0px)", "blur(12px)"]);

    const features = [
        {
            icon: <LayoutIcon className="w-8 h-8 text-primary-400" />,
            title: "Smart Workspaces",
            description: "Organize tasks with AI-powered suggestions and intuitive drag-and-drop interfaces.",
            gradient: "from-primary-500/20 to-blue-500/0"
        },
        {
            icon: <Zap className="w-8 h-8 text-purple-400" />,
            title: "Instant Sync",
            description: "Proprietary real-time engine ensures every team member stays perfectly aligned.",
            gradient: "from-purple-500/20 to-pink-500/0"
        },
        {
            icon: <Users className="w-8 h-8 text-emerald-400" />,
            title: "Dynamic Collaboration",
            description: "Built-in chat, file sharing, and video updates directly within your workflow.",
            gradient: "from-emerald-500/20 to-teal-500/0"
        },
        {
            icon: <Shield className="w-8 h-8 text-amber-400" />,
            title: "Ironclad Security",
            description: "End-to-end encryption for your most sensitive project data and communications.",
            gradient: "from-amber-500/20 to-orange-500/0"
        }
    ];

    const stats = [
        { label: "Active Users", value: "50k+" },
        { label: "Projects Managed", value: "2M+" },
        { label: "Uptime", value: "99.9%" },
        { label: "Satisfaction", value: "4.9/5" }
    ];

    const plans = [
        {
            id: 'pro',
            name: "Professional",
            price: "$99",
            period: "/year",
            description: "Perfect for growing teams and serious individual projects.",
            features: ["Unlimited Kanban Boards", "50GB Cloud Storage", "Custom Workflows", "Priority Email Support"],
            popular: false
        },
        {
            id: 'lifetime',
            name: "Enterprise Lifetime",
            price: "$999",
            period: "Once",
            description: "The ultimate power move. Own the platform forever.",
            features: ["Everything in Pro", "Unlimited Storage", "Whitelabel Options", "24/7 Dedicated Support", "API Access"],
            popular: true
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.3 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
    };

    const handlePlanAction = (planId) => {
        navigate(`/register?plan=${planId}`);
    };



    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 overflow-x-hidden">
            {/* Ambient Background Elements */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-600/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] bg-blue-600/5 rounded-full blur-[100px]"></div>
            </div>

            {/* Navigation */}
            <motion.nav
                style={{ backgroundColor: headerBg, backdropFilter: headerBlur }}
                className="fixed w-full z-50 top-0 border-b border-white/5 transition-all duration-300"
            >
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 group">
                        <motion.div
                            whileHover={{ rotate: 180 }}
                            transition={{ duration: 0.5 }}
                            className="bg-gradient-to-tr from-primary-600 to-purple-600 p-2 rounded-xl shadow-lg shadow-primary-500/20"
                        >
                            <img src="/logo.png" alt="Logo" className="w-8 h-8 brightness-0 invert" />
                        </motion.div>
                        <span className="text-2xl font-black bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent group-hover:to-primary-400 transition-all duration-300">
                            TaskFlow
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        {["Features", "Pricing", "About", "Contact"].map((item) => (
                            <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-slate-400 hover:text-white transition-colors uppercase tracking-wider">
                                {item}
                            </a>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <Link to="/login" className="hidden sm:block text-slate-400 hover:text-white font-medium transition-colors">
                            Login
                        </Link>
                        <Link to="/register">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="btn-primary"
                            >
                                Join Now
                            </motion.button>
                        </Link>
                        <button className="md:hidden text-slate-400" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="fixed top-[73px] w-full bg-slate-900/95 backdrop-blur-xl z-40 border-b border-white/10 md:hidden"
                    >
                        <div className="flex flex-col p-6 gap-4">
                            {["Features", "Pricing", "About", "Contact"].map((item) => (
                                <a key={item} href={`#${item.toLowerCase()}`} className="text-lg font-medium text-slate-300" onClick={() => setIsMenuOpen(false)}>
                                    {item}
                                </a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hero Section */}
            <section className="relative pt-40 pb-20 lg:pt-56 lg:pb-40 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-semibold mb-8 backdrop-blur-sm"
                        >
                            <Sparkles className="w-4 h-4" />
                            <span>v2.0 is now live — Experience the future</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[1.1]"
                        >
                            Work with <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-purple-400 to-pink-500">
                                Infinite Flow
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.4 }}
                            className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed"
                        >
                            Break free from legacy task managers. Experience a workspace that moves at the speed of thought, designed for high-performance teams.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.6 }}
                            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                        >
                            <Link to="/register">
                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(14, 165, 233, 0.4)" }}
                                    whileTap={{ scale: 0.95 }}
                                    className="btn-primary text-lg px-10 py-5 group"
                                >
                                    Get Started Free
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                            </Link>
                            <Link to="/login">
                                <motion.button
                                    whileHover={{ scale: 1.05, backgroundColor: "rgba(30, 41, 59, 0.8)" }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-3 px-10 py-5 rounded-full bg-slate-800/50 border border-white/10 text-white font-semibold backdrop-blur-sm transition-all"
                                >
                                    <Play className="w-5 h-5 fill-white" />
                                    View Demo
                                </motion.button>
                            </Link>
                        </motion.div>
                    </div>

                    {/* Hero Visual */}
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.8, ease: "circOut" }}
                        className="mt-24 relative max-w-6xl mx-auto"
                    >
                        <div className="absolute inset-0 bg-primary-500/10 blur-[100px] -z-10 rounded-full"></div>
                        <div className="relative glass-panel p-3 border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
                            <div className="rounded-[1.5rem] overflow-hidden bg-slate-900 border border-white/5 group">
                                <img
                                    src="/image.png"
                                    alt="Platform Preview"
                                    className="w-full h-auto transition-transform duration-700 group-hover:scale-[1.02]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
                            </div>
                        </div>

                        {/* Floating elements for depth */}
                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-12 -right-12 hidden lg:block glass-card p-4 animate-float"
                        >
                            <div className="flex items-center gap-3">
                                <div className="bg-emerald-500/20 p-2 rounded-lg"><CheckCircle className="text-emerald-400 w-5 h-5" /></div>
                                <div>
                                    <p className="text-xs text-slate-400">Task Completed</p>
                                    <p className="font-bold text-white">Logo Design</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 20, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute -bottom-10 -left-10 hidden lg:block glass-card p-4"
                        >
                            <div className="flex items-center gap-3">
                                <div className="bg-primary-500/20 p-2 rounded-lg"><BarChart className="text-primary-400 w-5 h-5" /></div>
                                <div>
                                    <p className="text-xs text-slate-400">Team Uptime</p>
                                    <p className="font-bold text-white">99.9% Efficiency</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="py-12 border-y border-white/5 bg-slate-900/30 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center"
                            >
                                <p className="text-3xl md:text-5xl font-black text-white mb-2">{stat.value}</p>
                                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-32 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-24">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-6xl font-black text-white mb-6"
                        >
                            Built for the next decade.
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-slate-400 text-xl max-w-2xl mx-auto"
                        >
                            We've re-engineered everything from the ground up to provide the fastest task management experience on the planet.
                        </motion.p>
                    </div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-8"
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                whileHover={{ y: -10 }}
                                className="group relative glass-panel p-10 overflow-hidden"
                            >
                                <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${feature.gradient} blur-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                                <div className="mb-8 p-5 rounded-2xl bg-white/5 border border-white/10 w-fit group-hover:scale-110 transition-transform duration-500">
                                    {feature.icon}
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-primary-400 transition-colors">{feature.title}</h3>
                                <p className="text-slate-400 text-lg leading-relaxed">
                                    {feature.description}
                                </p>
                                <div className="mt-8 flex items-center gap-2 text-primary-400 font-bold cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0">
                                    Learn more <ArrowRight className="w-4 h-4" />
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-32 relative bg-slate-900/20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-6">Choose your power.</h2>
                        <p className="text-slate-400 text-xl">Investment in yourself that pays off every single day.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
                        {plans.map((plan, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: index === 0 ? -30 : 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className={`relative glass-panel p-10 flex flex-col ${plan.popular ? 'border-primary-500/50 scale-105 z-10' : ''}`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary-600 to-purple-600 text-white text-xs font-black px-6 py-2 rounded-full shadow-xl">
                                        MOST POPULAR
                                    </div>
                                )}
                                <div className="mb-8">
                                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                                    <p className="text-slate-400 text-sm">{plan.description}</p>
                                </div>

                                <div className="flex items-baseline gap-1 mb-8">
                                    <span className="text-6xl font-black text-white">{plan.price}</span>
                                    <span className="text-slate-500 font-bold">{plan.period}</span>
                                </div>

                                <ul className="space-y-5 mb-12 flex-1">
                                    {plan.features.map((item, i) => (
                                        <li key={i} className="flex items-center text-slate-300 gap-3">
                                            <div className="bg-primary-500/10 p-1 rounded-full">
                                                <CheckCircle className="w-5 h-5 text-primary-500" />
                                            </div>
                                            <span className="text-lg font-medium">{item}</span>
                                        </li>
                                    ))}
                                </ul>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handlePlanAction(plan.id)}
                                    className={`w-full py-5 rounded-2xl font-black transition-all text-lg ${plan.popular
                                        ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white hover:shadow-2xl hover:shadow-primary-500/40'
                                        : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                                        }`}>
                                    {plan.id === 'pro' ? 'Get Started' : 'Unlock Everything'}
                                </motion.button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-32 relative overflow-hidden bg-slate-900/10">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="inline-block py-1 px-3 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-bold mb-6 uppercase tracking-widest">
                                About TaskFlow
                            </span>
                            <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
                                Management <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-500 font-black">
                                    Redefined.
                                </span>
                            </h2>
                            <p className="text-xl text-slate-400 mb-8 leading-relaxed max-w-xl">
                                TaskFlow isn't just a project management tool; it's a productivity engine designed for high-performance teams. Our goal is to eliminate complexity, leaving you with a seamless, intuitive workflow that lets you focus on what truly matters: building great things.
                            </p>

                            <div className="space-y-6 mb-12">
                                <div className="flex items-center gap-4 text-slate-300">
                                    <div className="bg-primary-500/10 p-2 rounded-lg">
                                        <Zap className="w-5 h-5 text-primary-400" />
                                    </div>
                                    <span className="text-lg font-medium">Real-time Task Lifecycle Tracking</span>
                                </div>
                                <div className="flex items-center gap-4 text-slate-300">
                                    <div className="bg-purple-500/10 p-2 rounded-lg">
                                        <Users className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <span className="text-lg font-medium">Advanced Team Management & Activity Logs</span>
                                </div>
                                <div className="flex items-center gap-4 text-slate-300">
                                    <div className="bg-emerald-500/10 p-2 rounded-lg">
                                        <Shield className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <span className="text-lg font-medium">Enterprise-Grade Security & Role-Based Access</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-5 rounded-2xl w-fit group hover:bg-white/10 transition-colors duration-300">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-primary-500 to-purple-500 flex items-center justify-center text-white text-xl font-black shadow-lg">
                                    KK
                                </div>
                                <div>
                                    <p className="text-white font-bold text-lg">Khanapara Kush</p>
                                    <p className="text-primary-400 font-medium">Founding Visionary</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                            className="relative lg:scale-110"
                        >
                            <div className="glass-panel p-2 rounded-[2.5rem] border border-white/10 shadow-2xl relative z-10 overflow-hidden group">
                                <img
                                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000"
                                    alt="TaskFlow Headquarters"
                                    className="w-full h-[500px] object-cover rounded-[2rem] transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>
                                <div className="absolute bottom-10 left-10">
                                    <div className="flex items-center gap-2 text-white font-bold text-xl mb-1">
                                        <MapPin className="text-primary-500" /> Virtual HQ
                                    </div>
                                    <p className="text-slate-300 font-medium tracking-wide border-l-2 border-primary-500 pl-4">Engineering the Future · Global</p>
                                </div>
                            </div>
                            <div className="absolute -z-10 -top-10 -right-10 w-64 h-64 bg-primary-500/20 rounded-full blur-[80px]"></div>
                            <div className="absolute -z-10 -bottom-10 -left-10 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px]"></div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-32 relative px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-24">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-6xl font-black text-white mb-6"
                        >
                            Connect with us.
                        </motion.h2>
                        <p className="text-xl text-slate-400">Questions? Feedback? Just want to say hi? We're all ears.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Info Block */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8"
                        >
                            <div className="glass-panel p-8 hover:bg-white/5 transition-colors group text-center flex flex-col items-center">
                                <div className="bg-primary-500/10 p-4 rounded-2xl text-primary-400 group-hover:scale-110 transition-transform mb-4">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-lg mb-1 uppercase tracking-widest">Email Inquiry</h4>
                                    <p className="text-slate-400">kush@taskflow.inc</p>
                                    <p className="text-slate-400 text-sm mt-2 opacity-60">Response in 24h</p>
                                </div>
                            </div>

                            <div className="glass-panel p-8 hover:bg-white/5 transition-colors group text-center flex flex-col items-center border-primary-500/20">
                                <div className="bg-purple-500/10 p-4 rounded-2xl text-purple-400 group-hover:scale-110 transition-transform mb-4">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-lg mb-1 uppercase tracking-widest">Direct Line</h4>
                                    <p className="text-slate-400">+91 99XXX-XXXXX</p>
                                    <p className="text-slate-400 text-sm mt-2 opacity-60">Mon-Fri · 10am-5pm</p>
                                </div>
                            </div>

                            <div className="glass-panel p-8 hover:bg-white/5 transition-colors group text-center flex flex-col items-center">
                                <div className="bg-emerald-500/10 p-4 rounded-2xl text-emerald-400 group-hover:scale-110 transition-transform mb-4">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-lg mb-1 uppercase tracking-widest">Location</h4>
                                    <p className="text-slate-400">Tech Innovation Hub,</p>
                                    <p className="text-slate-400">Gujarat, India</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Newsletter / CTA Section */}
            <section className="py-32 px-6">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-primary-600/20 to-purple-600/20 border border-white/10 p-12 md:p-20 text-center"
                    >
                        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-3xl -z-10"></div>
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-8">Ready to achieve <br /> unbroken concentration?</h2>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <input
                                type="email"
                                placeholder="Enter your work email"
                                className="bg-white/5 border border-white/10 px-8 py-5 rounded-2xl text-white w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                            />
                            <button className="btn-primary text-lg px-10 py-5">
                                Join Beta
                            </button>
                        </div>
                        <p className="mt-8 text-slate-500 text-sm font-medium">No credit card required. Cancel anytime.</p>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 border-t border-white/5 relative bg-slate-950">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-2 mb-6">
                                <img src="/logo.png" alt="Logo" className="w-10 h-10" />
                                <span className="text-2xl font-black text-white">TaskFlow</span>
                            </div>
                            <p className="text-slate-400 text-lg max-w-sm mb-8 leading-relaxed">
                                The high-performance workspace for teams who demand the best. Move faster, stay aligned, and deliver more.
                            </p>
                            <div className="flex gap-6">
                                {["Twitter", "GitHub", "LinkedIn", "Discord"].map(social => (
                                    <a key={social} href="#" className="text-slate-500 hover:text-white transition-colors text-sm font-bold uppercase tracking-wider">{social}</a>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-white font-black uppercase tracking-widest text-sm mb-6">Product</h4>
                            <ul className="space-y-4">
                                {["Features", "Integrations", "Enterprise", "Solutions"].map(item => (
                                    <li key={item}><a href="#" className="text-slate-500 hover:text-white transition-colors">{item}</a></li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-black uppercase tracking-widest text-sm mb-6">Company</h4>
                            <ul className="space-y-4">
                                {["About Us", "Careers", "Security", "Privacy"].map(item => (
                                    <li key={item}><a href={item === "About Us" ? "#about" : "#"} className="text-slate-500 hover:text-white transition-colors">{item}</a></li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-slate-600 text-sm">© 2025 TaskFlow Inc. Precision-engineered by Khanapara Kush.</p>
                        <div className="flex gap-8">
                            <a href="#" className="text-slate-600 hover:text-white text-xs uppercase tracking-widest font-bold">Privacy Policy</a>
                            <a href="#" className="text-slate-600 hover:text-white text-xs uppercase tracking-widest font-bold">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
