"use client";
import http from "@/utils/http";
import {
  IconChevronLeft,
  IconCircleCheckFilled,
  IconClockFilled,
} from "@tabler/icons-react";
import Image from "next/image";
import { useCallback, useContext, useEffect, useState } from "react";
import { Button, Skeleton } from "antd";
import { AuthContext } from "@/context/AuthContext";
import AddTopicForm from "@/components/vocabulary/maincontent/addform/add-topic-form";
import AllWordOfTopic from "@/components/vocabulary/maincontent/all-entities/all-word-of-topic";

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

  const authContext = useContext(AuthContext);
  const isAdmin = authContext?.isAdmin;

  const [selectedTopic, setSelectedTopic] = useState<any | null>(null);
  const [showWordModal, setShowWordModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showAddTopicModal, setShowAddTopicModal] = useState(false);

  // Fetch topics when selectedCollection changes
  useEffect(() => {
    if (!selectedCollection) return;
    const token = localStorage.getItem("accessToken");
    if (token) {
      fetchCollectionTopics(token, selectedCollection.id);
    }
  }, [selectedCollection]);

  // Function to fetch topics of a collection
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

  // Handlers for opening and closing modals
  const handleOpenTopicDetail = (topic: Topic) => {
    setSelectedTopic(topic);
    setShowWordModal(true);
  };

  const handleCloseWordModal = () => {
    setShowWordModal(false);
  };

  const handleTopicAdded = () => {
    if (selectedCollection) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        fetchCollectionTopics(token, selectedCollection.id);
      }
    }
    setShowAddTopicModal(false);
  };

  const handleShowAddTopicModal = () => {
    setShowAddTopicModal((prev) => !prev);
  };

  return (
    <div
      className={`fixed inset-0 bg-white z-100 overflow-y-auto transition-all duration-300 ease-in-out transform dark:bg-[#222222] ${
        showTopicModal
          ? "opacity-100 scale-100 pointer-events-auto visible"
          : "opacity-0 scale-50 pointer-events-none invisible"
      }`}
    >
      {/* Header Section */}
      <div className="relative flex px-2.5 py-3.5 gap-5 bg-primary text-white">
        <button
          onClick={handleCloseTopicModal}
          className="font-bold hover:text-gray-300"
        >
          <IconChevronLeft size={30} />
        </button>
        <div className="flex gap-5 items-center">
          <Image
            src={
              selectedCollection?.thumbnailName ||
              "https://voca-land.sgp1.cdn.digitaloceanspaces.com/-1/1653745889658/92e1b62145539c2bdcd28d6b8204d77d54c7cb41269edef6d4b5b98989985091.png"
            }
            width={100}
            height={100}
            alt="folder"
            className="w-16 h-16 rounded-full border-[7.5px] border-[#A5E3BB] bg-white p-[5px]"
          />
          <div className="w-full flex flex-col gap-2 items-start">
            <p className="font-semibold ">
              {selectedCollection?.name || "Collection Name Unavailable"}
            </p>
            <div className="text-xs text-gray-500 flex gap-2 font-semibold bg-white px-2 py-[5px] rounded-full">
              <div className="flex items-center text-[#0088E6] gap-1">
                <IconCircleCheckFilled width={19} height={19} />
                <p className="mt-0.5 tracking-[0.1em]">
                  {selectedCollection?.numOfLearnedWord || 0}/
                  {selectedCollection?.numOfTotalWords || 0}
                </p>
                đã học
              </div>
              <div className="flex items-center text-primary gap-1">
                <IconClockFilled width={19} height={19} />
                <p className="mt-0.5">
                  {selectedCollection?.numOfLearningWord || 0} cần luyện tập
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Button to open Add Topic Modal */}
        {isAdmin && (
          <div className="absolute top-[50%] right-10 translate-y-[-50%]">
            <Button
              onClick={handleShowAddTopicModal}
              className="bg-primary text-white !p-5 rounded-lg hover:!text-[#16a34a] "
            >
              Thêm chủ đề
            </Button>
          </div>
        )}
      </div>

      {/* Add Topic Modal */}
      {isAdmin && selectedCollection && showAddTopicModal && (
        <AddTopicForm
          collectionId={selectedCollection?.id}
          onTopicAdded={handleTopicAdded}
          onCloseAddTopicModal={handleShowAddTopicModal}
        />
      )}

      {/* Content Section */}
      {loading ? (
        <div className="grid lg:grid-cols-5 gap-3 px-16 py-4">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-1.5 py-14"
            >
              {/* Skeleton for image */}
              <Skeleton.Avatar
                active
                shape="circle"
                size={55}
                className="border-[7.5px] border-[#A5E3BB] bg-white p-[5px] mb-2 rounded-full"
              />
              {/* Skeleton for title */}
              <Skeleton.Input
                active
                style={{ width: "60%", height: "20px" }}
                className="rounded-full"
              />
              {/* Skeleton for progress indicators */}
              <div className="flex gap-2 text-xs font-semibold rounded-full mt-1">
                <Skeleton.Input
                  active
                  style={{ width: "35px", height: "15px" }}
                  className="rounded-full"
                />
                <Skeleton.Input
                  active
                  style={{ width: "35px", height: "15px" }}
                  className="rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center mt-4 text-red-500">
          Error fetching data: {error}
        </div>
      ) : topicOfCollection?.length ? (
        <div className="px-16 py-4 grid grid-cols-5 gap-3 container">
          {topicOfCollection.map((topic) => (
            <button
              key={topic.id}
              className="flex flex-col items-center gap-1.5 hover:bg-gray-100 rounded-3xl py-14"
              onClick={() => handleOpenTopicDetail(topic)}
            >
              <Image
                src={
                  topic.thumbnailName ||
                  "https://voca-land.sgp1.cdn.digitaloceanspaces.com/-1/1653745889658/92e1b62145539c2bdcd28d6b8204d77d54c7cb41269edef6d4b5b98989985091.png"
                }
                width={100}
                height={100}
                alt="folder"
                className="w-[75px] h-[75px] rounded-full border-[7.5px] border-[#A5E3BB] bg-white p-[5px] mb-2"
              />
              <p className="text-lg">{topic.name}</p>
              <div className="text-xs text-gray-500 flex gap-2 font-semibold rounded-full">
                <div className="flex items-center text-[#0088E6] gap-1">
                  <IconCircleCheckFilled width={19} height={19} />
                  <p className="mt-0.5">
                    {selectedCollection?.numOfLearnedWord || 0}/
                    {selectedCollection?.numOfTotalWords || 0}
                  </p>
                </div>
                <div className="flex items-center text-primary gap-1">
                  <IconClockFilled width={19} height={19} />
                  <p className="mt-0.5">
                    {selectedCollection?.numOfLearningWord || 0}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center mt-4">Chưa có chủ đề nào thuộc bộ này</div>
      )}

      {/* Show Word Detail Modal */}
      <AllWordOfTopic
        showWordModal={showWordModal}
        selectedTopic={selectedTopic}
        onCloseWordModal={handleCloseWordModal}
      />
    </div>
  );
};

export default AllTopicOfCollection;
