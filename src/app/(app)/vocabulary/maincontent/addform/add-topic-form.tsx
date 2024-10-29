import React, { useState } from "react";
import http from "@/utils/http"; // Đảm bảo rằng bạn đã thiết lập module `http` để gọi API

const AddTopicForm: React.FC<{
  collectionId: string;
  onTopicAdded: () => void;
  onCloseAddTopicModal: () => void;
}> = ({ collectionId, onTopicAdded, onCloseAddTopicModal }) => {
  const [name, setName] = useState("");
  const [thumbnailName, setThumbnailName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("accessToken");
      const response = await http.post(
        `/topics`,
        { name, collectionId, thumbnailName },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.code === 1000) {
        alert("Chủ đề đã được thêm thành công!");
        onTopicAdded();
        setName("");
        setThumbnailName("");
      } else {
        alert(response.data.message || "Có lỗi xảy ra khi thêm chủ đề!");
      }
    } catch (error: any) {
      //   .error("Không thể thêm chủ đề. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
      onCloseAddTopicModal();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onCloseAddTopicModal();
        }
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="relative w-1/3 bg-white dark:bg-[#333] p-4 rounded-lg shadow-md mb-6"
      >
        <h3 className="text-lg font-semibold text-primary dark:text-white mb-4 text-center">
          Thêm Chủ Đề Mới
        </h3>
        <button
          onClick={onCloseAddTopicModal}
          className="absolute top-2 right-2 text-lg text-primary dark:text-white"
        >
          <i className="fas fa-times"></i>
        </button>

        {/* Trường nhập Tên Chủ Đề */}
        <div className="mb-4">
          <label
            htmlFor="topic-name"
            className="block text-primary dark:text-white"
          >
            Tên Chủ Đề
          </label>
          <input
            type="text"
            id="topic-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-2 py-1 border-b-2 border-primary dark:border-white focus:outline-none focus:border-primary dark:focus:border-white"
            required
          />
        </div>

        {/* Trường nhập Tên Hình Ảnh */}
        <div className="mb-4">
          <label
            htmlFor="thumbnail-name"
            className="block text-primary dark:text-white"
          >
            Tên Hình Ảnh
          </label>
          <input
            type="text"
            id="thumbnail-name"
            value={thumbnailName}
            onChange={(e) => setThumbnailName(e.target.value)}
            className="w-full px-2 py-1 border-b-2 border-primary dark:border-white focus:outline-none focus:border-primary dark:focus:border-white"
            required
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white dark:bg-white dark:text-primary rounded-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang Thêm..." : "Thêm"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTopicForm;
