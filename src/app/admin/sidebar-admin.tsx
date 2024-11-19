"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar-admin";
import { LogoIcon } from "@/app/(app)/sidebar-app";
import {
  IconLayoutDashboard,
  IconSettings,
  IconUsers,
  IconVocabulary,
} from "@tabler/icons-react";
import { ModeToggle } from "@/components/ui/toogle-mode";

const menuItems = [
  { name: "Dashboard", icon: IconLayoutDashboard, href: "/admin" },
  { name: "Users", icon: IconUsers, href: "/admin/users" },
  { name: "Vocabulary", icon: IconVocabulary, href: "/admin/vocabulary" },
  { name: "Settings", icon: IconSettings, href: "/admin/settings" },
];

export function SidebarAdmin() {
  const pathname = usePathname();
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        {open ? (
          <div className="flex items-center justify-between px-4">
            <LogoIcon />
            <SidebarTrigger className="size-4" />
          </div>
        ) : null}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="">Menu</SidebarGroupLabel>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={pathname === item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center ${
                      open ? "justify-start" : "justify-center"
                    }`}
                  >
                    <div className="flex items-center justify-center size-7 rounded-lg">
                      <item.icon className="size-6 font-light" />
                    </div>
                    <span className="group-data-[collapsible=icon]:hidden">
                      {item.name}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-between group-data-[collapsible=icon]:hidden">
          <ModeToggle iconSize="size-[0.8rem]" />
        </div>
        {!open ? (
          <SidebarMenuButton className="hover:bg-transparent active:bg-transparent">
            <SidebarTrigger className="size-4" />
          </SidebarMenuButton>
        ) : null}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
