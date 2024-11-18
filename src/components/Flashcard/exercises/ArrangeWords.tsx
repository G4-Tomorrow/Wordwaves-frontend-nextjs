import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight } from 'lucide-react';

interface ArrangeWordsProps {
    word: string;
    onSubmit: (answer: string) => void;
}

const ArrangeWords: React.FC<ArrangeWordsProps> = ({ word, onSubmit }) => {
    const [letters, setLetters] = useState<string[]>([]);
    const [arranged, setArranged] = useState<string[]>([]);

    useEffect(() => {
        setLetters([...word.split('')].sort(() => Math.random() - 0.5));
        setArranged([]);
    }, [word]);

    const handleLetterClick = (letter: string, index: number, isArranged: boolean) => {
        if (isArranged) {
            const newArranged = [...arranged];
            newArranged.splice(index, 1);
            setArranged(newArranged);
            setLetters([...letters, letter]);
        } else {
            const newLetters = [...letters];
            newLetters.splice(index, 1);
            setLetters(newLetters);
            setArranged([...arranged, letter]);
        }
    };

    const handleSubmit = () => {
        onSubmit(arranged.join(''));
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
                <div className="flex flex-wrap justify-center gap-2">
                    {arranged.map((letter, index) => (
                        <motion.button
                            key={`arranged-${index}`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-10 h-10 flex items-center justify-center bg-indigo-600 text-white rounded-lg font-bold"
                            onClick={() => handleLetterClick(letter, index, true)}
                        >
                            {letter}
                        </motion.button>
                    ))}
                </div>

                <ArrowLeftRight className="w-6 h-6 text-indigo-400" />

                <div className="flex flex-wrap justify-center gap-2">
                    {letters.map((letter, index) => (
                        <motion.button
                            key={`letter-${index}`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-10 h-10 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-lg font-bold"
                            onClick={() => handleLetterClick(letter, index, false)}
                        >
                            {letter}
                        </motion.button>
                    ))}
                </div>
            </div>

            <button
                onClick={handleSubmit}
                disabled={arranged.length !== word.length}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
                Check Answer
            </button>
        </div>
    );
};

export default ArrangeWords;