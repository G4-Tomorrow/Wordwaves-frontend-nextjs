"use client"

import http from '@/utils/http';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';
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
            localStorage.removeItem('accessToken');
            router.push('/sign-in');
        } catch (err) {
            console.error('Error during logout:', err);
        }
    };

    const refreshToken = async () => {
        try {
            
            const response = await http.get<{ code: number; result: { accessToken: string } }>('/auth/refresh');

           
            if (response.data.code === 1000) {
                const newAccessToken = response.data.result.accessToken;
              
                localStorage.setItem('accessToken', newAccessToken); 
             
            } else {
                throw new Error('Failed to refresh access token');
            }
        } catch (err) {
           
            setError('Failed to refresh authentication');
          
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
        const token = localStorage.getItem('accessToken');

        if (token) {
            fetchUserInfo(token);
        } else {
            setLoading(false);
        }

        const refreshInterval = setInterval(() => {
            refreshToken();
        }, 55 * 60 * 1000); 

        return () => clearInterval(refreshInterval);
    }, []);


    return (
        <AuthContext.Provider value={{ user, loading, error, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
