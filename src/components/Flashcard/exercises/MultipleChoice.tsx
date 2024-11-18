import React from 'react';
import { motion } from 'framer-motion';

interface MultipleChoiceProps {
    word: string;
    correctDefinition: string;
    wrongDefinitions: string[];
    onSubmit: (answer: string) => void;
}

const MultipleChoice: React.FC<MultipleChoiceProps> = ({
    word,
    correctDefinition,
    wrongDefinitions,
    onSubmit,
}) => {
    const options = [correctDefinition, ...wrongDefinitions]
        .sort(() => Math.random() - 0.5);

    return (
        <div className="space-y-4">
            <div className="bg-indigo-50 p-4 rounded-lg">
                <p className="text-sm text-indigo-700 font-medium">Choose the correct definition for:</p>
                <p className="text-lg font-bold text-indigo-900">{word}</p>
            </div>

            <div className="space-y-3">
                {options.map((option, index) => (
                    <motion.button
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onSubmit(option)}
                        className="w-full p-4 text-left rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-colors"
                    >
                        {option}
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

export default MultipleChoice;