"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useContext } from "react";
import VocabularySetsList from "@/app/(app)/vocabulary/maincontent/vocabulary-setslist";
import { AuthContext } from "@/context/AuthContext";
import http from "@/utils/http";
import Image from "next/image";
import {
  IconBrandYoutubeFilled,
  IconChartDotsFilled,
  IconChevronRight,
  IconCircleCheckFilled,
  IconClockFilled,
  IconPlant,
} from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";
import AllTopicOfCollection from "./all-topic-of-collection";
import AllCollection from "@/app/(app)/vocabulary/maincontent/all-collection";

const MainContent: React.FC = () => {
  const [showAllCollection, setShowAllCollection] = useState(false);
  const [pinnedCollections, setPinnedCollections] = useState<any[]>([]);
  const [isSelectingPinnedCollection, setIsSelectingPinnedCollection] =
    useState(false);
  const [collectionData, setCollectionData] = useState<any[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<any | null>(
    null
  );
  const [openedFromPinned, setOpenedFromPinned] = useState(false);
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

    const cachedPinnedCollections = localStorage.getItem("pinnedCollections");
    if (cachedPinnedCollections) {
      setPinnedCollections(JSON.parse(cachedPinnedCollections));
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

  const handleShowAllCollection = () => {
    setShowAllCollection((prev) => !prev);
    setShowTopicModal(false);
  };

  const handleOpenCollectionDetail = (collection: any) => {
    setSelectedCollection(collection);
    setShowTopicModal(true);
    setShowAllCollection(false);
  };

  const handleOpenCollectionFromPinned = (collection: any) => {
    setSelectedCollection(collection);
    setOpenedFromPinned(true);
    setShowTopicModal(true);
  };

  const handleSelectPinnedCollectionClick = () => {
    setIsSelectingPinnedCollection(true);
    setShowAllCollection(true);
  };

  const handleSelectPinnedCollection = (collection: any) => {
    if (isSelectingPinnedCollection) {
      setPinnedCollections([collection]);
      localStorage.setItem("pinnedCollections", JSON.stringify([collection]));
      setIsSelectingPinnedCollection(false);
      setShowAllCollection(false);
    } else {
      handleOpenCollectionDetail(collection); // mở các topic của collection
      setShowTopicModal(true);
    }
  };

  const closeTopicModal = () => {
    if (openedFromPinned) {
      setShowTopicModal(false);
      setShowAllCollection(false);
    } else {
      setShowTopicModal(false);
      setShowAllCollection(true);
    }
    setOpenedFromPinned(false);
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
              onClick={handleShowAllCollection}
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

        {/* Pinned Collection Section */}
        <div className="lg:w-4/5 xl:w-full">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Bộ sưu tập đã ghim</h3>
            <button
              className="bg-primary text-white p-2 rounded-xl"
              onClick={handleSelectPinnedCollectionClick}
            >
              {pinnedCollections.length > 0
                ? "Chọn bộ sưu tập khác"
                : "Chọn bộ sưu tập để ghim"}
            </button>
          </div>

          {pinnedCollections.length > 0 ? (
            pinnedCollections.map((collection, index) => (
              <div
                key={index}
                className="flex flex-col gap-3 justify-center bg-white p-4 rounded-xl relative dark:bg-[#222222]"
              >
                <div className="flex gap-3">
                  <Image
                    src={collection.thumbnail}
                    width={100}
                    height={100}
                    alt="collection"
                    className="w-16 h-16 rounded-full border-[7.5px] border-[#A5E3BB] bg-white p-[5px]"
                  />
                  <div className="w-full flex flex-col justify-around items-start">
                    <p className="font-semibold text-lg">{collection.name}</p>
                    <div className="text-xs text-gray-500 flex gap-2 font-semibold">
                      <div className="flex items-center text-[#0088E6] gap-1">
                        <IconCircleCheckFilled width={19} height={19} />
                        <p className="mt-0.5 tracking-[0.1em]">
                          {collection.numOfLearnedWord}/
                          {collection.numOfTotalWords} đã học
                        </p>
                      </div>
                      <div className="flex items-center text-primary gap-1">
                        <IconClockFilled width={19} height={19} />
                        <p className="mt-0.5">
                          {collection.numOfLearningWord} cần luyện tập
                        </p>
                      </div>
                      <button
                        className="absolute top-5 right-5"
                        onClick={() =>
                          handleOpenCollectionFromPinned(collection)
                        }
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
            <p>Chưa có bộ sưu tập nào được ghim.</p>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="col-span-2 justify-center lg:pl-0 xl:pl-6 w-full">
        {loading ? (
          <div className="flex flex-col space-y-3 pt-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
            <div className="flex space-x-3">
              <Skeleton className="h-[150px] w-[250px] rounded-xl" />
              <Skeleton className="h-[150px] w-[250px] rounded-xl" />
              <Skeleton className="h-[150px] w-[250px] rounded-xl" />
            </div>
          </div>
        ) : (
          <VocabularySetsList
            onShowAllCollection={handleShowAllCollection}
            groupedVocabularyData={groupedCollectionData}
          />
        )}
      </div>

      {/* Show All Collection Modal */}
      <AllCollection
        showAllCollection={showAllCollection}
        groupedVocabularyData={groupedCollectionData}
        handleSelectPinnedCollection={handleSelectPinnedCollection}
        handleShowAllCollection={handleShowAllCollection}
      />

      {/* Show Topic Modal */}
      <AllTopicOfCollection
        showTopicModal={showTopicModal}
        selectedCollection={selectedCollection}
        handleShowTopicModal={closeTopicModal}
      />
    </div>
  );
};

export default MainContent;
