import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shuffle } from 'lucide-react';

interface DefinitionMatchingProps {
    word: string;
    definitions: Array<{
        definition: string;
        definitionMeaning: string;
    }>;
    onSubmit: (answer: boolean) => void;
    showAnswer: boolean;
}

const DefinitionMatching: React.FC<DefinitionMatchingProps> = ({
    definitions,
    onSubmit,
    showAnswer
}) => {
    const [selectedPairs, setSelectedPairs] = useState<{
        english: string | null;
        vietnamese: string | null;
    }>({
        english: null,
        vietnamese: null
    });

    const shuffledDefinitions = [...definitions].sort(() => Math.random() - 0.5);

    const handleSelection = (text: string, type: 'english' | 'vietnamese') => {
        const newPairs = { ...selectedPairs, [type]: text };

        if (newPairs.english && newPairs.vietnamese) {
            const matchingDef = definitions.find(
                d => d.definition === newPairs.english && d.definitionMeaning === newPairs.vietnamese
            );
            onSubmit(!!matchingDef);
            setSelectedPairs({ english: null, vietnamese: null });
        } else {
            setSelectedPairs(newPairs);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-indigo-50 p-4 rounded-lg">
                <p className="text-sm text-indigo-700 font-medium">Ghép nghĩa tiếng Anh - tiếng Việt:</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <h3 className="font-medium text-gray-700 mb-2">Tiếng Anh</h3>
                    {shuffledDefinitions.map((def, index) => (
                        <motion.button
                            key={`en-${index}`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSelection(def.definition, 'english')}
                            className={`w-full p-3 text-left rounded-lg transition-colors ${selectedPairs.english === def.definition
                                    ? 'bg-indigo-100 text-indigo-700'
                                    : 'bg-gray-50 hover:bg-gray-100'
                                }`}
                        >
                            {def.definition}
                        </motion.button>
                    ))}
                </div>

                <div className="space-y-2">
                    <h3 className="font-medium text-gray-700 mb-2">Tiếng Việt</h3>
                    {shuffledDefinitions.map((def, index) => (
                        <motion.button
                            key={`vi-${index}`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSelection(def.definitionMeaning, 'vietnamese')}
                            className={`w-full p-3 text-left rounded-lg transition-colors ${selectedPairs.vietnamese === def.definitionMeaning
                                    ? 'bg-indigo-100 text-indigo-700'
                                    : 'bg-gray-50 hover:bg-gray-100'
                                }`}
                        >
                            {def.definitionMeaning}
                        </motion.button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DefinitionMatching;