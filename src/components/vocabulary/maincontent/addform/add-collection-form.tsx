import React, { useState } from "react";
import http from "@/utils/http"; // Ensure `http` module is set up for API calls

const AddCollectionForm: React.FC<{
  onCollectionAdded: (newCollectionData: any) => void;
  onCloseAddCollectionModal: () => void;
}> = ({ onCollectionAdded, onCloseAddCollectionModal }) => {
  const [name, setName] = useState("");
  const [thumbnailName, setThumbnailName] = useState("");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("accessToken");

      let uploadedFileName = "";
      if (thumbnailName) {
        const formData = new FormData();
        const fileInput = document.getElementById(
          "thumbnail-name"
        ) as HTMLInputElement;
        const file = fileInput?.files?.[0];
        if (file) {
          formData.append("file", file);

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
      }

      const linkThumbnail = `https://firebasestorage.googleapis.com/v0/b/wordwaves-40814.appspot.com/o/${uploadedFileName}?alt=media&token=e3149c89-093f-4049-a935-5ad0bd42c2ee`;

      // Now, create the collection with the uploaded fileName (if any)
      const newCollectionData = {
        name,
        thumbnailName: linkThumbnail || undefined,
        category,
      };

      const response = await http.post(`/collections`, newCollectionData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.code === 1000) {
        alert("Bộ sưu tập đã được thêm thành công!");
        onCollectionAdded(response.data.result);
        setName("");
        setThumbnailName("");
        setCategory("");
      } else {
        alert(response.data.message || "Có lỗi xảy ra khi thêm bộ sưu tập!");
      }
    } catch (error) {
      console.error("Error adding collection:", error);
      alert("Đã có lỗi xảy ra!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="sticky inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm z-50 h-screen"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onCloseAddCollectionModal();
        }
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="relative w-1/3 bg-white dark:bg-[#333] p-4 rounded-lg shadow-md mb-6"
      >
        <h3 className="text-lg font-semibold text-primary dark:text-white mb-4 text-center">
          Thêm Bộ Sưu Tập Mới
        </h3>
        <button
          onClick={onCloseAddCollectionModal}
          className="absolute top-2 right-2 text-lg text-primary dark:text-white"
        >
          <i className="fas fa-times"></i>
        </button>

        {/* Collection Name Field */}
        <div className="mb-4">
          <label
            htmlFor="collection-name"
            className="block text-primary dark:text-white"
          >
            Tên Bộ Sưu Tập
          </label>
          <input
            type="text"
            id="collection-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-2 py-1 border-b-2 border-primary dark:border-white focus:outline-none focus:border-primary dark:focus:border-white"
            required
          />
        </div>

        {/* Thumbnail Name Field */}
        <div className="mb-4">
          <label
            htmlFor="thumbnail-name"
            className="block text-primary dark:text-white"
          >
            Tên Hình Thu Nhỏ (tùy chọn)
          </label>
          <input
            type="file"
            id="thumbnail-name"
            value={thumbnailName}
            onChange={(e) => setThumbnailName(e.target.value)}
            className="w-full px-2 py-1 border-b-2 border-primary dark:border-white focus:outline-none focus:border-primary dark:focus:border-white"
            placeholder="Optional"
            accept="image/*"
          />
        </div>

        {/* Category Field */}
        <div className="mb-4">
          <label
            htmlFor="category"
            className="block text-primary dark:text-white"
          >
            Thể Loại
          </label>
          <input
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
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

export default AddCollectionForm;
