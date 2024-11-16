"use client";
import { IconChevronLeft, IconChevronUp } from "@tabler/icons-react";
import React, { useState, useContext, useEffect, useRef } from "react";
import { Button } from "antd";
import { AuthContext } from "@/context/AuthContext";
import AddCollectionForm from "@/components/vocabulary/maincontent/addform/add-collection-form";
import VocabularySet from "@/components/vocabulary/maincontent/word-management/vocabulary-set";
import useScrollToTop from "@/hooks/useScrollToTop";
type AllCategoriesProps = {
  showAllCollection: boolean;
  showTopicModal: boolean;
  onOpenCollectionDetail: (collection: any) => void;
  groupedVocabularyData: { [categoryName: string]: any[] };
  onSelectPinnedCollection: (folder: any) => void;
  onShowAllCollection: () => void;
  onSetCollectionData: (collection: any) => void;
  selectedCategoryName?: string;
};

const AllCollection: React.FC<AllCategoriesProps> = ({
  showAllCollection,
  showTopicModal,
  onOpenCollectionDetail,
  groupedVocabularyData,
  onSelectPinnedCollection,
  onShowAllCollection,
  onSetCollectionData,
  selectedCategoryName,
}) => {
  const [showAddCollectionModal, setShowAddCollectionModal] = useState(false);
  const [visibleCategories, setVisibleCategories] = useState<{
    [key: string]: boolean;
  }>({});
  const authContext = useContext(AuthContext);
  const isAdmin = authContext?.isAdmin;
  const categoryRef = useRef<{ [categoryName: string]: HTMLDivElement | null }>(
    {}
  );
  const { scrollToTop } = useScrollToTop();

  // Tự động cuộn đến category khi selectedCategoryName thay đổi
  useEffect(() => {
    if (selectedCategoryName && categoryRef.current[selectedCategoryName]) {
      console.log(categoryRef.current[selectedCategoryName]);
      categoryRef.current[selectedCategoryName]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [selectedCategoryName]);

  const handleClickToTop = () => {
    console.log("Button clicked");
    scrollToTop();
  };

  // sau khi thêm collection thì cập nhật lại dữ liệu ở localstorage và re-render
  const handleCollectionAdded = (newCollection: any) => {
    const currentCollections = JSON.parse(
      localStorage.getItem("collectionsData") || "[]"
    );

    currentCollections.push(newCollection);
    localStorage.setItem("collectionsData", JSON.stringify(currentCollections));

    onSetCollectionData(currentCollections);
    setShowAddCollectionModal(false);
  };

  const handleShowAddCollectionModal = () => {
    setShowAddCollectionModal((prev) => !prev);
  };

  useEffect(() => {
    if (groupedVocabularyData) {
      const initialVisibility = Object.keys(groupedVocabularyData).reduce(
        (acc: { [key: string]: boolean }, categoryName) => {
          acc[categoryName] = true;
          return acc;
        },
        {}
      );
      setVisibleCategories(initialVisibility);
    }
  }, [groupedVocabularyData]);

  // Toggle the visibility of vocabulary sets in a category
  const toggleVisibility = (categoryName: string) => {
    setVisibleCategories((prevState) => ({
      ...prevState,
      [categoryName]: !prevState[categoryName], // Toggle the visibility state of the category
    }));
  };

  return (
    <div
      className={`fixed inset-0 bg-white z-50 overflow-y-auto transition-all duration-300 ease-in-out transform dark:bg-[#222222] scrollbar-hide ${
        showAllCollection
          ? "scale-100 opacity-100 pointer-events-auto"
          : "scale-50 opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex flex-col bg-primary text-white text-base relative">
        <div className="flex px-5 pt-5 gap-3 items-center">
          <button
            onClick={onShowAllCollection}
            className="font-bold hover:text-gray-300"
          >
            <IconChevronLeft size={30} />
          </button>
          <h1 className="font-bold">Bộ từ vựng được biên soạn</h1>
        </div>
        <p className="p-3 ml-1">
          WordWaves đồng bộ việc học theo "từ", ví dụ khi bạn học từ "land" ở
          thư mục A thì các thư mục khác chứa từ "land" cũng sẽ được cập nhật
          trạng thái học tương ứng.
        </p>

        {isAdmin && (
          <div className="absolute top-[50%] right-10 translate-y-[-50%]">
            <Button
              onClick={handleShowAddCollectionModal}
              className="bg-primary text-white !p-5 rounded-lg hover:!text-[#16a34a] "
            >
              Thêm bộ sưu tập
            </Button>
          </div>
        )}
      </div>

      {isAdmin && showAddCollectionModal && (
        <AddCollectionForm
          onCollectionAdded={handleCollectionAdded}
          onCloseAddCollectionModal={handleShowAddCollectionModal}
        />
      )}

      <div className="px-16 py-6">
        {groupedVocabularyData &&
        Object.keys(groupedVocabularyData).length > 0 ? (
          Object.keys(groupedVocabularyData).map((categoryName) => (
            <div
              key={categoryName}
              className="mb-8"
              ref={(el) => {
                categoryRef.current[categoryName] = el;
              }}
            >
              <div className="pl-4 mb-3">
                <div>
                  <h2
                    onClick={() => toggleVisibility(categoryName)}
                    className="cursor-pointer text-lg"
                  >
                    {categoryName}
                  </h2>
                  <p className="text-sm text-primary">
                    {groupedVocabularyData[categoryName].length} thư mục
                  </p>
                </div>
                {/* <Button
                  size="small"
                  type="link"
                  onClick={() => toggleCategoryVisibility(categoryName)}
                >
                  {visibleItems[categoryName] ? "Thu gọn" : "Mở rộng"}
                </Button> */}
              </div>
              <div
                className={`flex flex-wrap gap-6 pl-4 transition-all duration-500 ease-in-out transform ${
                  visibleCategories[categoryName]
                    ? "max-h-screen opacity-100 translate-y-0"
                    : "max-h-0 opacity-0 translate-y-[-10px] overflow-hidden"
                }`}
              >
                {groupedVocabularyData[categoryName].map((vocabulary) => (
                  <button
                    onClick={() =>
                      showTopicModal
                        ? onOpenCollectionDetail(vocabulary)
                        : onSelectPinnedCollection(vocabulary)
                    }
                    key={vocabulary.id}
                  >
                    <VocabularySet
                      title={vocabulary.name}
                      thumbnail={vocabulary.thumbnailName}
                      completed={vocabulary.numOfLearnedWord}
                      total={vocabulary.numOfTotalWords}
                      timeLeft={vocabulary.numOfLearningWord}
                      width={64}
                      height={52}
                    />
                  </button>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>Không có dữ liệu để hiển thị</p>
        )}
      </div>
      {/* <Button onClick={handleClickToTop}>
        <IconChevronUp size={30} />
      </Button> */}
    </div>
  );
};

export default AllCollection;
