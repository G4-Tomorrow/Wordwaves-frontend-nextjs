import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shuffle } from 'lucide-react';

interface MatchPairsProps {
    word: string;
    definition: string;
    synonyms: string[];
    onSubmit: (isCorrect: boolean) => void;
}

const MatchPairs: React.FC<MatchPairsProps> = ({ word, definition, synonyms, onSubmit }) => {
    const [pairs, setPairs] = useState<string[]>([]);
    const [selectedPair, setSelectedPair] = useState<string | null>(null);
    const [matches, setMatches] = useState<Set<string>>(new Set());

    useEffect(() => {
        const allPairs = [word, ...synonyms.slice(0, 3)];
        setPairs([...allPairs].sort(() => Math.random() - 0.5));
    }, [word, synonyms]);

    const handlePairClick = (pair: string) => {
        if (selectedPair === null) {
            setSelectedPair(pair);
        } else {
            if (selectedPair === word && pair === definition || selectedPair === definition && pair === word) {
                setMatches(new Set([...matches, selectedPair, pair]));
                if (matches.size === pairs.length - 2) {
                    onSubmit(true);
                }
            }
            setSelectedPair(null);
        }
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                {pairs.map((pair, index) => (
                    <motion.button
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-4 rounded-lg text-center transition-colors ${selectedPair === pair
                                ? 'bg-indigo-600 text-white'
                                : matches.has(pair)
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                            }`}
                        onClick={() => handlePairClick(pair)}
                        disabled={matches.has(pair)}
                    >
                        {pair}
                    </motion.button>
                ))}
            </div>

            <button
                onClick={() => setPairs([...pairs].sort(() => Math.random() - 0.5))}
                className="flex items-center justify-center space-x-2 w-full py-2 text-indigo-600 hover:text-indigo-700"
            >
                <Shuffle className="w-4 h-4" />
                <span>Shuffle Pairs</span>
            </button>
        </div>
    );
};

export default MatchPairs;