import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface SentenceBuilderProps {
    word: string;
    definition: string;
    onSubmit: (answer: string) => void;
}

const SentenceBuilder: React.FC<SentenceBuilderProps> = ({ word, definition, onSubmit }) => {
    const [sentence, setSentence] = useState('');

    return (
        <div className="space-y-4">
            <div className="bg-indigo-50 p-4 rounded-lg">
                <p className="text-sm text-indigo-700 font-medium">Create a sentence using the word:</p>
                <p className="text-lg font-bold text-indigo-900">{word}</p>
            </div>

            <textarea
                value={sentence}
                onChange={(e) => setSentence(e.target.value)}
                placeholder="Write your sentence here..."
                className="w-full p-3 border border-indigo-200 rounded-lg h-32 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />

            <button
                onClick={() => onSubmit(sentence)}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                disabled={!sentence.trim()}
            >
                Submit Sentence
            </button>
        </div>
    );
};

export default SentenceBuilder;