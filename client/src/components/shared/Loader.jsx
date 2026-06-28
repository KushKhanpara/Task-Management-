import React from 'react';
import { motion } from 'framer-motion';

const Loader = () => {
    return (
        <div className="flex items-center justify-center h-full min-h-[400px] w-full">
            <div className="relative">
                {/* Outer Ring */}
                <motion.div
                    className="w-16 h-16 rounded-full border-4 border-t-transparent border-primary-500"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />

                {/* Inner Ring */}
                <motion.div
                    className="absolute top-2 left-2 w-12 h-12 rounded-full border-4 border-b-transparent border-purple-500"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />

                {/* Center Dot Pulse */}
                <motion.div
                    className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                />
            </div>
        </div>
    );
};

export default Loader;
