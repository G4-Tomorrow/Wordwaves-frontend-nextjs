"use client";
import http from "@/utils/http";
import {
  IconChevronLeft,
  IconChevronRight,
  IconCircleCheckFilled,
  IconClockFilled,
} from "@tabler/icons-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

interface Topic {
  createdAt: string;
  updatedAt: string;
  createdById: string;
  updatedById: string;
  id: string;
  name: string;
  thumbnailName: string | null;
  numOfTotalWords: number;
  numOfLearningWord: number;
  numOfLearnedWord: number;
}

const AllTopicOfCollection: React.FC<{
  showTopicModal: boolean;
  selectedCollection: any | null;
  handleCloseTopicModal: () => void;
}> = ({ showTopicModal, selectedCollection, handleCloseTopicModal }) => {
  const [topicOfCollection, setTopicOfCollection] = useState<Topic[] | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedCollection) return;
    const token = localStorage.getItem("accessToken");
    if (token) {
      fetchCollectionTopics(token, selectedCollection.id);
    }
  }, [selectedCollection]);

  const fetchCollectionTopics = useCallback(
    async (token: string, collectionId: string) => {
      setLoading(true);
      setTopicOfCollection(null);
      const url = `/collections/${collectionId}/topics?pageNumber=1&pageSize=5`;
      try {
        const response = await http.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.code === 1000) {
          setTopicOfCollection(response.data.result.data);
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

  if (!showTopicModal) return null;

  return (
    <div
      className={`fixed inset-0 bg-white z-50 overflow-y-auto transition-all duration-300 ease-in-out transform dark:bg-[#222222] ${
        showTopicModal
          ? "scale-100 opacity-100 pointer-events-auto"
          : "scale-50 opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex px-2.5 py-3.5 gap-5 bg-primary text-white text-base ">
        <button
          onClick={handleCloseTopicModal}
          className="font-bold hover:text-gray-800"
        >
          <IconChevronLeft size={30} />
        </button>
        <div className="flex gap-3 items-center">
          <div className="flex gap-3">
            <Image
              src={
                "https://voca-land.sgp1.cdn.digitaloceanspaces.com/-1/1653745889658/92e1b62145539c2bdcd28d6b8204d77d54c7cb41269edef6d4b5b98989985091.png"
              }
              width={100}
              height={100}
              alt="folder"
              className="w-16 h-16 rounded-full border-[7.5px] border-[#A5E3BB] bg-white p-[5px]"
            />
            <div className="w-full flex flex-col justify-around items-start">
              <p className="font-semibold text-lg">{selectedCollection.name}</p>
              <div className="text-xs text-gray-500 flex gap-2 font-semibold bg-white px-2 py-1 rounded-full">
                <div className="flex items-center text-[#0088E6] gap-1">
                  <IconCircleCheckFilled width={19} height={19} />
                  <p className="mt-0.5">
                    {selectedCollection.numOfLearnedWord}/
                    {selectedCollection.numOfTotalWords} đã học
                  </p>
                </div>
                <div className="flex items-center text-primary gap-1">
                  <IconClockFilled width={19} height={19} />
                  <p className="mt-0.5">
                    {selectedCollection.numOfLearningWord} cần luyện tập
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {loading ? (
        <div className="text-center mt-4">Loading...</div>
      ) : error ? (
        <div className="text-center mt-4 text-red-500">
          Error fetching data: {error}
        </div>
      ) : topicOfCollection?.length ? (
        <div className="p-4 grid grid-cols-5 gap-1">
          {topicOfCollection.map((topic) => (
            <div key={topic.id} className="flex flex-col items-center gap-1">
              <Image
                src={
                  topic.thumbnailName
                    ? `https://voca-land.sgp1.cdn.digitaloceanspaces.com/${topic.createdById}/${topic.id}/${topic.thumbnailName}`
                    : "https://voca-land.sgp1.cdn.digitaloceanspaces.com/-1/1653745889658/92e1b62145539c2bdcd28d6b8204d77d54c7cb41269edef6d4b5b98989985091.png"
                }
                width={100}
                height={100}
                alt="folder"
                className="w-16 h-16 rounded-full border-[7.5px] border-[#A5E3BB] bg-white p-[5px]"
              />
              <h1>{topic.name}</h1>
              <div className="text-xs text-gray-500 flex gap-2 font-semibold bg-white rounded-full">
                <div className="flex items-center text-[#0088E6] gap-1">
                  <IconCircleCheckFilled width={19} height={19} />
                  <p className="mt-0.5">
                    {selectedCollection.numOfLearnedWord}/
                    {selectedCollection.numOfTotalWords}
                  </p>
                </div>
                <div className="flex items-center text-primary gap-1">
                  <IconClockFilled width={19} height={19} />
                  <p className="mt-0.5">
                    {selectedCollection.numOfLearningWord}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-4">Chưa có chủ đề nào thuộc bộ này</div>
      )}
    </div>
  );
};

export default AllTopicOfCollection;
