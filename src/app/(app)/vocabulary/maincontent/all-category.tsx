import { IconChevronLeft } from "@tabler/icons-react";
import React from "react";
import VocabularySet from "@/app/(app)/vocabulary/maincontent/vocabulary-set";

type AllCategoriesProps = {
  showAllCategories: boolean;
  groupedVocabularyData: { [categoryName: string]: any[] };
  handleSelectPinnedFolder: (folder: any) => void;
  handleShowAllCategories: () => void;
};

const AllCategories: React.FC<AllCategoriesProps> = ({
  showAllCategories,
  groupedVocabularyData,
  handleSelectPinnedFolder,
  handleShowAllCategories,
}) => {
  return (
    <div
      className={`fixed inset-0 bg-white z-50 overflow-y-auto transition-all duration-300 ease-in-out transform dark:bg-[#222222] scrollbar-hide ${
        showAllCategories
          ? "scale-100 opacity-100 pointer-events-auto"
          : "scale-50 opacity-0 pointer-events-none"
      }`}
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
          Lingoland đồng bộ việc học theo "từ", ví dụ khi bạn học từ "land" ở
          thư mục A thì các thư mục khác chứa từ "land" cũng sẽ được cập nhật
          trạng thái học tương ứng.
        </p>
      </div>

      <div className="px-16 py-10">
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
                  <button onClick={() => handleSelectPinnedFolder(vocabulary)}>
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

export default AllCategories;
