import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkUser = async () => {
        try {
            const { data } = await api.get('/auth/profile');
            setUser(data);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password) => {
        try {
            const { data } = await api.post('/auth/login', { username, password });
            setUser(data);
            return data;
        } catch (error) {
            // Demo Login Fallback
            const demoUserStr = localStorage.getItem('demo_user');
            if (demoUserStr) {
                const demoUser = JSON.parse(demoUserStr);
                if (username === demoUser.username && password === demoUser.password) {
                    const userData = {
                        _id: 'demo-admin-id',
                        username: demoUser.username,
                        role: demoUser.role,
                        fullName: demoUser.name, // Map name to fullName for consistency
                        email: demoUser.email,
                        company: demoUser.companyName
                    };
                    setUser(userData);
                    return userData;
                }
            }
            throw error;
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
            setUser(null);
        } catch (error) {
            console.error('Logout failed', error);
            // Even if API fails, clear local state
            setUser(null);
        }
    };

    useEffect(() => {
        checkUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, checkUser, setUser }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
