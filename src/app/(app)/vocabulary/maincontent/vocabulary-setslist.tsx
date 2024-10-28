import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import VocabularySet from "@/app/(app)/vocabulary/maincontent/vocabulary-set";
import { Button } from "@/components/ui/button";

interface VocabularySetsListProps {
  onShowAllCollection: () => void;
  groupedVocabularyData: { [categoryName: string]: any[] };
}

const VocabularySetsList: React.FC<VocabularySetsListProps> = ({
  onShowAllCollection,
  groupedVocabularyData = {},
}) => {
  return (
    <div>
      {groupedVocabularyData &&
      Object.keys(groupedVocabularyData).length > 0 ? (
        Object.keys(groupedVocabularyData).map((categoryName) => (
          <div
            key={categoryName}
            className="hover:bg-gray-200 dark:hover:bg-[#222222] hover:cursor-pointer pt-2 pl-6 pb-6"
            onClick={onShowAllCollection}
          >
            <div className="pl-4">
              <p className="font-medium">{categoryName}</p>
              <p className="text-sm text-primary mb-2.5">
                {groupedVocabularyData[categoryName].length} thư mục
              </p>
            </div>

            <Carousel
              opts={{
                align: "start",
              }}
              className="w-full lg:max-w-4xl 2xl:max-w-5xl"
            >
              <CarouselContent className="lg:space-x-[-20px] xl:space-x-[44px]">
                {groupedVocabularyData[categoryName]
                  .slice(0, 5)
                  .map((category) => (
                    <CarouselItem
                      key={category.id}
                      className="basis-1/3 xl:basis-1/4"
                    >
                      <VocabularySet
                        title={category.name}
                        thumbnail={category.thumbnailName}
                        completed={category.numOfLearnedWord}
                        total={category.numOfTotalWords}
                        timeLeft={category.numOfLearningWord}
                      />
                    </CarouselItem>
                  ))}
                {groupedVocabularyData[categoryName].length > 4 && (
                  <div className="p-1 flex items-center justify-center">
                    <Button className="bg-primary font-semibold text-white rounded-xl ml-5">
                      Xem tất cả
                    </Button>
                  </div>
                )}
              </CarouselContent>
            </Carousel>
          </div>
        ))
      ) : (
        <p>Không có dữ liệu để hiển thị</p>
      )}
    </div>
  );
};

export default VocabularySetsList;
