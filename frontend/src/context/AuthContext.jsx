import { createContext, useContext, useState, useCallback } from 'react';
import { login as apiLogin } from '../api/auth.api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try { return JSON.parse(localStorage.getItem('sms_user')); } catch { return null; }
    });

    const loginFn = useCallback(async (email, password) => {
        const res = await apiLogin({ email, password });
        const { token, user: u } = res.data;
        localStorage.setItem('sms_token', token);
        localStorage.setItem('sms_user', JSON.stringify(u));
        setUser(u);
        return u;
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('sms_token');
        localStorage.removeItem('sms_user');
        setUser(null);
    }, []);

    const isAdmin = user?.role === 'admin';

    return (
        <AuthContext.Provider value={{ user, login: loginFn, logout, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
};
