import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'lucide-react';

interface WordAssociationProps {
    word: string;
    associations: string[];
    onSubmit: (answer: boolean) => void;
    showAnswer: boolean;
    onShowAnswer: () => void;
}

const WordAssociation: React.FC<WordAssociationProps> = ({
    word,
    associations,
    onSubmit,
    showAnswer,
    onShowAnswer
}) => {
    const [selectedWords, setSelectedWords] = useState<Set<string>>(new Set());

    const handleWordSelect = (association: string) => {
        const newSelected = new Set(selectedWords);
        if (newSelected.has(association)) {
            newSelected.delete(association);
        } else {
            newSelected.add(association);
        }
        setSelectedWords(newSelected);
    };

    const handleSubmit = () => {
        onSubmit(selectedWords.size > 0);
    };

    return (
        <div className="space-y-6">
            <div className="bg-indigo-50 p-4 rounded-lg">
                <p className="text-sm text-indigo-700 font-medium">Select words that are associated with:</p>
                <p className="text-lg font-bold text-indigo-900">{word}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {associations.map((association, index) => (
                    <motion.button
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleWordSelect(association)}
                        className={`p-4 rounded-lg text-center transition-colors ${selectedWords.has(association)
                                ? 'bg-indigo-600 text-white'
                                : showAnswer
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                            }`}
                    >
                        <div className="flex items-center justify-center space-x-2">
                            <Link className="w-4 h-4" />
                            <span>{association}</span>
                        </div>
                    </motion.button>
                ))}
            </div>

            <button
                onClick={handleSubmit}
                disabled={selectedWords.size === 0}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
                Check Associations
            </button>
        </div>
    );
};

export default WordAssociation;