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

export default function ProfilePage() {
  return (
    <div className="flex gap-8">
      <div className=" flex-1">
        <div className="flex flex-col gap-8">
          <div className="space-y-2">
            <div className="text-primary font-semibold ">Tài Khoản</div>
            <div className="flex flex-col gap-6 rounded-2xl bg-background p-4 border- border-2">
              {/* header */}
              <div className="flex gap-4 items-center">
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
                  <div className="">Xem thông tin</div>
                </div>
              </div>
              {/* nap lan dau */}
              <div className="flex flex-col px-4 gap-8">
                <div className="flex gap-2 font-medium">
                  <IconCrown className="text-yellow-500" />
                  <span>Nâng Cấp</span>
                </div>
                <div className="flex gap-2 font-medium">
                  <IconTags className="text-primary" />
                  <span>Nhập Mã Mua Hàng</span>
                </div>
                <div className="flex gap-2 font-medium">
                  <IconHistory className="text-primary" />
                  <span>Lịch Sử Mua Hàng</span>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-primary font-semibold">Cộng Đồng</div>
            <div className="flex flex-col gap-6 rounded-2xl bg-background p-4 border- border-2">
              {/* nap lan dau */}
              <div className="flex flex-col px-4 gap-8">
                <div className="flex gap-2 font-medium">
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
              <div className="flex flex-col px-4 gap-8">
                <div className="flex items-center justify-between gap-2 font-medium">
                  <div>Giao diện</div>
                  <ModeToggle />
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-primary font-semibold ">Thông Báo</div>
            <div className="flex flex-col gap-6 rounded-2xl bg-background p-4 border- border-2">
              <div className="flex flex-col px-4 gap-8">
                <div className="flex gap-2 font-medium">
                  <IconBellFilled className="text-primary" />
                  <span>Nhắc nhở luyện tập hằng ngày</span>
                </div>
                <div className="flex justify-between font-medium">
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
            <div className="flex flex-col gap-6 rounded-2xl bg-background p-4 border- border-2">
              <div className="flex flex-col px-4 gap-8">
                <div className="flex gap-2 font-medium">
                  <IconCategory className="text-primary" />
                  <span>Chọn danh mục yêu thích</span>
                </div>
                <div className="flex gap-2 font-medium">
                  <IconBarbellFilled className="text-primary" />
                  <span>Cấu hình luyện tập</span>
                </div>
                <div className="flex gap-2 font-medium">
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
