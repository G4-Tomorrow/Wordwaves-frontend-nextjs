"use client";
import { Skeleton } from "@/components/ui/skeleton";
import http from "@/utils/http";
import {
  IconChevronLeft,
  IconCircleCheckFilled,
  IconClockFilled,
} from "@tabler/icons-react";
import Image from "next/image";
import { use, useCallback, useEffect, useState } from "react";
import WordDetailModal from "@/app/(app)/vocabulary/maincontent/word-detail";
import AddWordForm from "@/app/(app)/vocabulary/maincontent/addform/add-word-form";
import { Button } from "antd";

interface Word {
  id: string;
  name: string;
  thumbnailUrl: string;
  phonetics: { text: string; audio: string }[];
  meanings: {
    partOfSpeech: string;
    definitions: { definition: string; example: string | undefined }[];
  }[];
}
// Component AllWordOfTopic
// Description: Displays all words for a selected topic. Allows users to view a list of words and open a detailed modal for each word.
const AllWordOfTopic: React.FC<{
  showWordModal: boolean;
  selectedTopic: any | null;
  onCloseWordModal: () => void;
}> = ({ showWordModal, selectedTopic, onCloseWordModal }) => {
  const [words, setWords] = useState<Word[]>([]);
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showAddWordModal, setShowAddWordModal] = useState(false);
  useEffect(() => {
    if (!selectedTopic) return;
    const token = localStorage.getItem("accessToken");
    if (token) {
      fetchWordsOfTopic(token, selectedTopic.id);
    }
  }, [selectedTopic]);

  const fetchWordsOfTopic = useCallback(
    async (token: string, topicId: string) => {
      setLoading(true);
      try {
        const response = await http.get(
          `/topics/${topicId}/words?pageNumber=1&pageSize=20`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.data.code === 1000) {
          setWords(response.data.result.data);
        } else {
          throw new Error(response.data.message);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleWordClick = (word: Word) => {
    setSelectedWord(word);
  };

  const handleCloseWordDetail = () => {
    setSelectedWord(null);
  };

  const handleWordAdded = () => {
    if (selectedTopic) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        fetchWordsOfTopic(token, selectedTopic.id);
      }
    }
    setShowAddWordModal(false);
  };

  const handleShowAddWordModal = () => {
    setShowAddWordModal((prev) => !prev);
  };

  if (!showWordModal) return null;

  return (
    <div
      className={`fixed inset-0 bg-white z-50 overflow-y-auto transition-all duration-300 ease-in-out transform dark:bg-[#222222] scrollbar-hide ${
        showWordModal
          ? "scale-100 opacity-100 pointer-events-auto"
          : "scale-50 opacity-0 pointer-events-none"
      }`}
      // style={{ overflowY: selectedWord ? "hidden" : "auto" }}
    >
      {/* Header */}
      <div className="relative flex items-center px-2.5 py-3.5 gap-5 bg-primary text-white shadow-lg">
        <button
          onClick={onCloseWordModal}
          className="hover:text-gray-300 transition duration-150"
        >
          <IconChevronLeft size={30} />
        </button>
        <div className="flex gap-5 items-center">
          <Image
            src={
              selectedTopic.thumbnail ||
              "https://voca-land.sgp1.cdn.digitaloceanspaces.com/-1/1653745889658/92e1b62145539c2bdcd28d6b8204d77d54c7cb41269edef6d4b5b98989985091.png"
            }
            width={100}
            height={100}
            alt="collection"
            className="w-16 h-16 rounded-full border-[7.5px] border-[#A5E3BB] bg-white p-[5px]"
          />
          <div className="w-full flex flex-col gap-2 items-start">
            <p className="font-semibold">
              {selectedTopic?.name || "Collection Name Unavailable"}
            </p>
            <div className="text-xs text-gray-500 flex gap-2 font-semibold bg-white px-2 py-[5px] rounded-full">
              <div className="flex items-center text-[#0088E6] gap-1">
                <IconCircleCheckFilled width={19} height={19} />
                <p className="mt-0.5 tracking-[0.1em]">
                  {selectedTopic?.numOfLearnedWord || 0}/
                  {selectedTopic?.numOfTotalWords || 0}
                </p>
                đã học
              </div>
              <div className="flex items-center text-primary gap-1">
                <IconClockFilled width={19} height={19} />
                <p className="mt-0.5">
                  {selectedTopic?.numOfLearningWord || 0} cần luyện tập
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Button to open Add Word Modal */}
        <div className="absolute top-[50%] right-10 translate-y-[-50%]">
          <Button
            onClick={handleShowAddWordModal}
            className="bg-primary text-white !p-5 rounded-lg hover:!text-[#16a34a] transition-transform transform hover:scale-125"
          >
            Add New Word
          </Button>
        </div>
      </div>

      {/* Add Word Modal */}
      {selectedTopic && showAddWordModal && (
        <AddWordForm
          topicId={selectedTopic.id}
          onWordAdded={handleWordAdded}
          onCloseAddWordModal={handleShowAddWordModal}
        />
      )}

      {/* Content */}
      {loading ? (
        <div className="grid lg:grid-cols-3 gap-4 px-16 py-10">
          <Skeleton className="h-[100px] w-full rounded-xl" />
          <Skeleton className="h-[100px] w-full rounded-xl" />
          <Skeleton className="h-[100px] w-full rounded-xl" />
        </div>
      ) : error ? (
        <div className="text-center mt-8 text-red-500">
          Error fetching data: {error}
        </div>
      ) : // nếu topic không có từ vựng nào
      words.length === 0 ? (
        <div className="text-center mt-8 text-gray-500">
          Chủ đề này chưa có từ vựng nào!
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-9 px-14 py-10 ny">
          {words.map((word) => (
            <div
              key={word.id}
              className="p-6 rounded-3xl cursor-pointer flex items-center border"
              onClick={() => handleWordClick(word)}
            >
              <Image
                src={
                  "data:image/png;base64,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"
                }
                width={100}
                height={100}
                alt="folder"
                className="w-12 h-12 rounded-full border-[5px] border-[#A5E3BB] bg-white p-[5px] mr-3"
              />
              <div>
                <p className="font-medium text-primary dark:text-white">
                  {word.name}
                </p>
                {word.meanings.slice(0, 1).map((meaning) => (
                  <p
                    key={meaning.partOfSpeech}
                    className=" text-gray-500 dark:text-gray-400 whitespace-nowrap block overflow-hidden text-ellipsis max-w-xs"
                  >
                    <span className="italic">({meaning.partOfSpeech})</span>
                    <span className="overflow-hidden text-ellipsis">
                      {meaning.definitions[0].definition}
                    </span>
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Word Detail Modal */}
      {selectedWord && (
        <WordDetailModal word={selectedWord} onClose={handleCloseWordDetail} />
      )}
    </div>
  );
};

export default AllWordOfTopic;
