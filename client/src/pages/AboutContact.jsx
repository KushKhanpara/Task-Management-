import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Globe, Send, User, MessageCircle, Linkedin, Twitter, ArrowRight, ShieldCheck, Zap, Users } from 'lucide-react';

const AboutContact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Thank you for reaching out! Khanapara Kush (CEO) and our team will get back to you soon.');
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-primary-500/30">
            {/* Hero Section / About */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
                    <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] animate-pulse"></div>
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="inline-block py-1 px-3 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-bold mb-6 uppercase tracking-widest">
                                About TaskFlow
                            </span>
                            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
                                Empowering Teams through <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-500">
                                    Infinite Innovation.
                                </span>
                            </h1>
                            <p className="text-xl text-slate-400 mb-8 leading-relaxed max-w-xl">
                                TaskFlow is more than just a tool; it's a movement. Founded with the mission to eliminate workflow friction, we specialize in building high-performance workspace solutions for modern teams.
                            </p>

                            <div className="flex flex-col gap-6">
                                <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl w-fit">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary-500 to-purple-500 flex items-center justify-center text-white text-2xl font-black shadow-xl">
                                        KK
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-lg">Khanpara Kush</p>
                                        <p className="text-primary-400 font-medium">Founder & CEO</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="glass-panel p-2 rounded-[2.5rem] border border-white/10 shadow-2xl relative z-10 overflow-hidden group">
                                <img
                                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000"
                                    alt="TaskFlow Headquarters"
                                    className="w-full h-[500px] object-cover rounded-[2rem] transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                                <div className="absolute bottom-10 left-10">
                                    <div className="flex items-center gap-2 text-white font-bold text-xl mb-1">
                                        <MapPin className="text-primary-500" /> Surat, Gujarat
                                    </div>
                                    <p className="text-slate-300 font-medium tracking-wide border-l-2 border-primary-500 pl-4">Global Headquarters · India</p>
                                </div>
                            </div>
                            <div className="absolute -z-10 -top-10 -right-10 w-64 h-64 bg-primary-500/20 rounded-full blur-[80px]"></div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats / Value Section */}
            <section className="py-24 bg-slate-900/10 border-y border-white/5 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                        <div>
                            <div className="inline-flex p-4 rounded-2xl bg-primary-500/10 mb-6 text-primary-400">
                                <Zap className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Fast Execution</h3>
                            <p className="text-slate-400 font-medium leading-relaxed">We believe in speed. Our platform is optimized for the fastest user interactions in the industry.</p>
                        </div>
                        <div>
                            <div className="inline-flex p-4 rounded-2xl bg-purple-500/10 mb-6 text-purple-400">
                                <Users className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Community Focused</h3>
                            <p className="text-slate-400 font-medium leading-relaxed">Every feature we build is a direct response to our users' needs and feedback.</p>
                        </div>
                        <div>
                            <div className="inline-flex p-4 rounded-2xl bg-emerald-500/10 mb-6 text-emerald-400">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Absolute Integrity</h3>
                            <p className="text-slate-400 font-medium leading-relaxed">Security isn't a feature; it's our foundation. Your data is protected by enterprise-grade encryption.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-32 px-6 relative">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-6">Let's build together.</h2>
                        <p className="text-xl text-slate-400">Need help or want to collaborate? Reach out to us.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* Email Inquiry */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="glass-panel p-10 flex flex-col items-center text-center group"
                        >
                            <div className="bg-primary-500/10 p-6 rounded-3xl text-primary-400 mb-8 group-hover:scale-110 transition-transform shadow-lg shadow-primary-500/10">
                                <Mail className="w-8 h-8" />
                            </div>
                            <h4 className="text-white font-black text-2xl mb-4">Email Inquiry</h4>
                            <p className="text-slate-400 text-lg mb-2">hello@taskflow.inc</p>
                            <p className="text-primary-500/60 text-sm font-bold uppercase tracking-widest">Global Support Hub</p>
                            <button className="mt-8 text-white font-bold flex items-center gap-2 hover:text-primary-400 transition-colors">
                                Support Portal <ArrowRight size={18} />
                            </button>
                        </motion.div>

                        {/* Direct Line */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="glass-panel p-10 flex flex-col items-center text-center group border-primary-500/20"
                        >
                            <div className="bg-purple-500/10 p-6 rounded-3xl text-purple-400 mb-8 group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/10">
                                <Phone className="w-8 h-8" />
                            </div>
                            <h4 className="text-white font-black text-2xl mb-4">Direct Line</h4>
                            <p className="text-slate-400 text-lg mb-2">+91 99XXX-XXXXX</p>
                            <p className="text-purple-500/60 text-sm font-bold uppercase tracking-widest">Connect Instantly</p>
                            <button className="mt-8 text-white font-bold flex items-center gap-2 hover:text-purple-400 transition-colors">
                                Request Callback <ArrowRight size={18} />
                            </button>
                        </motion.div>

                        {/* HQ Location */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="glass-panel p-10 flex flex-col items-center text-center group"
                        >
                            <div className="bg-emerald-500/10 p-6 rounded-3xl text-emerald-400 mb-8 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/10">
                                <MapPin className="w-8 h-8" />
                            </div>
                            <h4 className="text-white font-black text-2xl mb-4">HQ Location</h4>
                            <p className="text-slate-400 text-lg mb-1">Tech Park, Tower B</p>
                            <p className="text-slate-400 text-sm opacity-60">Gujarat, India 3950XX</p>
                            <button className="mt-8 text-white font-bold flex items-center gap-2 hover:text-emerald-400 transition-colors">
                                View Map <ArrowRight size={18} />
                            </button>
                        </motion.div>
                    </div>

                    <div className="mt-24 grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="glass-panel p-10 border-white/5 bg-slate-900/40">
                            <h4 className="text-white font-black text-xl mb-6 uppercase tracking-widest border-l-4 border-primary-500 pl-4">Company Philosophy</h4>
                            <p className="text-slate-400 leading-relaxed text-lg">
                                We operate on a remote-first architecture, leveraging the best talent globally to build tools that define the next generation of productivity. Our engineering standards are built on the "Flow State" principle—reducing friction between thought and digital execution.
                            </p>
                        </div>
                        <div className="glass-panel p-10 border-white/5 bg-slate-900/40">
                            <h4 className="text-white font-black text-xl mb-6 uppercase tracking-widest border-l-4 border-purple-500 pl-4">Innovation Roadmap</h4>
                            <p className="text-slate-400 leading-relaxed text-lg">
                                Currently focusing on deep AI integration for predictive task management and real-time team synchronization. Our upcoming updates will introduce "Neural Context"—a feature that understands project depth before you even type a single character.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map / Visit Us (Simulated) */}
            <section className="pb-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="glass-panel p-6 border-white/10 rounded-[3rem] overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 bg-slate-900">
                        <div className="h-[400px] rounded-[2rem] bg-slate-800 flex items-center justify-center relative group overflow-hidden">
                            <iframe
                                title="Surat Office Location"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119066.54586603091!2d72.73989476722396!3d21.17094110000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04e59411d1563%3A0xfe4558290938b042!2sSurat%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0, opacity: 0.7 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="group-hover:opacity-100 transition-opacity"
                            ></iframe>
                            <div className="absolute inset-0 pointer-events-none border-[20px] border-slate-950/20"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer Copy */}
            <footer className="py-20 border-t border-white/5 bg-slate-950 text-center">
                <p className="text-slate-600 text-sm font-medium tracking-widest uppercase">
                    © 2025 TaskFlow Inc. Engineered with precision by Khanpara Kush.
                </p>
            </footer>
        </div>
    );
};

export default AboutContact;
