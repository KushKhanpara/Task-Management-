import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Zap, Star, Shield, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Subscription = () => {
    const { user } = useAuth();
    const [loadingPlan, setLoadingPlan] = useState(null);

    const plans = [
        {
            id: 'free',
            name: 'Starter',
            price: '$0',
            period: '/mo',
            description: 'Perfect for exploring TaskFlow features',
            features: [
                '5 Active Projects',
                'Basic Kanban Boards',
                'Core Collaboration Tools',
                'Standard Security',
                '24h Sync Delay'
            ],
            buttonText: 'Current Plan',
            isCurrent: user?.plan === 'free' || !user?.plan,
            premium: false
        },
        {
            id: 'pro',
            name: 'Professional',
            price: '$99',
            period: '/year',
            description: 'Advanced features for growing teams',
            features: [
                'Unlimited Projects',
                'AI Workflow Suggestions',
                'Real-time Collaboration',
                'Priority Slack Support',
                '50GB Cloud Vault'
            ],
            buttonText: 'Go Pro',
            isCurrent: user?.plan === 'pro',
            recommended: true,
            premium: true
        },
        {
            id: 'premium',
            name: 'Enterprise Lifetime',
            price: '$999',
            period: 'Once',
            description: 'The ultimate power for organizations',
            features: [
                'All Pro Features',
                'Whitelabel Dashboard',
                'Custom API Integrations',
                'Dedicated Account Manager',
                'Lifetime Updates'
            ],
            buttonText: 'Claim Lifetime Access',
            isCurrent: user?.plan === 'premium',
            premium: true
        }
    ];

    const handleSubscribe = async (planId) => {
        if (planId === 'free' || planId === user?.plan) return;
        setLoadingPlan(planId);
        setTimeout(() => {
            alert(`Plan upgrade to ${planId.toUpperCase()} initiated! Finalizing secure connection...`);
            setLoadingPlan(null);
        }, 800);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 py-24 px-6 relative overflow-hidden font-sans">
            {/* Background Glows */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary-600/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-black mb-6"
                    >
                        <Sparkles className="w-4 h-4" />
                        UPGRADE YOUR WORKFLOW
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight"
                    >
                        Choose your power.
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="max-w-2xl text-xl text-slate-400 mx-auto"
                    >
                        The tools you need to build the future. Choose a plan that fuels your ambition.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-10">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                            whileHover={{ y: -10 }}
                            className={`relative flex flex-col p-10 glass-panel border-2 ${plan.recommended
                                ? 'border-primary-500/50 scale-105 z-10'
                                : 'border-white/5'
                                }`}
                        >
                            {plan.recommended && (
                                <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex justify-center">
                                    <span className="inline-flex items-center gap-2 px-6 py-2 rounded-full text-xs font-black bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-2xl">
                                        <Zap className="w-4 h-4 fill-white" /> MOST POPULAR
                                    </span>
                                </div>
                            )}

                            <div className="mb-10">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-3xl font-black text-white">{plan.name}</h3>
                                    {plan.id === 'pro' && <Star className="text-primary-400 w-8 h-8 fill-primary-400/20" />}
                                    {plan.id === 'premium' && <Shield className="text-purple-400 w-8 h-8 fill-purple-400/20" />}
                                </div>
                                <p className="text-slate-400 text-lg leading-relaxed mb-8">{plan.description}</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-6xl font-black text-white">
                                        {plan.price}
                                    </span>
                                    <span className="text-xl font-bold text-slate-500">{plan.period}</span>
                                </div>
                            </div>

                            <ul className="flex-1 space-y-5 mb-12">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-4 group">
                                        <div className="bg-primary-500/10 p-1 rounded-full group-hover:scale-110 transition-transform">
                                            <CheckCircle className="h-5 w-5 text-primary-500" />
                                        </div>
                                        <span className="text-lg text-slate-300 font-medium">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleSubscribe(plan.id)}
                                disabled={plan.isCurrent || loadingPlan === plan.id}
                                className={`w-full py-5 px-6 rounded-2xl font-black text-xl transition-all duration-300 flex justify-center items-center gap-2 relative overflow-hidden ${plan.isCurrent
                                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                                    : plan.premium
                                        ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white hover:shadow-2xl hover:shadow-primary-500/40'
                                        : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                                    }`}
                            >
                                <AnimatePresence mode="wait">
                                    {loadingPlan === plan.id ? (
                                        <motion.div
                                            key="loader"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="w-7 h-7 border-4 border-white/30 border-t-white rounded-full animate-spin"
                                        />
                                    ) : (
                                        <motion.span
                                            key="text"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex items-center gap-2"
                                        >
                                            {plan.buttonText} {!plan.isCurrent && <ArrowRight className="w-5 h-5" />}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-20 text-center"
                >
                    <div className="inline-flex items-center gap-8 px-10 py-6 rounded-3xl bg-slate-900/50 border border-white/5 backdrop-blur-xl">
                        <div className="flex items-center gap-3 text-slate-400 font-bold">
                            <Shield className="text-primary-500" />
                            <span>PCI Protected</span>
                        </div>
                        <div className="w-px h-6 bg-white/10" />
                        <div className="flex items-center gap-3 text-slate-400 font-bold">
                            <Zap className="text-amber-500" />
                            <span>Instant Activation</span>
                        </div>
                    </div>
                    <p className="mt-8 text-slate-500 text-sm font-medium tracking-widest uppercase">
                        Secure 256-bit SSL encryption applied.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Subscription;
