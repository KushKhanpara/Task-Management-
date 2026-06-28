import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const sessionId = searchParams.get('session_id');
    const isRegistration = searchParams.get('reg') === 'true';
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            if (sessionId) {
                try {
                    const { data } = await axios.get(`http://localhost:5000/api/payments/session/${sessionId}`);
                    setOrderDetails(data);
                } catch (error) {
                    console.error('Error fetching session:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [sessionId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel max-w-lg w-full p-10 text-center relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-emerald-500"></div>

                <div className="flex justify-center mb-8">
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
                        <FiCheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-white mb-4">Payment Successful!</h1>
                <p className="text-slate-400 mb-8">
                    {isRegistration
                        ? "Your company account has been created successfully. Below are your administrative credentials. PLEASE SAVE THESE."
                        : "Thank you for upgrading! Your subscription is now active."}
                </p>

                {isRegistration && orderDetails?.metadata && (
                    <div className="bg-slate-900/50 rounded-2xl p-6 mb-8 border border-white/5 text-left">
                        <div className="mb-4">
                            <label className="text-slate-500 text-xs uppercase tracking-wider font-bold mb-1 block">Admin ID (Username)</label>
                            <p className="text-white text-lg font-mono bg-slate-950 p-3 rounded-lg border border-white/5">{orderDetails.metadata.adminId}</p>
                        </div>
                        <div>
                            <label className="text-slate-500 text-xs uppercase tracking-wider font-bold mb-1 block">Secret Password</label>
                            <p className="text-white text-lg font-mono bg-slate-950 p-3 rounded-lg border border-white/5">{orderDetails.metadata.password}</p>
                        </div>
                    </div>
                )}

                <div className="flex flex-col gap-4">
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                    >
                        Sign In to Your Dashboard <FiArrowRight />
                    </button>
                    <Link to="/" className="text-slate-500 hover:text-white text-sm transition-colors">
                        Back to Home
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default PaymentSuccess;
