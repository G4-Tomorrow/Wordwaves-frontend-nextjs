"use client";

import { useState, useRef, useEffect } from "react";
import { IconChevronLeft, IconX, IconZoom } from "@tabler/icons-react";
import SearchResults from "./search-result";

const SearchBar = () => {
  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showOverlay && inputRef.current) {
      inputRef.current?.focus();
    }
  }, [showOverlay]);

  const handleButtonClick = () => {
    setShowOverlay(true);
  };

  const handleCloseOverlay = () => {
    setTimeout(() => {
      setShowOverlay(false);
      setSearchTerm("");
      if (showResults) {
        setShowResults(false);
      }
    }, 100);
  };

  const handleKeywordClick = (keyword: string) => {
    setSearchTerm(keyword);
    setShowResults(true);
    setShowOverlay(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length > 0) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
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
        onClick={handleButtonClick}
        className="px-4 py-2.5 w-[69%] bg-white rounded-2xl hover:bg-gray-100"
      >
        <span className="text-gray-500 flex gap-2">
          <IconZoom />
          Tìm kiếm từ
        </span>
      </button>

      <div className="flex flex-wrap gap-2 mt-2.5 justify-center">
        {keywords.map((keyword) => (
          <button
            key={keyword}
            onClick={() => handleKeywordClick(keyword)}
            className="px-3 py-[3px] bg-green-500 text-white rounded-xl focus:outline-none"
          >
            {keyword}
          </button>
        ))}
      </div>

      <div
        className={`fixed inset-0 bg-white z-50 overflow-y-auto transition-all duration-300 ease-in-out transform ${
          showOverlay
            ? "scale-100 opacity-100 pointer-events-auto"
            : "scale-50 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex justify-between items-center bg-primary text-white px-4 py-2.5 text-base">
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
            className="p-2 w-[94%] border placeholder-gray-300 border-gray-300 bg-transparent rounded-lg border-none focus:outline-none "
          />

          <button
            onClick={() => {
              setSearchTerm("");
              setShowResults(false);
            }}
            className="px-4 py-2 hover:text-gray-700 font-semibold"
          >
            <IconX />
          </button>
        </div>
        {showResults && <SearchResults searchTerm={searchTerm} />}
      </div>
    </div>
  );
};

export default SearchBar;
