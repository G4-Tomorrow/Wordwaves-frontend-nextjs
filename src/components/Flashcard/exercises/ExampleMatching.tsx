import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

interface ExampleMatchingProps {
    word: string;
    examples: Array<{
        example: string;
        exampleMeaning: string;
    }>;
    onSubmit: (answer: boolean) => void;
    showAnswer: boolean;
}

const ExampleMatching: React.FC<ExampleMatchingProps> = ({
    examples,
    onSubmit,
    showAnswer
}) => {
    const [selectedExample, setSelectedExample] = useState<{
        english: string | null;
        vietnamese: string | null;
    }>({
        english: null,
        vietnamese: null
    });

    const shuffledExamples = [...examples].sort(() => Math.random() - 0.5);

    const handleSelection = (text: string, type: 'english' | 'vietnamese') => {
        const newSelection = { ...selectedExample, [type]: text };

        if (newSelection.english && newSelection.vietnamese) {
            const isMatch = examples.some(
                ex => ex.example === newSelection.english && ex.exampleMeaning === newSelection.vietnamese
            );
            onSubmit(isMatch);
            setSelectedExample({ english: null, vietnamese: null });
        } else {
            setSelectedExample(newSelection);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-indigo-50 p-4 rounded-lg">
                <p className="text-sm text-indigo-700 font-medium">Ghép câu ví dụ tiếng Anh - tiếng Việt:</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <h3 className="font-medium text-gray-700 mb-2">Câu tiếng Anh</h3>
                    {shuffledExamples.map((ex, index) => (
                        <motion.button
                            key={`en-${index}`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSelection(ex.example, 'english')}
                            className={`w-full p-3 text-left rounded-lg transition-colors ${selectedExample.english === ex.example
                                    ? 'bg-indigo-100 text-indigo-700'
                                    : 'bg-gray-50 hover:bg-gray-100'
                                }`}
                        >
                            <div className="flex items-start space-x-2">
                                <BookOpen className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-1" />
                                <span>{ex.example}</span>
                            </div>
                        </motion.button>
                    ))}
                </div>

                <div className="space-y-2">
                    <h3 className="font-medium text-gray-700 mb-2">Câu tiếng Việt</h3>
                    {shuffledExamples.map((ex, index) => (
                        <motion.button
                            key={`vi-${index}`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSelection(ex.exampleMeaning, 'vietnamese')}
                            className={`w-full p-3 text-left rounded-lg transition-colors ${selectedExample.vietnamese === ex.exampleMeaning
                                    ? 'bg-indigo-100 text-indigo-700'
                                    : 'bg-gray-50 hover:bg-gray-100'
                                }`}
                        >
                            <div className="flex items-start space-x-2">
                                <BookOpen className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-1" />
                                <span>{ex.exampleMeaning}</span>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ExampleMatching;