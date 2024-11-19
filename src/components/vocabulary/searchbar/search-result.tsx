import http from "@/utils/http";
import Image from "next/image";
import { useEffect, useState } from "react";
import { preschoolAsUnknow } from "../../../../public/preschool";
import { toast } from "@/hooks/use-toast";

interface SearchResultsProps {
  searchTerm: string;
}

interface Meaning {
  partOfSpeech: string;
  definitions: {
    definition: string;
    example?: string;
  }[];
}

interface WordDetails {
  name: string;
  meanings: Meaning[];
}

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

const SearchResults: React.FC<SearchResultsProps> = ({ searchTerm }) => {
  const [results, setResults] = useState<{ name: string }[]>([]);
  const [wordDetails, setWordDetails] = useState<Record<string, Meaning[]>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchTerm.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await http.get(`/words/search/${searchTerm}`);
        setResults(response.data.result || []);
      } catch (error) {
        console.error("Error fetching search results:", error);
        toast({
          title: "Error",
          description: "Failed to fetch search results.",
          type: "background",
        });
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [searchTerm]);

  const fetchWordDetails = async (wordName: string) => {
    if (wordDetails[wordName]) return; // Skip if details already fetched

    const token = localStorage.getItem("accessToken");
    try {
      const response = await http.get(`/words/${wordName}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.code === 1000) {
        setWordDetails((prev) => ({
          ...prev,
          [wordName]: response.data.result.meanings,
        }));
      } else {
        toast({
          title: "Error",
          description: "Word not found",
          type: "background",
        });
      }
    } catch (error) {
      console.error("Error fetching word details:", error);
      toast({
        title: "Error",
        description: "Failed to load word details",
        type: "background",
      });
    }
  };

  useEffect(() => {
    results.forEach((result) => fetchWordDetails(result.name));
  }, [results]);

  return (
    <div className="relative container mx-auto top-2 bg-white w-full shadow-md mt-2 z-50 border rounded-md">
      {isLoading ? (
        <div className="p-3 text-gray-400">Đang tải...</div>
      ) : results.length > 0 ? (
        results.map((result) => (
          <div
            key={result.name}
            className="p-3 flex flex-col mb-4 border-b last:border-b-0 border-gray-200 hover:bg-gray-100"
          >
            <div className="flex items-center">
              <Image
                src={
                  preschoolAsUnknow ||
                  "https://voca-land.sgp1.cdn.digitaloceanspaces.com/-1/1653745889658/92e1b62145539c2bdcd28d6b8204d77d54c7cb41269edef6d4b5b98989985091.png"
                }
                width={50}
                height={50}
                alt="collection"
                className="w-12 h-12 rounded-full border-[5.5px] border-[#A5E3BB] bg-white p-[5px]"
              />
              <div className="ml-3">
                <p className="text-lg text-[#149043]">{result.name}</p>
              </div>
            </div>
            <div className="ml-16 mt-2 text-sm text-gray-500">
              {wordDetails[result.name] ? (
                wordDetails[result.name].map((meaning, mIndex) => (
                  <div key={mIndex} className="mb-2">
                    <p className="font-semibold">
                      {meaning.partOfSpeech.toUpperCase()}
                    </p>
                    {meaning.definitions
                      .slice(0, 2)
                      .map((definition, dIndex) => (
                        <div key={dIndex} className="ml-4 mb-1">
                          <p>{truncateText(definition.definition, 50)}</p>
                          {definition.example && (
                            <p className="text-gray-600">
                              <span className="italic">Example:</span>{" "}
                              {truncateText(definition.example, 50)}
                            </p>
                          )}
                        </div>
                      ))}
                  </div>
                ))
              ) : (
                <p>Loading details...</p>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="p-3 text-gray-400">Không có kết quả nào</div>
      )}
    </div>
  );
};

export default SearchResults;
