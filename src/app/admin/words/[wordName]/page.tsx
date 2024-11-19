"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import http from "@/utils/http";
import { IconVolume2 } from "@tabler/icons-react";
import Image from "next/image";

interface Phonetic {
  text: string;
  audio: string;
  accent: string;
}

interface Meaning {
  partOfSpeech: string;
  definitions: {
    definition: string;
    definitionMeaning: string;
    example: string | null;
    exampleMeaning: string | null;
    synonyms: string[];
    antonyms: string[];
  }[];
  synonyms: string[];
  antonyms: string[];
}

interface Word {
  id: string;
  name: string;
  thumbnailUrl: string;
  vietnamese: string;
  phonetics: Phonetic[];
  meanings: Meaning[];
  createdAt: string;
  updatedAt: string;
}
export default function WordDetailsByName({
  params: { wordName },
}: {
  params: { wordName: string };
}) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [word, setWord] = useState<Word | null>(null);

  useEffect(() => {
    const fetchWordDetails = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("accessToken");

      const url = `/words/${wordName}`;
      try {
        const response = await http.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.code === 1000) {
          setWord(response.data.result);
        } else {
          toast({
            title: "Error",
            description: "Word not found",
            type: "background",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load word details",
          type: "background",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchWordDetails();
  }, [wordName]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!word) {
    return (
      <div className="container mx-auto p-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          Trở lại
        </Button>
        <h1 className="text-3xl font-bold">Không tìm thấy từ</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Go Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        Trở lại
      </Button>

      {/* Word Title */}
      {word.thumbnailUrl && (
        <Image
          src={word.thumbnailUrl}
          alt={word.name}
          width={64}
          height={64}
          className="rounded-full object-cover shadow-md"
        />
      )}

      {/* Word Info */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow-md">
        <p className="text-lg">
          <strong className="text-gray-800">Vietnamese:</strong>{" "}
          {word.vietnamese || "No translation available"}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          <strong>Created At:</strong>{" "}
          {new Date(word.createdAt).toLocaleString()}
        </p>
        <p className="text-sm text-gray-500">
          <strong>Updated At:</strong>{" "}
          {new Date(word.updatedAt).toLocaleString()}
        </p>
      </div>

      {/* Phonetics Section */}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Phonetics</h2>
        {word.phonetics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {word.phonetics.map((phonetic, index) => (
              <div
                key={index}
                className="flex flex-col items-start p-4 bg-white border rounded-lg shadow-sm"
              >
                <span className="text-lg text-gray-800">{phonetic.text}</span>
                <span className="text-sm text-gray-500 mt-1">
                  Accent: {phonetic.accent || "Unknown"}
                </span>
                {phonetic.audio && (
                  <Button
                    variant="ghost"
                    className="mt-2"
                    onClick={() => new Audio(phonetic.audio).play()}
                  >
                    Play Audio
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No phonetics available</p>
        )}
      </div>

      {/* Meanings Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Meanings</h2>
        {word.meanings.length > 0 ? (
          <div className="space-y-6">
            {word.meanings.map((meaning, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 border rounded-lg shadow-sm"
              >
                <h3 className="text-lg font-bold text-gray-800">
                  {meaning.partOfSpeech}
                </h3>
                <ul className="mt-3 space-y-2">
                  {meaning.definitions.map((definition, defIndex) => (
                    <li key={defIndex} className="text-gray-700">
                      <p>
                        <strong className="text-gray-800">Definition:</strong>{" "}
                        {definition.definition}
                      </p>
                      {definition.example && (
                        <p className="text-sm text-gray-500">
                          <strong>Example:</strong> {definition.example}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
                {meaning.synonyms.length > 0 && (
                  <p className="mt-4 text-sm text-gray-500">
                    <strong>Synonyms:</strong> {meaning.synonyms.join(", ")}
                  </p>
                )}
                {meaning.antonyms.length > 0 && (
                  <p className="mt-1 text-sm text-gray-500">
                    <strong>Antonyms:</strong> {meaning.antonyms.join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No meanings available</p>
        )}
      </div>
    </div>
  );
}
