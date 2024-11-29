"use client";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useState,
  useCallback,
  useContext,
  useRef,
  useMemo,
} from "react";
import { AuthContext } from "@/context/AuthContext";
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
import VocabularySetsList from "@/components/vocabulary/maincontent/word-management/vocabulary-setslist";
import AllCollection from "@/components/vocabulary/maincontent/all-entities/all-collection";
import AllTopicOfCollection from "@/components/vocabulary/maincontent/all-entities/all-topic-of-collection";
import useLocalStorage from "@/hooks/useLocalStorage";
import { fetchCollections } from "@/lib/api";

const MainContent: React.FC = () => {
  const [showAllCollection, setShowAllCollection] = useState(false);
  const [collectionData, setCollectionData] = useLocalStorage<any[]>(
    "collectionsData",
    []
  );
  const [pinnedCollections, setPinnedCollections] = useLocalStorage<any[]>(
    "pinnedCollections",
    []
  );
  const [isSelectingPinnedCollection, setIsSelectingPinnedCollection] =
    useState(false);
  const [selectedCollection, setSelectedCollection] = useState<any | null>(
    null
  );
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>("");
  const [openedFromPinned, setOpenedFromPinned] = useState(false);
  const router = useRouter();
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchCollectionData = useCallback(async () => {
    if (!user) return;

    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      setLoading(true);
      const collections = await fetchCollections({
        page: 1,
        size: 20,
        token,
        // userId: user.roles.some((role) => role.name === "USER") ? user.id : "",
      });

      setCollectionData(collections.data);
    } catch (error) {
      console.error("Error fetching collections:", error);
    } finally {
      setLoading(false);
    }
  }, [user, loading, collectionData, setCollectionData]);

  useEffect(() => {
    if (user) {
      fetchCollectionData();
    }
  }, [user]);

  const handleShowAllCollection = (categoryName?: string) => {
    setShowAllCollection((prev) => !prev);
    setShowTopicModal(false);

    if (categoryName) {
      setSelectedCategoryName(categoryName);
    } else {
      console.log("No category selected");
    }
  };

  const handleOpenCollectionDetail = (collection: any) => {
    setSelectedCollection(collection);
    setShowAllCollection(false);
    setShowTopicModal(true);
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
      handleOpenCollectionDetail(collection);
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

  const groupedCollectionData = useMemo(() => {
    return collectionData.reduce((acc, collection) => {
      const categoryName =
        collection.wordCollectionCategory?.name || "Uncategorized";
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(collection);
      return acc;
    }, {} as { [key: string]: any[] });
  }, [collectionData]);

  return (
    <div className="w-full mt-10 grid lg:grid-cols-1 lg:gap-5 xl:gap-0 xl:grid-cols-3 xl:justify-items-center overflow-x-hidden">
      {/* Left Section */}
      <div className="flex flex-col pt-2 w-full lg:items-center">
        <div className="bg-white px-4 py-5 rounded-2xl mb-5 dark:bg-[#222222]">
          <h3 className="text-base font-semibold">
            Khám phá hơn 50,000 từ vựng tiếng Anh thông dụng nhất
          </h3>
          <div className="grid grid-cols-2 gap-4 w-full mt-4 text-primary ">
            <button
              className="bg-[#f4f7fc] dark:bg-[#222222] px-3 py-2.5 rounded-lg hover:bg-gray-200 focus:outline-none flex flex-col gap-1 items-center shadow"
              onClick={() => handleShowAllCollection()}
            >
              <IconChartDotsFilled />
              <p>
                Từ vựng theo <br />
                Chủ đề
              </p>
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
                    src={collection.thumbnailName || "/defaultCollection.png"}
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
      <div className="col-span-2 justify-center lg:pl-0 xl:pl-5 w-full">
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
            onOpenCollectionDetail={handleOpenCollectionDetail}
          />
        )}
      </div>

      {/* Show All Collection Modal */}
      <AllCollection
        showAllCollection={showAllCollection}
        showTopicModal={showTopicModal}
        onOpenCollectionDetail={handleOpenCollectionDetail}
        groupedVocabularyData={groupedCollectionData}
        onSelectPinnedCollection={handleSelectPinnedCollection}
        onShowAllCollection={handleShowAllCollection}
        onSetCollectionData={setCollectionData}
        selectedCategoryName={selectedCategoryName}
      />

      {/* Show Topic Modal */}
      <AllTopicOfCollection
        showTopicModal={showTopicModal}
        selectedCollection={selectedCollection}
        handleCloseTopicModal={closeTopicModal}
      />
    </div>
  );
};

export default MainContent;
