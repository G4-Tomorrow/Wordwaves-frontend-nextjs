import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Globe } from 'lucide-react';

interface AccentComparisonProps {
    word: string;
    phonetics: Array<{
        text: string;
        audio: string;
        accent: string;
    }>;
    onSubmit: (answer: string) => void;
    showAnswer: boolean;
}

const AccentComparison: React.FC<AccentComparisonProps> = ({
    word,
    phonetics,
    onSubmit,
    showAnswer
}) => {
    const [selectedAccent, setSelectedAccent] = useState<string | null>(null);
    const [playingAudio, setPlayingAudio] = useState<string | null>(null);

    const playAudio = (url: string, accent: string) => {
        setPlayingAudio(accent);
        const audio = new Audio(url);
        audio.onended = () => setPlayingAudio(null);
        audio.play();
    };

    const handleAccentSelect = (accent: string) => {
        setSelectedAccent(accent);
        onSubmit(accent);
    };

    return (
        <div className="space-y-6">
            <div className="bg-indigo-50 p-4 rounded-lg">
                <p className="text-sm text-indigo-700 font-medium">So sánh phát âm giữa các vùng:</p>
                <p className="text-lg font-bold text-indigo-900 mt-2">{word}</p>
            </div>

            <div className="space-y-3">
                {phonetics.map((phonetic, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        className={`p-4 rounded-lg transition-colors ${selectedAccent === phonetic.accent
                                ? 'bg-indigo-100'
                                : 'bg-gray-50'
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <Globe className="w-5 h-5 text-indigo-600" />
                                <div>
                                    <p className="font-medium text-gray-800">{phonetic.accent}</p>
                                    <p className="text-sm text-gray-600 font-mono">{phonetic.text}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => playAudio(phonetic.audio, phonetic.accent)}
                                className={`p-2 rounded-full transition-colors ${playingAudio === phonetic.accent
                                        ? 'bg-indigo-100 text-indigo-600'
                                        : 'hover:bg-gray-100'
                                    }`}
                            >
                                <Volume2 className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="pt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Chọn phát âm bạn nghe rõ nhất:</p>
                <div className="grid grid-cols-2 gap-3">
                    {phonetics.map((phonetic, index) => (
                        <motion.button
                            key={index}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleAccentSelect(phonetic.accent)}
                            className={`p-3 rounded-lg transition-colors ${selectedAccent === phonetic.accent
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-50 hover:bg-gray-100'
                                }`}
                        >
                            {phonetic.accent}
                        </motion.button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AccentComparison;