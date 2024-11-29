"use client";

import http from "@/utils/http";
import { useRouter, usePathname } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

export interface User {
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
  isAdmin: boolean;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  const protectedRoutes = ["/", "/vocabulary", "/profile", "/dashboard"];
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const logout = async () => {
    try {
      await http.post("/auth/logout", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("collectionsData");
      localStorage.removeItem("pinnedFolders");
      router.push("/sign-in");
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  const refreshToken = async () => {
    try {
      const response = await http.get<{
        code: number;
        result: { accessToken: string };
      }>("/auth/refresh");

      if (response.data.code === 1000) {
        const newAccessToken = response.data.result.accessToken;
        localStorage.setItem("accessToken", newAccessToken);
      } else {
        throw new Error("Failed to refresh access token");
      }
    } catch (err) {
      setError("Failed to refresh authentication");
      logout();
    }
  };

  const fetchUserInfo = async (token: string) => {
    try {
      const response = await http.get<{ code: number; result: User }>(
        "/users/myinfo",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.code === 1000) {
        setUser(response.data.result);
      } else {
        throw new Error("Failed to fetch user info");
      }
    } catch (err) {
      console.error("Error fetching user info:", err);
      setError("Failed to fetch user information");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = user?.roles.some((role) => role.name === "ADMIN") || false;

  useEffect(() => {
    // Kiểm tra token trên các route được bảo vệ
    if (protectedRoutes.includes(pathname) && !token) {
      router.push("/sign-in");
    }
  }, [pathname, token]);

  useEffect(() => {
    if (token) {
      fetchUserInfo(token);
    } else {
      setLoading(false);
    }

    const refreshInterval = setInterval(() => {
      refreshToken();
    }, 55 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, loading, error, isAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
