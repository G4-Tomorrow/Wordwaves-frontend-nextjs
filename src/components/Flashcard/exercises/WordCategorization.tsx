import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tag } from 'lucide-react';

interface WordCategorizationProps {
    word: string;
    vietnamese: string;
    categories: string[];
    correctCategory: string;
    onSubmit: (answer: string) => void;
    showAnswer: boolean;
}

const WordCategorization: React.FC<WordCategorizationProps> = ({
    word,
    vietnamese,
    categories,
    correctCategory,
    onSubmit,
    showAnswer
}) => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const handleCategorySelect = (category: string) => {
        setSelectedCategory(category);
        onSubmit(category);
    };

    return (
        <div className="space-y-6">
            <div className="bg-indigo-50 p-4 rounded-lg">
                <p className="text-sm text-indigo-700 font-medium">Chọn chủ đề phù hợp cho từ:</p>
                <div className="mt-2">
                    <p className="text-lg font-bold text-indigo-900">{word}</p>
                    <p className="text-sm text-indigo-600">{vietnamese}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {categories.map((category, index) => (
                    <motion.button
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleCategorySelect(category)}
                        className={`p-4 rounded-lg transition-colors ${selectedCategory === category
                                ? 'bg-indigo-100 text-indigo-700'
                                : showAnswer && category === correctCategory
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-gray-50 hover:bg-gray-100'
                            }`}
                    >
                        <div className="flex items-center justify-center space-x-2">
                            <Tag className="w-4 h-4" />
                            <span>{category}</span>
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

export default WordCategorization;