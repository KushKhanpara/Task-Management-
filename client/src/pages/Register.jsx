import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight, Building, User, Mail, CreditCard, Lock } from 'lucide-react';
import api from '../api/axios';

const Register = () => {
    const [searchParams] = useSearchParams();
    const selectedPlan = searchParams.get('plan') || 'free';
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        plan: selectedPlan,
        companyName: '',
        adminName: '',
        email: '',
        phone: '',
        address: ''
    });
    const [generatedCredentials, setGeneratedCredentials] = useState(null);

    const plans = [
        { id: 'free', name: "Starter", price: "Free", color: "from-slate-700 to-slate-800" },
        { id: 'pro', name: "Yearly Access", price: "$100", color: "from-indigo-600 to-purple-600" },
        { id: 'premium', name: "Lifetime Access", price: "$1000", color: "from-purple-600 to-pink-600" }
    ];

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePurchase = async (e) => {
        e.preventDefault();

        const adminId = `ADMIN-${Math.floor(1000 + Math.random() * 9000)}`;
        const password = Math.random().toString(36).slice(-8).toUpperCase();

        try {
            // Register directly for all plans (paid and free) as requested
            await api.post('/auth/register', {
                fullName: formData.adminName,
                username: adminId,
                password: password,
                company: formData.companyName,
                email: formData.email,
                plan: formData.plan
            });

            setGeneratedCredentials({ adminId, password });
            setStep(3);
        } catch (error) {
            console.error('Registration failed:', error);
            alert(error.response?.data?.message || 'Something went wrong. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="glass-panel max-w-4xl w-full p-8 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">

                {/* Left Side: Progress & Info */}
                <div className="flex flex-col justify-between">
                    <div>
                        <Link to="/" className="text-slate-400 hover:text-white mb-8 inline-block transition-colors">&larr; Back to Home</Link>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            {step === 1 && "Start Your Journey"}
                            {step === 2 && "Company Details"}
                            {step === 3 && "Registration Successful"}
                        </h1>
                        <p className="text-slate-400 mb-8">
                            {step === 1 && "Choose the plan that fits your team."}
                            {step === 2 && "Tell us about your organization."}
                            {step === 3 && "Here are your secure credentials."}
                        </p>
                        <div className="mb-6 flex items-center gap-3">
                            <img src="/logo.png" alt="TaskFlow" className="h-12 w-12 object-contain" />
                            <span className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-purple-500 bg-clip-text text-transparent">TaskFlow</span>
                        </div>
                        {/* Steps Indicator */}
                        <div className="flex items-center space-x-4 mb-8">
                            {[1, 2, 3].map((s) => (
                                <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step >= s ? 'bg-primary-500 text-white' : 'bg-slate-800 text-slate-500 border border-slate-700'
                                    }`}>
                                    {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Plan Preview (Only for steps 1 & 2) */}
                    {step < 3 && (
                        <div className="bg-slate-900/50 p-6 rounded-xl border border-white/5">
                            <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">Selected Plan</h3>
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-2xl font-bold text-white uppercase">{formData.plan}</span>
                                    <span className="text-slate-500 ml-2">{plans.find(p => p.id === formData.plan)?.price}</span>
                                </div>
                                <button onClick={() => setStep(1)} className="text-primary-400 text-sm hover:underline">Change</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Side: Forms */}
                <div className="bg-slate-900/30 p-8 rounded-2xl border border-white/5">
                    {step === 1 && (
                        <div className="space-y-4">
                            {plans.map((plan) => (
                                <div
                                    key={plan.name}
                                    onClick={() => setFormData({ ...formData, plan: plan.id })}
                                    className={`p-4 rounded-xl cursor-pointer border transition-all flex items-center justify-between ${formData.plan === plan.id
                                        ? `bg-gradient-to-r ${plan.color} border-transparent text-white shadow-lg`
                                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'
                                        }`}
                                >
                                    <span className="font-bold">{plan.name}</span>
                                    <span className={formData.plan === plan.id ? 'text-white/90' : 'text-slate-400'}>{plan.price}</span>
                                </div>
                            ))}
                            <button onClick={() => setStep(2)} className="btn-primary w-full mt-6 justify-center">
                                Continue <ArrowRight className="w-4 h-4 ml-2" />
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <form onSubmit={handlePurchase} className="space-y-4">
                            <div>
                                <label className="text-sm text-slate-400 block mb-1">Company Name</label>
                                <div className="relative">
                                    <Building className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                                    <input
                                        type="text" name="companyName" required
                                        className="input-field pl-10" placeholder="Acme Corp"
                                        value={formData.companyName} onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-slate-400 block mb-1">Administrator Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                                    <input
                                        type="text" name="adminName" required
                                        className="input-field pl-10" placeholder="John Doe"
                                        value={formData.adminName} onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-slate-400 block mb-1">Email (for billing)</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                                    <input
                                        type="email" name="email" required
                                        className="input-field pl-10" placeholder="admin@acme.com"
                                        value={formData.email} onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn-primary w-full justify-center">
                                Complete Registration & Setup
                            </button>
                        </form>
                    )}

                    {step === 3 && generatedCredentials && (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Registration Complete!</h3>
                            <p className="text-slate-400 text-sm mb-6">
                                Please save these credentials securely. They will not be shown again.
                            </p>

                            <div className="bg-slate-950 p-6 rounded-lg border border-slate-800 text-left space-y-4 mb-8">
                                <div>
                                    <label className="text-xs text-slate-500 uppercase tracking-wider block mb-1">Admin ID</label>
                                    <div className="font-mono text-lg text-white bg-slate-900 p-2 rounded border border-white/5 flex justify-between items-center">
                                        {generatedCredentials.adminId}
                                        <Lock className="w-4 h-4 text-slate-500" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 uppercase tracking-wider block mb-1">Password</label>
                                    <div className="font-mono text-lg text-primary-400 bg-slate-900 p-2 rounded border border-white/5 flex justify-between items-center">
                                        {generatedCredentials.password}
                                        <Lock className="w-4 h-4 text-slate-500" />
                                    </div>
                                </div>
                            </div>

                            <Link to="/login">
                                <button className="btn-primary w-full justify-center">
                                    Go to Login
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Register;
