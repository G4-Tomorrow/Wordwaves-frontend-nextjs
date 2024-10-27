"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useContext } from "react";
import VocabularySetsList from "./vocabulary-setslist";
import { AuthContext } from "@/context/AuthContext";
import http from "@/utils/http";
import AllCategories from "@/app/(app)/vocabulary/maincontent/all-category";
import Image from "next/image";
import {
  IconBrandYoutubeFilled,
  IconChartDotsFilled,
  IconChevronRight,
  IconCircleCheckFilled,
  IconClockFilled,
  IconPlant,
} from "@tabler/icons-react";
import AllTopicOfCollection from "./all-topic-of-category";

const MainContent: React.FC = () => {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [pinnedFolders, setPinnedFolders] = useState<any[]>([]);
  const [isSelectingPinnedFolder, setIsSelectingPinnedFolder] = useState(false);
  const [collectionData, setCollectionData] = useState<any[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<any | null>(
    null
  );
  const router = useRouter();
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token || !user) return;

    const cachedData = localStorage.getItem("collectionsData");
    if (cachedData) {
      setCollectionData(JSON.parse(cachedData));
      setLoading(false);
    } else {
      user.roles.some((role) => role.name === "USER")
        ? getCollectionData(token, user.id)
        : getCollectionData(token);
    }

    const cachedPinnedFolders = localStorage.getItem("pinnedFolders");
    if (cachedPinnedFolders) {
      setPinnedFolders(JSON.parse(cachedPinnedFolders));
    }
  }, [user]);

  const getCollectionData = useCallback(
    async (token: string, userId?: string) => {
      const url = userId
        ? `/collections?pageNumber=1&pageSize=5&userId=${userId}`
        : `/collections?pageNumber=1&pageSize=5`;
      try {
        const response = await http.get<{
          code: number;
          message: string;
          result: { data: any[] };
        }>(url, { headers: { Authorization: `Bearer ${token}` } });
        if (response.data.code === 1000) {
          setCollectionData(response.data.result.data);
          localStorage.setItem(
            "collectionsData",
            JSON.stringify(response.data.result.data)
          );
        } else {
          console.error("Error fetching collection data:", response.data);
        }
      } catch (error) {
        console.error("Error fetching collection data:", error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleShowAllCategories = () => {
    setShowAllCategories((prev) => !prev);
    setShowTopicModal(false);
  };

  const handleOpenCollectionDetail = (collection: any) => {
    setSelectedCollection(collection);
    setShowTopicModal(true);
    setShowAllCategories(false);
  };

  const handleCloseTopicModal = () => {
    setShowTopicModal(false);
    setShowAllCategories(true);
  };

  const handleSelectPinnedFolderClick = () => {
    setIsSelectingPinnedFolder(true);
    setShowAllCategories(true);
  };

  const handleSelectPinnedFolder = (folder: any) => {
    if (isSelectingPinnedFolder) {
      setPinnedFolders([folder]);
      localStorage.setItem("pinnedFolders", JSON.stringify([folder]));
      setIsSelectingPinnedFolder(false);
      setShowAllCategories(false);
    } else {
      handleOpenCollectionDetail(folder);
      setShowTopicModal(true);
    }
  };

  const groupedCollectionData = collectionData.reduce((acc, collection) => {
    const categoryName = collection.wordCollectionCategory.name;
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(collection);
    return acc;
  }, {} as { [key: string]: any[] });

  return (
    <div className="w-full mt-10 grid lg:grid-cols-1 lg:gap-5 xl:gap-0 xl:grid-cols-3 xl:justify-items-start overflow-x-hidden">
      {/* Left Section */}
      <div className="flex flex-col pt-2 w-full lg:items-center">
        <div className="bg-white px-4 py-5 rounded-2xl mb-5 dark:bg-[#222222]">
          <h3 className="text-base font-semibold">
            Khám phá hơn 50,000 từ vựng tiếng Anh thông dụng nhất
          </h3>
          <div className="grid grid-cols-2 gap-4 w-full mt-4 text-primary ">
            <button
              className="bg-[#f4f7fc] dark:bg-[#222222] px-3 py-2.5 rounded-lg hover:bg-gray-200 focus:outline-none flex flex-col gap-1 items-center shadow"
              onClick={handleShowAllCategories}
            >
              <IconChartDotsFilled />
              <p>Từ vựng theo Chủ đề</p>
            </button>
            <button
              className="bg-[#f4f7fc] dark:bg-[#222222] px-3 py-2.5 rounded-lg hover:bg-gray-200 focus:outline-none flex flex-col gap-1 items-center shadow"
              onClick={() => router.push("/content")}
            >
              <IconBrandYoutubeFilled />
              <p>Từ vựng trong Video</p>
            </button>
          </div>
        </div>

        {/* Pinned Folder Section */}
        <div className="lg:w-4/5 xl:w-full">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Thư mục đã ghim</h3>
            <button
              className="bg-primary text-white p-2 rounded-xl"
              onClick={handleSelectPinnedFolderClick}
            >
              {pinnedFolders.length > 0
                ? "Chọn thư mục khác"
                : "Chọn thư mục để ghim"}
            </button>
          </div>

          {pinnedFolders.length > 0 ? (
            pinnedFolders.map((folder, index) => (
              <div
                key={index}
                className="flex flex-col gap-3 justify-center bg-white p-4 rounded-xl relative dark:bg-[#222222]"
              >
                <div className="flex gap-3">
                  <Image
                    src={folder.thumbnail}
                    width={100}
                    height={100}
                    alt="folder"
                    className="w-16 h-16 rounded-full border-[7.5px] border-[#A5E3BB] bg-white p-[5px]"
                  />
                  <div className="w-full flex flex-col justify-around items-start">
                    <p className="font-semibold text-lg">{folder.name}</p>
                    <div className="text-xs text-gray-500 flex gap-2 font-semibold">
                      <div className="flex items-center text-[#0088E6] gap-1">
                        <IconCircleCheckFilled width={19} height={19} />
                        <p className="mt-0.5 tracking-[0.1em]">
                          {folder.numOfLearnedWord}/{folder.numOfTotalWords} đã
                          học
                        </p>
                      </div>
                      <div className="flex items-center text-primary gap-1">
                        <IconClockFilled width={19} height={19} />
                        <p className="mt-0.5">
                          {folder.numOfLearningWord} cần luyện tập
                        </p>
                      </div>
                      <button
                        className="absolute top-5 right-5"
                        onClick={() => handleOpenCollectionDetail(folder)}
                      >
                        <IconChevronRight width={21} height={21} />
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  className="bg-[#0088E6] w-full text-white px-4 py-2.5 flex justify-center gap-2 rounded-lg focus:outline-none shadow"
                  onClick={() => console.log("Learn new words")}
                >
                  <IconPlant />
                  Học từ mới
                </button>
              </div>
            ))
          ) : (
            <p>Chưa có thư mục nào được ghim.</p>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="col-span-2 justify-center lg:pl-0 xl:pl-6 w-full">
        {loading ? (
          <div className="">Loading...</div>
        ) : (
          <VocabularySetsList
            onShowAllCategories={handleShowAllCategories}
            groupedVocabularyData={groupedCollectionData}
          />
        )}
      </div>

      {/* Show All Categories Modal */}
      <AllCategories
        showAllCategories={showAllCategories}
        groupedVocabularyData={groupedCollectionData}
        handleSelectPinnedFolder={handleSelectPinnedFolder}
        handleShowAllCategories={handleShowAllCategories}
      />

      {/* Show Topic Modal */}
      {showTopicModal && selectedCollection && (
        <AllTopicOfCollection
          showTopicModal={showTopicModal}
          selectedCollection={selectedCollection}
          handleCloseTopicModal={handleCloseTopicModal}
        />
      )}
    </div>
  );
};

export default MainContent;
