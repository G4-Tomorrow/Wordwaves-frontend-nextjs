"use client";

import React from "react";
import { SidebarAdmin } from "@/app/admin/sidebar-admin";
import { SidebarProvider } from "@/components/ui/sidebar-admin";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();

  // Hiển thị "Loading..." trong khi đang kiểm tra quyền
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Hiển thị thông báo không có quyền nếu không phải ADMIN
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen text-center">
        <div>
          <h1 className="text-2xl font-bold">Không có quyền truy cập</h1>
          <p className="text-gray-600 mb-4">Bạn không có quyền truy cập vào trang này.</p>
          <button
            onClick={() => router.push("/sign-in")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Quay về trang Đăng nhập
          </button>
        </div>
      </div>
    );
  }

  // Hiển thị layout nếu có quyền
  return (
    <SidebarProvider>
      <div className="flex w-full h-screen overflow-hidden">
        <SidebarAdmin />
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="w-full py-6">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
