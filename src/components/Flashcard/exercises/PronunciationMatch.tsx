import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Ear } from 'lucide-react';

interface PronunciationMatchProps {
    word: string;
    phonetics: Array<{
        text: string;
        audio: string;
        accent: string;
    }>;
    onSubmit: (answer: boolean) => void;
    showAnswer: boolean;
}

const PronunciationMatch: React.FC<PronunciationMatchProps> = ({
    word,
    phonetics,
    onSubmit,
    showAnswer
}) => {
    const [selectedPhonetic, setSelectedPhonetic] = useState<string | null>(null);

    const playAudio = (url: string) => {
        new Audio(url).play();
    };
console.log(word)
    const handleSelect = (phonetic: string) => {
        setSelectedPhonetic(phonetic);
        onSubmit(phonetic === phonetics[0].text);
    };

    // Generate wrong phonetics by slightly modifying the correct one
    const generateWrongPhonetics = (correct: string): string[] => {
        const modifications = [
            correct?.replace('ʌ', 'æ'),
            correct?.replace('i:', 'ɪ'),
            correct?.replace('ə', 'ʊ'),
            correct?.replace('n', 'ŋ')
        ];
        return modifications.filter(m => m !== correct);
    };

    const allPhonetics = [
        phonetics[0]?.text,
        ...generateWrongPhonetics(phonetics[0]?.text)
    ].sort(() => Math.random() - 0.5);

    return (
        <div className="space-y-6">
            <div className="bg-indigo-50 p-4 rounded-lg">
                <p className="text-sm text-indigo-700 font-medium">Chọn phiên âm đúng cho từ:</p>
                <div className="mt-2 flex items-center justify-between">
                    <p className="text-lg font-bold text-indigo-900">{word}</p>
                    <button
                        onClick={() => playAudio(phonetics[0].audio)}
                        className="p-2 rounded-full hover:bg-indigo-100 transition-colors"
                    >
                        <Volume2 className="w-5 h-5 text-indigo-600" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {allPhonetics.map((phonetic, index) => (
                    <motion.button
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSelect(phonetic)}
                        className={`p-4 rounded-lg transition-colors ${selectedPhonetic === phonetic
                                ? 'bg-indigo-100 text-indigo-700'
                                : showAnswer && phonetic === phonetics[0].text
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-gray-50 hover:bg-gray-100'
                            }`}
                    >
                        <div className="flex items-center justify-center space-x-2">
                            <Ear className="w-4 h-4" />
                            <span className="font-mono">{phonetic}</span>
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

export default PronunciationMatch;