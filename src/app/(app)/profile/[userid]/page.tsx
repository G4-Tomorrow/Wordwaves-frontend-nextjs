"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
// import { useAuth } from "@/context/AuthContext";
import { IconCopy, IconEdit } from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export default function ProfilePage({
  params,
}: {
  params: { userid: string };
}) {
  const router = useRouter();
  const [copying, setCopying] = useState(false);
  //   const { user, logout } = useAuth();

  //   // Kiểm tra xem người dùng có quyền xem trang này không
  //   if (user?.id !== params.userid) {
  //     router.push("/");
  //     return null;
  //   }

  //   const handleLogout = async () => {
  //     await logout();
  //     router.push("/login");
  //   };

  const MOCK_USER = {
    id: "KJ@#HD@",
    name: "User8386 handsome vjppro",
    avatarUrl:
      "https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/474082Kvj/avt-de-thuong-cute_044342433.jpg",
  };

  const handleCopyUserId = async () => {
    setCopying(true);
    try {
      await navigator.clipboard.writeText(MOCK_USER.id);
      toast({
        description: "Đã sao chép UserId thành công!",
      });
    } catch (err) {
      toast({
        description: "Không thể sao chép UserId. Vui lòng thử lại.",
      });
    } finally {
      setCopying(false);
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-primary font-semibold text-2xl mb-6">
        Thông tin tài khoản
      </h1>
      <div className="bg-white shadow-md rounded-lg p-6 mx-auto">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-4">
            <span>UserId: </span>
            <span className="font-semibold">{MOCK_USER.id}</span>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleCopyUserId}
              className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
              disabled={copying}
            >
              <IconCopy className="w-4 h-4 text-gray-600" />
            </Button>
          </div>
          <div className="relative mb-4">
            <Image
              src={MOCK_USER.avatarUrl}
              alt="Avatar"
              width={120}
              height={120}
              className="rounded-full"
            />
            <Link
              href={`/profile/${MOCK_USER.id}`}
              className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md"
            >
              <IconEdit className="text-primary w-5 h-5" />
            </Link>
          </div>
          <h2 className="text-xl mb-4 text-center max-w-[20rem] line-clamp-1">
            {MOCK_USER.name}
          </h2>
          <Button
            variant="ghost"
            className="w-[20rem] border text-destructive hover:text-destructive border-red-500"
          >
            Đăng xuất
          </Button>
        </div>
      </div>
    </div>
  );
}
