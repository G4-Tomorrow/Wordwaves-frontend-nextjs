'use client';
import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BsSoundwave } from "react-icons/bs";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import type { WordDetail } from '@/lib/api';

interface WordDetailProps {
    details: WordDetail | null;
    isLoading: boolean;
}

const WordDetail: React.FC<WordDetailProps> = ({ details, isLoading }) => {
    const [flipped, setFlipped] = useState(false);
    const [expandedSections, setExpandedSections] = useState({
        noun: false,
        verb: false
    });
    if (isLoading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="animate-pulse text-gray-600">Loading word details...</div>
            </div>
        );
    }

    if (!details) {
        return null;
    }

    const playAudio = (audio: string) => {
        if (audio) {
            new Audio(audio).play().catch(error => console.error("Audio playback failed:", error));
        }
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const toggleFlip = () => {
        setFlipped(prev => !prev); // Toggle the flip state
    };

    return (

        <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg my-8">

            <div className="relative">
                <img
                    src={details.thumbnailUrl}
                    alt={details.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                    onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4";
                    }}
                />
                <h1 className="text-4xl font-bold text-gray-800 mb-4">{details.name}</h1>
            </div>

            <div className="space-y-4 mb-6">
                {details?.phonetics?.map((phonetic, index) => (
                    <div key={index} className="flex items-center space-x-4">
                        <span className="text-gray-600 font-mono">{phonetic.text}</span>
                        <button
                            onClick={() => playAudio(phonetic.audio)}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                            aria-label="Play pronunciation"
                        >
                            <BsSoundwave className="text-blue-500 text-xl" />
                        </button>
                    </div>
                ))}
            </div>

            <div className="space-y-6">
                {details.meanings?.map((meaning, index) => (
                    <div key={index} className="border-t pt-4">
                        <button
                            onClick={() => toggleSection(meaning.partOfSpeech)}
                            className="w-full flex items-center justify-between text-left"
                            aria-expanded={expandedSections[meaning.partOfSpeech]}
                        >
                            <h2 className="text-xl font-semibold text-gray-700 capitalize">{meaning.partOfSpeech}</h2>
                            {expandedSections[meaning.partOfSpeech] ? (
                                <MdExpandLess className="text-2xl text-gray-500" />
                            ) : (
                                <MdExpandMore className="text-2xl text-gray-500" />
                            )}
                        </button>

                        {expandedSections[meaning.partOfSpeech] && (
                            <div className="mt-4 space-y-4">
                                <div>
                                    <h3 className="font-medium text-gray-700 mb-2">Definitions:</h3>
                                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                                        {meaning.definitions.map((def, index) => (
                                            <li key={index}>{def.definition}</li>
                                        ))}
                                    </ul>
                                </div>

                                {meaning.synonyms.length > 0 && (
                                    <div>
                                        <h3 className="font-medium text-gray-700 mb-2">Synonyms:</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {meaning.synonyms.map((syn, index) => (
                                                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">{syn}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {meaning.antonyms.length > 0 && (
                                    <div>
                                        <h3 className="font-medium text-gray-700 mb-2">Antonyms:</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {meaning.antonyms.map((ant, index) => (
                                                <span key={index} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">{ant}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {meaning.definitions.some(def => def.example) && (
                                    <div>
                                        <h3 className="font-medium text-gray-700 mb-2">Examples:</h3>
                                        <ul className="space-y-2 text-gray-600 italic">
                                            {meaning.definitions.map((def, index) => (
                                                def.example && <li key={index}>"{def.example}"</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}

            </div>
            <Button onClick={toggleFlip} className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                Flip
            </Button>
            {/* <div className="mt-6 pt-4 border-t text-sm text-gray-500">
                <p>ID: {dummyData.id}</p>
                <p>Created: {new Date(dummyData.metadata.createdAt).toLocaleDateString()}</p>
                <p>Last updated: {new Date(dummyData.metadata.updatedAt).toLocaleDateString()}</p>
            </div> */}
        </div>
    );
};

export default WordDetail;
