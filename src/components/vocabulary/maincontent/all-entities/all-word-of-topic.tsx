"use client";
import { Skeleton } from "@/components/ui/skeleton";
import http from "@/utils/http";
import {
  IconChevronLeft,
  IconCircleCheckFilled,
  IconClockFilled,
} from "@tabler/icons-react";
import Image from "next/image";
import { useCallback, useContext, useEffect, useState } from "react";
import { Button, Tooltip } from "antd";
import { AuthContext } from "@/context/AuthContext";
import AddWordForm from "@/components/vocabulary/maincontent/addform/add-word-form";
import WordDetailModal from "@/components/vocabulary/maincontent/word-management/word-detail";
import { preschoolAsUnknow } from "../../../../../public/preschool";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
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
  const authContext = useContext(AuthContext);
  const isAdmin = authContext?.isAdmin;

  const [words, setWords] = useState<Word[]>([]);
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showAddWordModal, setShowAddWordModal] = useState(false);

  const router = useRouter();

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

  const handleLearnNewWords = (topicId: string) => {
    router.push(`/learn/topic/new?id=${topicId.toString()}`);
  };

  const handlePracticeWords = (topicId: string) => {
    router.push(`/learn/topic/review?id=${topicId.toString()}`);
  };

  if (!showWordModal) return null;

  return (
    <div
      className={`fixed inset-0 bg-white z-50 overflow-y-auto transition-all duration-300 ease-in-out transform dark:bg-[#222222] scrollbar-hide ${
        showWordModal
          ? "scale-100 opacity-100 pointer-events-auto"
          : "scale-50 opacity-0 pointer-events-none"
      }`}
    >
      <div className="relative h-screen">
        {/* Header */}
        <div className="relative flex items-center px-2.5 py-3.5 gap-5 bg-[#149043] text-white shadow-lg">
          <button
            onClick={onCloseWordModal}
            className="hover:text-gray-300 transition duration-150"
          >
            <IoIosArrowBack className="text-white" size={30} />
          </button>
          <div className="flex gap-5 items-center">
            <Image
              src={
                selectedTopic.thumbnailName ||
                "https://voca-land.sgp1.cdn.digitaloceanspaces.com/-1/1653745889658/92e1b62145539c2bdcd28d6b8204d77d54c7cb41269edef6d4b5b98989985091.png"
              }
              width={100}
              height={100}
              alt="collection"
              className="w-16 h-16 rounded-full border-[7.5px] border-[#A5E3BB] bg-white p-[5px]"
            />
            <div className="w-full flex flex-col gap-2 items-start">
              <p className="text-white text-lg font-medium">
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
          {/* {isAdmin && (
            <div className="absolute top-[50%] right-10 translate-y-[-50%]">
              <Button
                onClick={handleShowAddWordModal}
                className="bg-primary text-white !p-5 rounded-lg hover:!text-[#16a34a]"
              >
                Thêm từ vựng
              </Button>
            </div>
          )} */}
        </div>

        {/* Add Word Modal */}
        {/* {isAdmin && selectedTopic && showAddWordModal && (
          <AddWordForm
            topicId={selectedTopic.id}
            onWordAdded={handleWordAdded}
            onCloseAddWordModal={handleShowAddWordModal}
          />
        )} */}

        {/* Content */}
        {loading ? (
          <div className="grid lg:grid-cols-3 gap-4 px-16 py-10 h-screen">
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
          <div className="text-center mt-8 text-gray-500 h-screen">
            Chủ đề này chưa có từ vựng nào!
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-9 px-14 py-10 h-full">
            {words.map((word) => (
              <div
                key={word.id}
                className="p-6 rounded-3xl cursor-pointer flex items-center border h-20"
                onClick={() => handleWordClick(word)}
              >
                <Image
                  src={preschoolAsUnknow}
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

        <div className="sticky bottom-0 left-0 right-0 grid grid-cols-2 justify-center gap-4 px-80 py-4 w-full">
          <Tooltip
            title="Học từ mới, bao gồm cả những từ chưa hoàn thành 100%"
            placement="top"
          >
            <Button
              className="bg-blue-500 text-white px-16 py-6 text-lg font-semibold rounded-xl flex items-center gap-2 hover:bg-blue-600 shadow-md"
              onClick={() => handleLearnNewWords(selectedTopic.id)}
            >
              Học từ mới
            </Button>
          </Tooltip>

          <Tooltip
            title="Luyện tập các từ đã học và các từ này đã đến lúc cần luyện tập"
            placement="top"
          >
            <Button
              className="bg-yellow-500 text-white px-16 py-6 text-lg font-semibold rounded-xl flex items-center gap-2 hover:bg-yellow-600 shadow-md"
              onClick={() => handlePracticeWords(selectedTopic.id)}
            >
              Luyện tập
            </Button>
          </Tooltip>

          {/* <Tooltip
            title="Học từ vựng qua Flashcard, giúp bạn nhớ từ vựng nhanh hơn"
            placement="top"
          >
            <Button className="bg-purple-500 text-white px-16 py-6 text-lg font-semibold rounded-xl flex items-center gap-2 hover:bg-purple-600 shadow-md">
              Flashcard
            </Button>
          </Tooltip> */}
        </div>

        {/* Word Detail Modal */}
        {selectedWord && (
          <WordDetailModal
            word={selectedWord}
            onClose={handleCloseWordDetail}
          />
        )}
      </div>
    </div>
  );
};

export default AllWordOfTopic;
