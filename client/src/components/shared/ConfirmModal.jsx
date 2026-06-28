import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
            <div className="relative bg-slate-900 border border-red-500/30 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all scale-100 opacity-100 ring-1 ring-red-500/20">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-orange-500 to-red-600"></div>

                <div className="p-6 pt-8 text-center relative z-10">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                        <AlertTriangle className="text-red-500" size={32} />
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                        {message}
                    </p>

                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={onCancel}
                            className="px-5 py-2.5 rounded-xl text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white transition-all font-medium text-sm border border-slate-700"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white shadow-lg shadow-red-600/20 transition-all font-medium text-sm flex items-center gap-2 hover:scale-105 active:scale-95"
                        >
                            <Trash2Icon className="w-4 h-4" />
                            Yes, Delete It
                        </button>
                    </div>
                </div>

                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-red-500/5 rounded-full blur-2xl"></div>
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl"></div>
            </div>
        </div>
    );
};

const Trash2Icon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M3 6h18"></path>
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
);

export default ConfirmModal;
