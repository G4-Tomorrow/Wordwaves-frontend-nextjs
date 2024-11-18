import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

interface TrueFalseProps {
    word: string;
    statement: string;
    onSubmit: (answer: boolean) => void;
}

const TrueFalse: React.FC<TrueFalseProps> = ({ word, statement, onSubmit }) => {
    return (
        <div className="space-y-6">
            <div className="bg-indigo-50 p-4 rounded-lg">
                <p className="text-sm text-indigo-700 font-medium">Is this statement true or false?</p>
                <p className="text-lg font-bold text-indigo-900 mt-2">{statement}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSubmit(true)}
                    className="p-6 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-colors flex flex-col items-center space-y-2"
                >
                    <Check className="w-8 h-8 text-emerald-600" />
                    <span className="font-medium text-emerald-700">True</span>
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSubmit(false)}
                    className="p-6 rounded-lg bg-rose-50 hover:bg-rose-100 transition-colors flex flex-col items-center space-y-2"
                >
                    <X className="w-8 h-8 text-rose-600" />
                    <span className="font-medium text-rose-700">False</span>
                </motion.button>
            </div>
        </div>
    );
};

export default TrueFalse;