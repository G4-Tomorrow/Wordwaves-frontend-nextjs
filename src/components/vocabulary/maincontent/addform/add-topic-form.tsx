import React, { useState } from "react";
import http from "@/utils/http"; // Ensure `http` module is set up for API calls

const AddTopicForm: React.FC<{
  collectionId: string;
  onTopicAdded: () => void;
  onCloseAddTopicModal: () => void;
}> = ({ collectionId, onTopicAdded, onCloseAddTopicModal }) => {
  const [name, setName] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnail(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("accessToken");

      let uploadedFileName = "";
      if (thumbnail) {
        const formData = new FormData();
        formData.append("file", thumbnail);

        // Upload the thumbnail image
        const fileResponse = await http.post("/files", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        // Check for successful file upload
        if (fileResponse.data.code === 1000) {
          uploadedFileName = fileResponse.data.result.fileName;
        } else {
          alert(fileResponse.data.message || "Có lỗi xảy ra khi tải ảnh!");
          setIsSubmitting(false);
          return;
        }
      }

      const linkThumbnail = `https://firebasestorage.googleapis.com/v0/b/wordwaves-40814.appspot.com/o/${uploadedFileName}?alt=media&token=e3149c89-093f-4049-a935-5ad0bd42c2ee`;

      const topicFormData = {
        name,
        collectionId,
        thumbnailName: linkThumbnail || undefined,
      };

      const response = await http.post(`/topics`, topicFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.code === 1000) {
        alert("Chủ đề đã được thêm thành công!");
        onTopicAdded();
        setName("");
        setThumbnail(null);
      } else {
        alert(response.data.message || "Có lỗi xảy ra khi thêm chủ đề!");
      }
    } catch (error: any) {
      console.error("Không thể thêm chủ đề. Vui lòng thử lại!", error);
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

        {/* Topic Name Field */}
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

        {/* Image Upload Field */}
        <div className="mb-4">
          <label
            htmlFor="thumbnail"
            className="block text-primary dark:text-white"
          >
            Ảnh của chủ đề
          </label>
          <input
            type="file"
            id="thumbnail"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-2 py-1 border-b-2 border-primary dark:border-white focus:outline-none focus:border-primary dark:focus:border-white"
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
