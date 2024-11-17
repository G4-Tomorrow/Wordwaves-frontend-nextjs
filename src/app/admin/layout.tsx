"use client";

import * as React from "react";

import { SidebarAdmin } from "@/app/admin/sidebar-admin";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar-admin";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
