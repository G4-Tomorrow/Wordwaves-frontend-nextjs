"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { IconChevronLeft, IconX, IconZoom } from "@tabler/icons-react";
import SearchResults from "./search-result";
import { debounce } from "lodash";

const SearchBar = () => {
  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>(""); // Cập nhật ngay khi nhập
  const [debouncedTerm, setDebouncedTerm] = useState<string>(""); // Chỉ cập nhật sau 300ms

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showOverlay && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showOverlay]);

  // Debounce thực hiện cập nhật `debouncedTerm`
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm); // Chỉ cập nhật sau 300ms
    }, 300);

    // Cleanup nếu người dùng tiếp tục gõ
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value); // Cập nhật ngay lập tức khi người dùng nhập
  };

  const handleKeywordClick = (keyword: string) => {
    setSearchTerm(keyword);
    setDebouncedTerm(keyword); // Gọi ngay lập tức khi nhấn từ khóa
    setShowOverlay(true);
  };

  const handleCloseOverlay = () => {
    setShowOverlay(false);
    setSearchTerm("");
    setDebouncedTerm("");
  };

  const keywords = [
    "land",
    "lingo",
    "recall",
    "recommend",
    "folder",
    "often",
    "streak",
    "recent",
    "review",
    "explore",
  ];

  return (
    <div className="relative w-full mx-auto text-center">
      <button
        onClick={() => setShowOverlay(true)}
        className="px-4 py-2.5 w-[69%] bg-white rounded-2xl shadow-md hover:bg-gray-100 focus:ring focus:ring-gray-300"
      >
        <span className="text-gray-500 flex gap-2 items-center">
          <IconZoom />
          Tìm kiếm từ
        </span>
      </button>

      <div className="flex flex-wrap gap-2 mt-2.5 justify-center">
        {keywords.map((keyword) => (
          <button
            key={keyword}
            onClick={() => handleKeywordClick(keyword)}
            className="px-3 py-[3px] bg-green-500 text-white rounded-xl focus:outline-none hover:bg-green-600 transition"
          >
            {keyword}
          </button>
        ))}
      </div>

      <div
        className={`fixed inset-0 bg-white z-50 overflow-y-auto transition-transform duration-300 ease-in-out transform ${
          showOverlay
            ? "scale-100 opacity-100 pointer-events-auto"
            : "scale-50 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex justify-between items-center bg-primary text-white px-4 py-2.5 text-base shadow-md">
          <button
            onClick={handleCloseOverlay}
            className="font-bold hover:text-gray-800"
          >
            <IconChevronLeft />
          </button>

          <input
            ref={inputRef}
            type="text"
            placeholder="Keyword ..."
            value={searchTerm}
            onChange={handleInputChange}
            className="p-2 w-full border placeholder-gray-400 border-gray-300 bg-transparent rounded-lg focus:outline-none focus:ring focus:ring-primary"
          />

          <button
            onClick={() => setSearchTerm("")}
            className="px-4 py-2 hover:text-gray-700 font-semibold"
          >
            <IconX />
          </button>
        </div>

        {debouncedTerm && <SearchResults searchTerm={debouncedTerm} />}
      </div>
    </div>
  );
};

export default SearchBar;
