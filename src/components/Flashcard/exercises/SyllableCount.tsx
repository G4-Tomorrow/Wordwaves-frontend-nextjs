import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Hash, Volume2 } from 'lucide-react';

interface SyllableCountProps {
    word: string;
    phonetics: Array<{
        text: string;
        audio: string;
    }>;
    onSubmit: (answer: number) => void;
    showAnswer: boolean;
}

const SyllableCount: React.FC<SyllableCountProps> = ({
    word,
    phonetics,
    onSubmit,
    showAnswer
}) => {
    const [selectedCount, setSelectedCount] = useState<number | null>(null);

    const playAudio = (url: string) => {
        new Audio(url).play();
    };

    // Simple syllable count based on vowel sounds in phonetic text
    const countSyllables = (phonetic: string): number => {
        const vowelSounds = phonetic?.match(/[ɑæɛeɪiɔoʊuʌəː]/g);
        return vowelSounds ? vowelSounds.length : 1;
    };

    const correctCount = countSyllables(phonetics[0]?.text);
    const possibleCounts = [1, 2, 3, 4].sort(() => Math.random() - 0.5);

    const handleSelect = (count: number) => {
        setSelectedCount(count);
        onSubmit(count === correctCount);
    };

    return (
        <div className="space-y-6">
            <div className="bg-indigo-50 p-4 rounded-lg">
                <p className="text-sm text-indigo-700 font-medium">Đếm số âm tiết trong từ:</p>
                <div className="mt-2 flex items-center justify-between">
                    <p className="text-lg font-bold text-indigo-900">{word}</p>
                    <button
                        onClick={() => playAudio(phonetics[0]?.audio)}
                        className="p-2 rounded-full hover:bg-indigo-100 transition-colors"
                    >
                        <Volume2 className="w-5 h-5 text-indigo-600" />
                    </button>
                </div>
                <p className="text-sm text-indigo-600 mt-1 font-mono">{phonetics[0]?.text}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {possibleCounts.map((count, index) => (
                    <motion.button
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSelect(count)}
                        className={`p-4 rounded-lg transition-colors ${selectedCount === count
                                ? 'bg-indigo-100 text-indigo-700'
                                : showAnswer && count === correctCount
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-gray-50 hover:bg-gray-100'
                            }`}
                    >
                        <div className="flex items-center justify-center space-x-2">
                            <Hash className="w-4 h-4" />
                            <span>{count} âm tiết</span>
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

export default SyllableCount;