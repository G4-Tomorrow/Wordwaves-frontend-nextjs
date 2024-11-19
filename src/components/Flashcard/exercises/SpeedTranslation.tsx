import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Timer } from 'lucide-react';

interface SpeedTranslationProps {
    word: string;
    vietnamese: string;
    timeLimit: number;
    onSubmit: (answer: string) => void;
    showAnswer: boolean;
}

const SpeedTranslation: React.FC<SpeedTranslationProps> = ({
    word,
    vietnamese,
    timeLimit,
    onSubmit,
    showAnswer
}) => {
    const [answer, setAnswer] = useState('');
    const [timeLeft, setTimeLeft] = useState(timeLimit);
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        if (!isActive || showAnswer) return;

        const timer = setInterval(() => {
            setTimeLeft((time) => {
                if (time <= 1) {
                    setIsActive(false);
                    onSubmit(answer);
                    return 0;
                }
                return time - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isActive, showAnswer]);

    const handleSubmit = () => {
        setIsActive(false);
        onSubmit(answer);
    };

    return (
        <div className="space-y-6">
            <div className="bg-indigo-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-indigo-700 font-medium">Dịch nhanh trong thời gian:</p>
                    <div className="flex items-center space-x-2">
                        <Timer className="w-4 h-4 text-indigo-600" />
                        <span className="text-indigo-600 font-medium">{timeLeft}s</span>
                    </div>
                </div>
                <p className="text-lg font-bold text-indigo-900">{vietnamese}</p>
            </div>

            <div className="relative">
                <input
                    type="text"
                    value={showAnswer ? word : answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Nhập từ tiếng Anh..."
                    className="w-full p-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    disabled={!isActive || showAnswer}
                />
                <motion.div
                    className="absolute bottom-0 left-0 h-1 bg-indigo-500"
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: timeLimit, ease: 'linear' }}
                />
            </div>

            <button
                onClick={handleSubmit}
                disabled={!answer.trim() || !isActive || showAnswer}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
                Kiểm tra
            </button>
        </div>
    );
};

export default SpeedTranslation;