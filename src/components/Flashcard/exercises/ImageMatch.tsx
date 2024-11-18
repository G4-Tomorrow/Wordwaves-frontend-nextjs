import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Check, X } from 'lucide-react';

interface ImageMatchProps {
    word: string;
    imageUrl: string;
    onSubmit: (answer: boolean) => void;
    showAnswer: boolean;
    onShowAnswer: () => void;
}

const ImageMatch: React.FC<ImageMatchProps> = ({
    word,
    imageUrl,
    onSubmit,
    showAnswer,
    onShowAnswer
}) => {
    const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);

    const handleAnswer = (answer: boolean) => {
        setSelectedAnswer(answer);
        onSubmit(answer);
    };

    return (
        <div className="space-y-6">
            <div className="bg-indigo-50 p-4 rounded-lg">
                <p className="text-sm text-indigo-700 font-medium">Does this image represent the word:</p>
                <p className="text-lg font-bold text-indigo-900">{word}?</p>
            </div>

            <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={word}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-gray-400" />
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(true)}
                    className={`p-6 rounded-lg transition-colors flex flex-col items-center space-y-2 ${selectedAnswer === true || showAnswer
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-emerald-50 hover:bg-emerald-100'
                        }`}
                >
                    <Check className="w-8 h-8" />
                    <span className="font-medium">Yes, it matches</span>
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(false)}
                    className={`p-6 rounded-lg transition-colors flex flex-col items-center space-y-2 ${selectedAnswer === false
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-rose-50 hover:bg-rose-100'
                        }`}
                >
                    <X className="w-8 h-8" />
                    <span className="font-medium">No, it doesn't</span>
                </motion.button>
            </div>
        </div>
    );
};

export default ImageMatch;