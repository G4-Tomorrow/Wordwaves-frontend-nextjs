import { Switch } from "@/components/ui/switch";
import { ModeToggle } from "@/components/ui/toogle-mode";
import {
  IconBarbellFilled,
  IconBellFilled,
  IconCategory,
  IconCrown,
  IconFlame,
  IconHelpOctagon,
  IconHistory,
  IconMessageChatbotFilled,
  IconTags,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

export default function ProfilePage() {
  const MOCK_ID_USER = "8386";
  return (
    <div className="flex gap-8">
      <div className=" flex-1">
        <div className="flex flex-col gap-8">
          <div className="space-y-2">
            <div className="text-primary font-semibold ">Tài Khoản</div>
            <div className="flex flex-col rounded-2xl bg-background p-4 border-2">
              {/* header */}
              <div className="flex gap-4 items-center hover:cursor-pointer hover:bg-gray-100 rounded-lg p-2">
                <Image
                  className="rounded-full h-[3.5rem] w-[3.5rem]"
                  src={
                    "https://i.pinimg.com/736x/bc/43/98/bc439871417621836a0eeea768d60944.jpg"
                  }
                  alt="avt"
                  height={40}
                  width={40}
                ></Image>
                <div>
                  <div className=" font-semibold line-clamp-1">
                    User8386 fdfdfdfd User8386 fdfdfdfd User8386 fdfdfdfd
                    User8386 fdfdfdfd
                  </div>
                  <Link href={`/profile/${MOCK_ID_USER}`}>
                    <div className="">Xem thông tin</div>
                  </Link>
                </div>
              </div>
              {/* nap lan dau */}
              <div className="flex gap-2 font-medium hover:cursor-pointer hover:bg-gray-100 p-2 py-4">
                <IconCrown className="text-yellow-500" />
                <span>Nâng Cấp</span>
              </div>
              {/* nhap ma mua hang */}
              <div className="flex gap-2 font-medium hover:cursor-pointer hover:bg-gray-100 p-2 py-4">
                <IconTags className="text-primary" />
                <span>Nhập Mã Mua Hàng</span>
              </div>
              {/* lich su mua hang */}
              <div className="flex gap-2 font-medium hover:cursor-pointer hover:bg-gray-100 p-2 py-4">
                <IconHistory className="text-primary" />
                <span>Lịch Sử Mua Hàng</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-primary font-semibold">Cộng Đồng</div>
            <div className="flex flex-col gap-6 rounded-2xl bg-background py-4 border-2">
              <div className="flex flex-col px-4 gap-8">
                <div className="flex gap-2 font-medium hover:cursor-pointer hover:bg-gray-100 p-2 py-4">
                  <IconMessageChatbotFilled className="text-primary" />
                  <span>Phản Hồi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div className="flex flex-col gap-8">
          <div className="space-y-2">
            <div className="text-primary font-semibold ">Giao diện</div>
            <div className="flex flex-col gap-6 rounded-2xl bg-background p-4 border- border-2">
              <div className="flex flex-col  gap-8">
                <div className="flex items-center justify-between gap-2 font-medium">
                  <div>Giao diện</div>
                  <ModeToggle />
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-primary font-semibold ">Thông Báo</div>
            <div className="flex flex-col rounded-2xl bg-background p-4 border- border-2">
              <div className="flex flex-col">
                <div className="flex gap-2 font-medium hover:cursor-pointer hover:bg-gray-100 p-2 py-4">
                  <IconBellFilled className="text-primary" />
                  <span>Nhắc nhở luyện tập hằng ngày</span>
                </div>
                <div className="flex justify-between font-medium hover:cursor-pointer hover:bg-gray-100 p-2 py-4">
                  <div className="flex">
                    <IconFlame className="text-primary" />
                    <span>Cảnh báo mất chuỗi streak</span>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className=" flex-1">
        <div className="flex flex-col gap-8">
          <div className="space-y-2">
            <div className="text-primary font-semibold ">Học và luyện tập</div>
            <div className="flex flex-col gap-6 rounded-2xl bg-background py-4 border-2">
              <div className="flex flex-col px-4">
                <div className="flex gap-2 font-medium hover:cursor-pointer hover:bg-gray-100 p-2 py-4">
                  <IconCategory className="text-primary" />
                  <span>Chọn danh mục yêu thích</span>
                </div>
                <div className="flex gap-2 font-medium hover:cursor-pointer hover:bg-gray-100 p-2 py-4">
                  <IconBarbellFilled className="text-primary" />
                  <span>Cấu hình luyện tập</span>
                </div>
                <div className="flex gap-2 font-medium hover:cursor-pointer hover:bg-gray-100 p-2 py-4">
                  <IconHelpOctagon className="text-primary" />
                  <span>Xem hướng dẫn</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
