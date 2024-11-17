"use client";

import http from "@/utils/http";
import { useRouter } from "next/navigation";
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
  collectionsData: any[];
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
  const [collectionsData, setCollectionsData] = useState<any[]>([]);

  const router = useRouter();

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

  const fetchCollections = async (token: string, userId?: string) => {
    // Kiểm tra nếu user là admin thì không truyền userId
    const url = user?.roles.some((role) => role.name === "ADMIN")
      ? `/collections?pageNumber=1&pageSize=20`
      : `/collections?pageNumber=1&pageSize=20&userId=${userId}`;

    try {
      const response = await http.get<{
        code: number;
        message: string;
        result: { data: any[] };
      }>(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.code === 1000) {
        setCollectionsData(response.data.result.data);
      } else {
        console.error("Error fetching collection data:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching collection data:", error);
    }
  };

  const isAdmin = user?.roles.some((role) => role.name === "ADMIN") || false;

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      fetchUserInfo(token);
      fetchCollections(token, user?.id);
    } else {
      setLoading(false);
    }

    const refreshInterval = setInterval(() => {
      refreshToken();
    }, 55 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, error, isAdmin, collectionsData, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
