import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface FillInTheBlankProps {
    word: string;
    sentence: string;
    onSubmit: (answer: string) => void;
}

const FillInTheBlank: React.FC<FillInTheBlankProps> = ({ word, sentence, onSubmit }) => {
    const [answer, setAnswer] = useState('');
    const blankSentence = sentence.replace(word, '_____');

    return (
        <div className="space-y-4">
            <div className="bg-indigo-50 p-4 rounded-lg">
                <p className="text-sm text-indigo-700 font-medium">Fill in the blank with the correct word:</p>
                <p className="text-lg font-bold text-indigo-900">{blankSentence}</p>
            </div>

            <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer..."
                className="w-full p-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />

            <button
                onClick={() => onSubmit(answer)}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                disabled={!answer.trim()}
            >
                Submit Answer
            </button>
        </div>
    );
};

export default FillInTheBlank;