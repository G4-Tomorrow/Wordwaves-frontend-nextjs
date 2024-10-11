import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import VocabularySet from "@/app/(app)/vocabulary/vocabulary-set";
import { Button } from "@/components/ui/button";
import vocabularyData from "./test-data";

interface VocabularySetsListProps {
  onShowAllCategories: () => void;
}

const VocabularySetsList: React.FC<VocabularySetsListProps> = ({
  onShowAllCategories,
}) => {
  return (
    <div>
      {vocabularyData.map((category, categoryIndex) => (
        <div
          key={categoryIndex}
          className="px-7 pb-7 pt-2 hover:bg-gray-200 hover:cursor-pointer"
          onClick={onShowAllCategories}
        >
          <div className="pl-4">
            <h3 className="text-lg font-semibold">{category.categoryTitle}</h3>
            <p className="text-sm text-primary mb-2">
              {category.vocabularies.length} thư mục
            </p>
          </div>

          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full max-w-4xl"
          >
            <CarouselContent className="space-x-1">
              {category.vocabularies.slice(0, 5).map((vocab, vocabIndex) => (
                <CarouselItem
                  key={vocabIndex}
                  className="md:basis-1/2 lg:basis-1/3"
                >
                  <div className="p-1">
                    <VocabularySet
                      title={vocab.title}
                      thumbnail={vocab.thumbnail}
                      level={vocab.level}
                      progress={vocab.progress}
                      completed={vocab.completed}
                      total={vocab.total}
                      timeLeft={vocab.timeLeft}
                      crown={vocab.crown}
                    />
                  </div>
                </CarouselItem>
              ))}
              {category.vocabularies.length > 4 && (
                <div className="p-1 flex items-center justify-center">
                  <Button className="bg-primary font-semibold text-white rounded-xl ml-5">
                    Xem tất cả
                  </Button>
                </div>
              )}
            </CarouselContent>
          </Carousel>
        </div>
      ))}
    </div>
  );
};

export default VocabularySetsList;
