import { toast } from "@/hooks/use-toast";
import http from "@/utils/http";
import { IconX } from "@tabler/icons-react";
import { useState } from "react";

const AddWordForm: React.FC<{
  topicId: string;
  onWordAdded: () => void;
  onCloseAddWordModal: () => void;
}> = ({ topicId, onWordAdded, onCloseAddWordModal }) => {
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
        toast({
          title: "Thành công",
          description: "Từ đã được thêm thành công!",
          duration: 3000, // Duration in ms
          type: "foreground",
        });
      } else {
        throw new Error(response.data.message);
      }
    } catch (err: any) {
      setError(err.response.data.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onCloseAddWordModal();
        }
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="relative w-1/3 bg-white dark:bg-[#333] p-4 rounded-lg shadow-md mb-6"
      >
        <h3 className="text-lg font-semibold text-primary dark:text-white mb-4 text-center">
          Thêm Từ Mới
        </h3>
        <button
          onClick={onCloseAddWordModal}
          className="absolute top-3 right-4 text-gray-500 dark:text-gray-400 hover:rotate-180 transition-transform ease-in-out duration-300"
        >
          <IconX size={22} />
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
            className="w-full px-2 py-1 border-b-2 border-primary dark:border-white focus:outline-none focus:border-primary dark:focus:border-white"
            required
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
