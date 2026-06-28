import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Bell } from 'lucide-react';
import { io } from 'socket.io-client';
import api from '../../api/axios';

const Header = ({ currentPageLabel }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const socketRef = useRef();

    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        if (!user) return;

        // Setup Socket
        // In dev, vite proxy forwards /socket.io to backend. 
        // socket.io-client tries to connect to window.location.host by default which is fine via proxy.
        // Or we might need to specify path: '/socket.io' explicitly if default doesn't work.
        const socket = io('/', { path: '/socket.io' });
        socketRef.current = socket;

        socket.emit('join', user._id);
        if (user.role === 'admin') {
            socket.emit('join_admin');
        }

        const fetchNotifications = async () => {
            try {
                const { data } = await api.get('/notifications');
                setNotifications(data);
            } catch (error) {
                console.error('Failed to fetch notifications');
            }
        };

        socket.on('notification', (notification) => {
            setNotifications(prev => [notification, ...prev]);
        });

        // Fetch existing notifications
        fetchNotifications();

        return () => {
            socket.disconnect();
        };
    }, [user]);

    const toggleNotifications = async () => {
        if (!showNotifications && unreadCount > 0) {
            try {
                await api.put('/notifications/read-all');
                setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            } catch (err) {
                console.error('Failed to mark read', err);
            }
        }
        setShowNotifications(!showNotifications);
    };

    return (
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-8">
            <h2 className="text-lg font-semibold text-slate-200">
                {currentPageLabel}
            </h2>
            <div className="flex items-center gap-4">
                {/* Company Name Display */}
                {user?.company && (
                    <div className="hidden md:block mr-6">
                        <h1 className="text-xl font-bold bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent uppercase tracking-wider">
                            {user.company}
                        </h1>
                    </div>
                )}

                {/* Notification Bell */}
                <div className="relative">
                    <button
                        onClick={toggleNotifications}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg relative"
                    >
                        <Bell size={20} />
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-slate-900"></span>
                        )}
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 top-full mt-2 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden z-50">
                            <div className="p-3 border-b border-slate-700 bg-slate-800/50">
                                <h3 className="font-semibold text-white text-sm">Notifications</h3>
                            </div>
                            <div className="max-h-[300px] overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center text-slate-500 text-sm">No notifications</div>
                                ) : (
                                    notifications.map((n, i) => (
                                        <div key={i} className={`p-4 border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors ${!n.read ? 'bg-slate-700/20' : ''}`}>
                                            <p className="text-sm text-slate-300">{n.message}</p>
                                            <span className="text-xs text-slate-500 mt-1 block">
                                                {new Date(n.createdAt).toLocaleTimeString()}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <Link to="/profile" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-white">{user?.fullName}</p>
                        <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm overflow-hidden border-2 border-slate-700 shadow-lg">
                        {user?.image ? (
                            <img src={user.image} loading="lazy" alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span>{user?.fullName?.charAt(0)}</span>
                        )}
                    </div>
                </Link>
            </div>
        </header>
    );
};

export default Header;
