"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import {
  IconBrandYoutubeFilled,
  IconChartDotsFilled,
  IconChevronLeft,
  IconChevronRight,
  IconCircleCheckFilled,
  IconClockFilled,
  IconPlant,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import VocabularySetsList from "./vocabulary-setslist";
import { useEffect, useState } from "react";
import VocabularySet, {
  VocabularySetProps,
} from "@/app/(app)/vocabulary/vocabulary-set";
import vocabularyData from "./test-data";

// const TooltipProvider = dynamic(
//   () => import("@/components/ui/tooltip").then((mod) => mod.TooltipProvider),
//   { ssr: false }
// );
// const Tooltip = dynamic(
//   () => import("@/components/ui/tooltip").then((mod) => mod.Tooltip),
//   { ssr: false }
// );
// const TooltipTrigger = dynamic(
//   () => import("@/components/ui/tooltip").then((mod) => mod.TooltipTrigger),
//   { ssr: false }
// );
// const TooltipContent = dynamic(
//   () => import("@/components/ui/tooltip").then((mod) => mod.TooltipContent),
//   { ssr: false }
// );

const MainContent: React.FC = () => {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [pinnedFolders, setPinnedFolders] = useState<any>([]);
  const [isSelectingPinnedFolder, setIsSelectingPinnedFolder] = useState(false);
  const router = useRouter();

  const handleShowAllCategories = () => {
    setShowAllCategories(!showAllCategories);
  };

  const handleSelectPinnedFolderClick = () => {
    setIsSelectingPinnedFolder(true);
    setShowAllCategories(true);
  };

  const handleSelectPinnedFolder = (folder: any) => {
    if (isSelectingPinnedFolder) {
      // Chỉ thực hiện ghim nếu đang chọn thư mục để pin
      setPinnedFolders([folder]);
      setIsSelectingPinnedFolder(false); // Tắt chế độ chọn folder
      setShowAllCategories(false); // Đóng danh mục
    } else {
      // Các hành động khác khi không phải là chọn folder để ghim
      console.log("Thực hiện các hành động khác với thư mục:", folder);
      // Ví dụ: nếu muốn người dùng xem chi tiết
      // router.push(`/folder/${folder.id}`); // Điều hướng đến trang chi tiết thư mục
    }
  };

  return (
    <div className="mt-10 p-2 flex gap-8 !pr-0">
      {/* Left Section */}
      <div className="flex flex-col w-[35%] flex-grow-0 pt-2">
        <div className="bg-white px-4 py-5 rounded-2xl mb-5">
          <h3 className="text-base font-semibold">
            Khám phá hơn 50,000 từ vựng tiếng Anh thông dụng nhất
          </h3>
          <div className="grid grid-cols-2 gap-4 w-full mt-4 text-primary">
            <button
              className="bg-[#f4f7fc] px-3 py-2.5 rounded-lg hover:bg-gray-200 focus:outline-none flex flex-col gap-1 items-center shadow-[0px_1px_1px_rgba(221,_221,_221,_1),_0_3px_1px_rgba(204,_204,_204,_1)]"
              onClick={handleShowAllCategories}
            >
              <IconChartDotsFilled />
              <p>Từ vựng theo Chủ đề</p>
            </button>
            <button
              className="bg-[#f4f7fc] px-3 py-2.5 rounded-lg hover:bg-gray-200 focus:outline-none flex flex-col gap-1 items-center shadow-[0px_1px_1px_rgba(221,_221,_221,_1),_0_3px_1px_rgba(204,_204,_204,_1)]"
              onClick={() => {
                router.push("/content");
              }}
            >
              <IconBrandYoutubeFilled />
              <p>Từ vựng trong Video</p>
            </button>
          </div>
        </div>

        {/* Pinned Folder Section */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3 text-[17px]">
            <h3 className="font-semibold">Thư mục đã ghim</h3>
            <button
              className="bg-primary text-white p-2 rounded-xl focus:outline-none"
              onClick={handleSelectPinnedFolderClick}
            >
              {pinnedFolders.length > 0
                ? "Chọn thư mục khác"
                : "Chọn thư mục để ghim"}
            </button>
          </div>

          {pinnedFolders.length > 0 ? (
            pinnedFolders.map((folder: any, index: number) => (
              <div className="flex flex-col gap-3 justify-center bg-white p-4 rounded-xl relative">
                <div key={index} className="flex gap-3">
                  <Image
                    src={folder.thumbnail}
                    width={100}
                    height={100}
                    alt="folder"
                    className="w-16 h-16 rounded-full border-[7.5px] border-[#A5E3BB] bg-white p-[5px]"
                  />
                  <div className="w-full flex flex-col justify-around items-start">
                    <p className="font-semibold">{folder.progress}</p>
                    <div className="text-xs text-gray-500 flex gap-2 font-semibold">
                      <div className="flex items-center text-[#0088E6] gap-1">
                        <IconCircleCheckFilled width={19} height={19} />
                        <p className="mt-0.5">
                          {folder.completed}/{folder.total} đã học
                        </p>
                      </div>
                      <div className="flex items-center text-primary gap-1">
                        <IconClockFilled width={19} height={19} />
                        <p className="mt-0.5">
                          {folder.timeLeft} cần luyện tập
                        </p>
                      </div>
                      <button className="absolute top-5 right-5">
                        <IconChevronRight width={21} height={21} />
                      </button>
                    </div>
                  </div>
                </div>
                {/* <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger> */}
                <button
                  className="bg-[#0088E6] w-full text-white px-4 py-2.5 flex justify-center gap-2 rounded-lg focus:outline-none shadow-[0px_1px_1px_rgba(221,_221,_221,_1),_0_3px_1px_rgba(204,_204,_204,_1)]"
                  onClick={() => {
                    console.log("học từ mới đi em");
                  }}
                >
                  <IconPlant />
                  Học từ mới
                </button>
                {/* </TooltipTrigger>
                        <TooltipContent className="mb-2 bg-slate-800 text-white">
                          <p>
                            Học các từ mới, bao gồm cả những từ chưa hoàn thành
                            100%
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider> */}
              </div>
            ))
          ) : (
            <p>Chưa có thư mục nào được ghim.</p>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex-grow w-[60%]">
        <VocabularySetsList onShowAllCategories={handleShowAllCategories} />
      </div>

      {/* Show All Categories Modal */}
      {
        <div
          className={`fixed inset-0 bg-white z-50 transition-opacity transform duration-300 ease-in-out ${
            showAllCategories
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-full pointer-events-none"
          }`}
          style={{ overflowY: "auto" }}
        >
          <div className="flex flex-col bg-primary text-white text-base">
            <div className="flex px-5 pt-5 gap-3 items-center">
              <button
                onClick={handleShowAllCategories}
                className="font-bold hover:text-gray-800"
              >
                <IconChevronLeft size={30} />
              </button>
              <h1 className="font-bold">Bộ từ vựng được biên soạn</h1>
            </div>
            <p className="p-3 ml-1">
              Lingoland đồng bộ việc học theo "từ", ví dụ khi bạn học từ "land"
              ở thư mục A thì các thư mục khác chứa từ "land" cũng sẽ được cập
              nhật trạng thái học tương ứng.
            </p>
          </div>

          <div className="px-[68px] py-10">
            {vocabularyData.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-8">
                <h3 className="font-semibold ml-0.5">
                  {category.categoryTitle}
                </h3>
                <p className="text-sm text-primary mb-2">
                  {category.vocabularies.length} thư mục
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-6">
                  {category.vocabularies.map((vocab, vocabIndex) => (
                    <button onClick={() => handleSelectPinnedFolder(vocab)}>
                      <VocabularySet
                        key={vocab.title}
                        title={vocab.title}
                        thumbnail={vocab.thumbnail}
                        level={vocab.level}
                        progress={vocab.progress}
                        completed={vocab.completed}
                        total={vocab.total}
                        timeLeft={vocab.timeLeft}
                        crown={vocab.crown}
                        width={64}
                        height={52}
                      />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      }
    </div>
  );
};

export default MainContent;
