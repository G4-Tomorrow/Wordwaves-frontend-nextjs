"use client";
import React, { useState } from "react";
import {
  IconBellFilled,
  IconBrandTelegram,
  IconBubble,
  IconCalendarTime,
  IconChartBar,
  IconCrown,
  IconFlame,
  IconFolderOpen,
  IconLayoutDashboard,
  IconNotes,
  IconPlayerPlayFilled,
  IconSettings,
  IconSunFilled,
  IconUserCircle,
} from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";

export default function SidebarApp() {
  const links = [
    {
      label: "Giao Tiếp",
      href: "/",
      icon: <IconBubble className="h-6 w-6 flex-shrink-0" />,
    },
    {
      label: "Từ Vựng",
      href: "/vocabulary",
      icon: <IconNotes className="h-6 w-6 flex-shrink-0" />,
    },
    {
      label: "Nội Dung",
      href: "/content",
      icon: <IconPlayerPlayFilled className="h-6 w-6 flex-shrink-0" />,
    },
    {
      label: "Thống Kê",
      href: "/dashboard",
      icon: <IconChartBar className="h-6 w-6 flex-shrink-0" />,
    },
    {
      label: "Tài Khoản",
      href: "/profile",
      icon: <IconUserCircle className="h-6 w-6 flex-shrink-0" />,
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10 px-4 w-[16rem]">
        <div className="flex flex-col flex-1 items-center overflow-y-auto overflow-x-hidden">
          <div>
            <LogoIcon />
            <div className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-background p-4 mt-8">
              {/* header */}
              <div className="flex gap-4 items-center">
                <Image
                  className="rounded-full h-[2.5rem] w-[2.5rem]"
                  src={
                    "https://i.pinimg.com/736x/bc/43/98/bc439871417621836a0eeea768d60944.jpg"
                  }
                  alt="avt"
                  height={40}
                  width={40}
                ></Image>
                <div>
                  <div className="">Xin Chào</div>
                  <div className=" font-semibold line-clamp-1">
                    User8386 fdfdfdfd User8386 fdfdfdfd User8386 fdfdfdfd
                    User8386 fdfdfdfd
                  </div>
                </div>
              </div>
              {/* nap lan dau */}
              <div className="flex gap-2 font-semibold text-yellow-500">
                <IconCrown />
                <span>Nâng Cấp</span>
              </div>
              {/* point */}
              <div className="flex gap-4">
                <div className="flex gap-1">
                  <IconSunFilled />
                  <span>5</span>
                </div>
                <div className="flex gap-1">
                  <IconFlame />
                  <span>0</span>
                </div>
                <div className="flex gap-1">
                  <IconBellFilled />
                </div>
              </div>
            </div>
            <div className="mt-8 flex flex-col bg-background px-4 rounded-2xl ">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
        </div>
      </SidebarBody>
    </Sidebar>
  );
}

export const LogoIcon = () => {
  return (
    <Link
      href="/"
      className=" text-center font-extrabold text-xl  select-none text-primary"
    >
      <span className="block">WordWares</span>
    </Link>
  );
};
