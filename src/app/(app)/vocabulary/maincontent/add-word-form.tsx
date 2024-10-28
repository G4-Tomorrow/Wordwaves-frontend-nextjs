import http from "@/utils/http";
import { IconX } from "@tabler/icons-react";
import { useState } from "react";

const AddWordForm: React.FC<{
  topicId: string;
  onWordAdded: () => void;
  handleShowAddWordModal: () => void;
}> = ({ topicId, onWordAdded, handleShowAddWordModal }) => {
  const [wordName, setWordName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem("accessToken");
      const response = await http.post(
        `/words`,
        { name: wordName, topicId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.code === 1000) {
        onWordAdded();
        setWordName("");
      } else {
        throw new Error(response.data.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-[#333] p-4 rounded-lg shadow-md mb-6"
      >
        <h3 className="text-lg font-semibold text-primary dark:text-white mb-4">
          Thêm Từ Mới
        </h3>
        <button
          onClick={handleShowAddWordModal}
          className="absolute top-2 right-2 text-gray-500 dark:text-gray-400"
        >
          <IconX size={20} />
        </button>
        <div className="mb-4">
          <label
            htmlFor="wordName"
            className="block text-gray-700 dark:text-gray-300 mb-1"
          >
            Tên Từ
          </label>
          <input
            type="text"
            id="wordName"
            value={wordName}
            onChange={(e) => setWordName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg dark:bg-[#444] dark:border-gray-600 dark:text-white"
          />
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-lg w-full disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Đang Thêm..." : "Thêm Từ"}
        </button>
      </form>
    </div>
  );
};

export default AddWordForm;
