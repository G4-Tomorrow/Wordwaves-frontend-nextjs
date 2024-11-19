import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpDown, Plus, Minus } from 'lucide-react';

interface SynonymAntonymProps {
    word: string;
    synonyms: string[];
    antonyms: string[];
    meanings: string[];
    onSubmit: (answer: boolean) => void;
    showAnswer: boolean;
    onShowAnswer: () => void;
}

const SynonymAntonym: React.FC<SynonymAntonymProps> = ({
    word,
    synonyms,
    antonyms,
    meanings,
    onSubmit,
    showAnswer,
    onShowAnswer,
}) => {
    const [selectedWords, setSelectedWords] = useState<{
        synonyms: Set<string>;
        antonyms: Set<string>;
    }>({
        synonyms: new Set(),
        antonyms: new Set(),
    });

    const handleWordSelect = (word: string, type: 'synonyms' | 'antonyms') => {
        const newSelected = {
            ...selectedWords,
            [type]: new Set(selectedWords[type]),
        };

        if (newSelected[type].has(word)) {
            newSelected[type].delete(word);
        } else {
            newSelected[type].add(word);
        }

        setSelectedWords(newSelected);
    };

    const handleSubmit = () => {
        const hasSelections = selectedWords.synonyms.size > 0 || selectedWords.antonyms.size > 0;
        onSubmit(hasSelections);
    };

    // Tạo các từ sai ngẫu nhiên để thêm vào đáp án
    const getRandomWords = (list: string[], count: number) => {
        const shuffled = [...list].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    };

    // Kết hợp từ đúng và từ sai
    const randomSynonyms = getRandomWords(['bạn bè', 'mặt trời', 'hạnh phúc'], 2).concat(synonyms);
    const randomAntonyms = getRandomWords(['kẻ thù', 'đau khổ', 'bóng tối'], 2).concat(antonyms);

    return (
        <div className="space-y-6">
            <div className="bg-indigo-50 p-4 rounded-lg">
                <p className="text-sm text-indigo-700 font-medium">Xác định từ đồng nghĩa và trái nghĩa cho:</p>
                <p className="text-lg font-bold text-indigo-900">{word}</p>
            </div>

            <div className="space-y-4">
                <div>
                    <div className="flex items-center space-x-2 mb-3">
                        <Plus className="w-5 h-5 text-emerald-500" />
                        <h3 className="font-medium text-gray-700">Từ Đồng Nghĩa</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {randomSynonyms?.map((synonym, index) => (
                            <motion.button
                                key={index}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleWordSelect(synonym, 'synonyms')}
                                className={`p-3 rounded-lg text-center transition-colors ${selectedWords.synonyms.has(synonym) || showAnswer
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-gray-50 hover:bg-gray-100'
                                    }`}
                            >
                                {synonym}
                            </motion.button>
                        ))}
                    </div>
                </div>

                <div>
                    <div className="flex items-center space-x-2 mb-3">
                        <Minus className="w-5 h-5 text-rose-500" />
                        <h3 className="font-medium text-gray-700">Từ Trái Nghĩa</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {randomAntonyms?.map((antonym, index) => (
                            <motion.button
                                key={index}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleWordSelect(antonym, 'antonyms')}
                                className={`p-3 rounded-lg text-center transition-colors ${selectedWords.antonyms.has(antonym) || showAnswer
                                    ? 'bg-rose-100 text-rose-700'
                                    : 'bg-gray-50 hover:bg-gray-100'
                                    }`}
                            >
                                {antonym}
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Hiển thị nghĩa của từ */}
            <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <h4 className="text-gray-800 font-semibold">Nghĩa của từ:</h4>
                {meanings?.map((meaning, index) => (
                    <p key={index} className="text-gray-600 text-sm pl-4">
                        - {meaning}
                    </p>
                ))}
            </div>

            <button
                onClick={handleSubmit}
                disabled={
                    (!selectedWords.synonyms.size && !selectedWords.antonyms.size) || showAnswer
                }
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
                Kiểm tra đáp án
            </button>

            {showAnswer && (
                <div className="text-center mt-4">
                    <button
                        onClick={onShowAnswer}
                        className="text-indigo-600 underline hover:text-indigo-800"
                    >
                        Hiển thị đáp án
                    </button>
                </div>
            )}
        </div>
    );
};

export default SynonymAntonym;
