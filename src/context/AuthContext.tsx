"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
import http from '@/utils/http';
import { useRouter } from 'next/navigation';
import Cookies from "js-cookie";
interface User {
    id: string;
    email: string;
    fullName: string | null;
    avatarName: string | null;
    roles: Array<{ name: string }>;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const token = localStorage.getItem("accessToken");

    const logout = async () => {
        try {
            await http.post('/auth/logout', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUser(null);
            localStorage.removeItem('token');
            router.push('/sign-in');
        } catch (err) {
            console.error('Error during logout:', err);
        }
    };

    const refreshToken = async () => {
        try {
            const refreshToken = Cookies.get('refresh_token'); 


            if (!refreshToken) {
                throw new Error('No refresh token found in cookies');
            }

            const response = await http.get<{ code: number; result: { accessToken: string; user: User } }>('/auth/refresh', {
                headers: {
                    'Authorization': `Bearer ${refreshToken}`, 
                },
            });

            if (response.data.code === 1000) {
                localStorage.setItem('token', response.data.result.accessToken);
                fetchUserInfo(response.data.result.accessToken);
                console.log('Token refreshed successfully');
            } else {
                throw new Error('Failed to refresh token');
            }
        } catch (err) {
            console.error('Error refreshing token:', err);
            setError('Failed to refresh authentication');
            setUser(null);
        }
    };



    const fetchUserInfo = async (token: string) => {
        try {
            const response = await http.get<{ code: number; result: User }>('/users/myinfo', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.code === 1000) {
                setUser(response.data.result);
            } else {
                throw new Error('Failed to fetch user info');
            }
        } catch (err) {
            console.error('Error fetching user info:', err);
            setError('Failed to fetch user information');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log('sagsasa',document.cookie);

        if (token) {
            fetchUserInfo(token);
        } else {
            setLoading(false);
        }

       
        const refreshInterval = setInterval(() => {
          

            refreshToken();
        }, 30  * 1000); 

        return () => clearInterval(refreshInterval);
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, error, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
