import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Languages } from 'lucide-react';

interface VietnameseToEnglishProps {
    word: string;
    definition: string;
    vietnamese: string;
    onSubmit: (answer: string) => void;
    showAnswer: boolean;
    onShowAnswer: () => void;
}

const VietnameseToEnglish: React.FC<VietnameseToEnglishProps> = ({
    word,
    vietnamese,
    onSubmit,
    showAnswer,
    onShowAnswer
}) => {
    const [answer, setAnswer] = useState('');

    return (
        <div className="space-y-6">
            <div className="bg-indigo-50 p-4 rounded-lg">
                <p className="text-sm text-indigo-700 font-medium">Dịch từ tiếng Việt sang tiếng Anh:</p>
                <p className="text-lg font-bold text-indigo-900">{vietnamese}</p>
            </div>

            <input
                type="text"
                value={showAnswer ? word : answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Nhập từ tiếng Anh..."
                className="w-full p-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                disabled={showAnswer}
            />

            <button
                onClick={() => onSubmit(answer)}
                disabled={!answer.trim() || showAnswer}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
                Kiểm tra
            </button>
        </div>
    );
};

export default VietnameseToEnglish;