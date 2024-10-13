"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import http from "@/utils/http";
import { useAuth } from "@/context/AuthContext";

interface User {
  id: string;
  email: string;
  fullName: string | null;
  avatarName: string | null;
  roles: {
    name: string;
    permissions: string[];
  }[];
  createdAt: string;
  updatedAt: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const { logout } = useAuth();
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const fetchUserById = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("Không tìm thấy token.");
      return;
    }

    if (!user) {
      setError("Không tìm thấy thông tin user.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await http.get(`/users/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(response.data);
    } catch (error: any) {
      setError(error.response?.data?.message || "Có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="h-[90vh] flex justify-center items-center">
        <p>Không có thông tin người dùng.</p>
      </div>
    );
  }

  return (
    <div className="h-[90vh] flex flex-col justify-center items-center space-y-6">
      <div className="p-8 bg-gray-100 rounded shadow-md max-w-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Thông tin người dùng</h2>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
      
      </div>

      <button
        onClick={fetchUserById}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? "Đang lấy thông tin..." : "Lấy thông tin người dùng"}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
