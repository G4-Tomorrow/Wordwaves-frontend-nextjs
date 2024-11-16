"use client";
import { IconChevronLeft } from "@tabler/icons-react";
import React, { useState, useContext } from "react";
import { Button } from "antd";
import { AuthContext } from "@/context/AuthContext";
import AddCollectionForm from "@/components/vocabulary/maincontent/addform/add-collection-form";
import VocabularySet from "@/components/vocabulary/maincontent/word-management/vocabulary-set";

type AllCategoriesProps = {
  showAllCollection: boolean;
  showTopicModal: boolean;
  onOpenCollectionDetail: (collection: any) => void;
  groupedVocabularyData: { [categoryName: string]: any[] };
  onSelectPinnedCollection: (folder: any) => void;
  onShowAllCollection: () => void;
  onSetCollectionData: (collection: any) => void;
};

const AllCollection: React.FC<AllCategoriesProps> = ({
  showAllCollection,
  showTopicModal,
  onOpenCollectionDetail,
  groupedVocabularyData,
  onSelectPinnedCollection,
  onShowAllCollection,
  onSetCollectionData,
}) => {
  const [showAddCollectionModal, setShowAddCollectionModal] = useState(false);
  const authContext = useContext(AuthContext);
  const isAdmin = authContext?.isAdmin;
  // sau khi thêm collection thì cập nhật lại dữ liệu ở localstorage và re-render
  const handleCollectionAdded = (newCollection: any) => {
    const currentCollections = JSON.parse(
      localStorage.getItem("collectionsData") || "[]"
    );

    // Thêm bộ sưu tập mới vào mảng hiện tại
    currentCollections.push(newCollection);

    // Lưu mảng bộ sưu tập đã cập nhật vào localStorage
    localStorage.setItem("collectionsData", JSON.stringify(currentCollections));

    onSetCollectionData(currentCollections);
    // Đóng modal
    setShowAddCollectionModal(false);
  };

  const handleShowAddCollectionModal = () => {
    setShowAddCollectionModal((prev) => !prev);
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
            <div key={categoryName} className="mb-8">
              <div className="pl-4 mb-3">
                <h2>{categoryName}</h2>
                <p className="text-sm text-primary">
                  {groupedVocabularyData[categoryName].length} thư mục
                </p>
              </div>
              <div className="flex flex-wrap gap-6 pl-4">
                {groupedVocabularyData[categoryName].map((vocabulary) => (
                  <button
                    onClick={() =>
                      showTopicModal
                        ? onOpenCollectionDetail(vocabulary)
                        : onSelectPinnedCollection(vocabulary)
                    }
                  >
                    <VocabularySet
                      key={vocabulary.id}
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
    </div>
  );
};

export default AllCollection;
