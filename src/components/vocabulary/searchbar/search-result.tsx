import { useEffect, useState } from "react";

interface SearchResultsProps {
  searchTerm: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({ searchTerm }) => {
  const [results, setResults] = useState<string[]>([]);

  // Fetch dữ liệu tìm kiếm từ API
  useEffect(() => {}, []);

  return (
    <div className="relative top-2 bg-white w-full shadow-md mt-2 z-50">
      {results.length > 0 ? (
        results.map((result, index) => (
          <div key={index} className="p-3 border-b border-gray-200">
            {result}
          </div>
        ))
      ) : (
        <div className="p-3 text-gray-400">Không có kết quả nào</div>
      )}
    </div>
  );
};

export default SearchResults;
