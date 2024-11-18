import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

interface ContextualUsageProps {
    word: string;
    examples: string[];
    onSubmit: (answer: string) => void;
    showAnswer: boolean;
    onShowAnswer: () => void;
}

const ContextualUsage: React.FC<ContextualUsageProps> = ({
    word,
    examples,
    onSubmit,
    showAnswer,
    onShowAnswer
}) => {
    const [userExample, setUserExample] = useState('');

    const handleSubmit = () => {
        onSubmit(userExample);
    };

    return (
        <div className="space-y-6">
            <div className="bg-indigo-50 p-4 rounded-lg">
                <p className="text-sm text-indigo-700 font-medium">Write a sentence using the word in context:</p>
                <p className="text-lg font-bold text-indigo-900">{word}</p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Example usages:</p>
                    {examples.map((example, index) => (
                        <div
                            key={index}
                            className="p-3 bg-gray-50 rounded-lg flex items-start space-x-3"
                        >
                            <BookOpen className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                            <p className="text-gray-600">{example}</p>
                        </div>
                    ))}
                </div>

                <textarea
                    value={showAnswer ? examples[0] : userExample}
                    onChange={(e) => setUserExample(e.target.value)}
                    placeholder="Write your own example..."
                    className="w-full p-3 border border-indigo-200 rounded-lg h-32 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    disabled={showAnswer}
                />
            </div>

            <button
                onClick={handleSubmit}
                disabled={!userExample.trim() || showAnswer}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
                Submit Example
            </button>
        </div>
    );
};

export default ContextualUsage;