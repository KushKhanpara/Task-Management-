import React from 'react';
import { motion } from 'framer-motion';
import { FiXCircle, FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const PaymentCancel = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center"
            >
                <div className="flex justify-center mb-6">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                        className="bg-red-100 dark:bg-red-900/30 p-4 rounded-full"
                    >
                        <FiXCircle className="w-16 h-16 text-red-500" />
                    </motion.div>
                </div>

                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
                    Payment Cancelled
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8">
                    Your payment process was cancelled. No charges were made. You can try again whenever you're ready.
                </p>

                <Link
                    to="/subscription"
                    className="inline-flex items-center gap-2 bg-gray-800 dark:bg-gray-700 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-900 dark:hover:bg-gray-600 transition-all duration-300"
                >
                    <FiArrowLeft /> Back to Pricing
                </Link>
            </motion.div>
        </div>
    );
};

export default PaymentCancel;
