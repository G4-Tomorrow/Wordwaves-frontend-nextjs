import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, RotateCw } from 'lucide-react';

interface FlashcardsProps {
    word: string;
    definition: string;
    phonetic: string;
    audioUrl?: string;
    onNext: () => void;
}

const Flashcards: React.FC<FlashcardsProps> = ({ word, definition, phonetic, audioUrl, onNext }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    const playAudio = () => {
        if (audioUrl) {
            new Audio(audioUrl).play();
        }
    };

    return (
        <div className="space-y-6">
            <motion.div
                className="relative w-full aspect-[3/4] cursor-pointer"
                onClick={() => setIsFlipped(!isFlipped)}
            >
                <motion.div
                    className={`absolute inset-0 rounded-xl p-6 flex flex-col items-center justify-center text-center ${isFlipped ? 'bg-indigo-600 text-white' : 'bg-white border-2 border-indigo-200'
                        }`}
                    initial={false}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {!isFlipped ? (
                        <>
                            <h3 className="text-3xl font-bold mb-4">{word}</h3>
                            <p className="text-indigo-600">{phonetic}</p>
                            {audioUrl && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        playAudio();
                                    }}
                                    className="mt-4 p-2 rounded-full hover:bg-indigo-50"
                                >
                                    <Volume2 className="w-6 h-6 text-indigo-600" />
                                </button>
                            )}
                        </>
                    ) : (
                        <p className="text-xl">{definition}</p>
                    )}
                </motion.div>
            </motion.div>

            <div className="flex space-x-4">
                <button
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="flex-1 py-3 px-4 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors flex items-center justify-center space-x-2"
                >
                    <RotateCw className="w-5 h-5" />
                    <span>Flip Card</span>
                </button>
                <button
                    onClick={onNext}
                    className="flex-1 py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    Next Word
                </button>
            </div>
        </div>
    );
};

export default Flashcards;