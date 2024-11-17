'use client';
import { useState } from 'react';
import Flashcard from '@/components/Flashcard';
import { FaBook, FaLightbulb } from "react-icons/fa";
import { MdCollections, MdTopic } from "react-icons/md";

export default function FlashCard() {
    const [type, setType] = useState<'collection' | 'topic'>('topic');
    const [mode, setMode] = useState<'learn' | 'revision'>('revision');

    const handleTypeChange = (selectedType: 'collection' | 'topic') => {
        setType(selectedType);
    };

    const handleModeChange = (selectedMode: 'learn' | 'revision') => {
        setMode(selectedMode);
    };

    // Chọn collectionId hoặc topicId tùy thuộc vào type đã chọn
    const id = type === 'collection'
        ? '135dbb51-1f57-4ba5-add4-5ac85e207f80' // Thay thế với ID của collection
        : 'fa07450f-6870-4a43-8154-0b6b6138c55e'; // Thay thế với ID của topic

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 p-8">
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleTypeChange("collection")}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 ${type === "collection"
                                ? "bg-blue-600 text-white shadow-lg"
                                : "bg-white text-gray-600 hover:bg-blue-50"
                                }`}
                            aria-label="Select Collection Type"
                        >
                            <MdCollections className="text-xl" />
                            Collection
                        </button>
                        <button
                            onClick={() => handleTypeChange("topic")}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 ${type === "topic"
                                ? "bg-blue-600 text-white shadow-lg"
                                : "bg-white text-gray-600 hover:bg-blue-50"
                                }`}
                            aria-label="Select Topic Type"
                        >
                            <MdTopic className="text-xl" />
                            Topic
                        </button>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleModeChange("learn")}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 ${mode === "learn"
                                ? "bg-green-600 text-white shadow-lg"
                                : "bg-white text-gray-600 hover:bg-green-50"
                                }`}
                            aria-label="Select Learn Mode"
                        >
                            <FaBook className="text-xl" />
                            Learn
                        </button>
                        <button
                            onClick={() => handleModeChange("revision")}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 ${mode === "revision"
                                ? "bg-green-600 text-white shadow-lg"
                                : "bg-white text-gray-600 hover:bg-green-50"
                                }`}
                            aria-label="Select Revision Mode"
                        >
                            <FaLightbulb className="text-xl" />
                            Revision
                        </button>
                    </div>
                </div>
                {/* Truyền mode và id vào Flashcard */}
                <Flashcard mode={mode === 'learn' ? 'collection' : 'revision'} id={id} />
            </div>
        </div>
    );
}
