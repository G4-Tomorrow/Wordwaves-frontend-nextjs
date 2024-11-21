'use client';
import React, { useState, useEffect } from 'react';
import { FlipHorizontal, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from "framer-motion";
import { FaCheck, FaQuestionCircle } from "react-icons/fa";
import { fetchWordDetails, type WordDetail as WordDetailType } from '@/lib/api';
import WordDetail from './WordDetail';
import ScoreIndicator from './ScoreIndicator';
import { cn } from '@/lib/utils';

interface FlashcardModeProps {
    words: any;
    currentIndex: number;
    progress: { completed: number; total: number };
    onWordLearned: (wordId: string, isCorrect: boolean, isAlreadyKnow: boolean) => void;
}

const FlashcardMode: React.FC<FlashcardModeProps> = ({
    words,
    currentIndex,
    progress,
    onWordLearned,
}) => {
    const [flipped, setFlipped] = useState(false);
    const [wordDetails, setWordDetails] = useState<WordDetailType | null>(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

    const currentWord = words[currentIndex];
    const progressPercentage = Math.round((progress.completed / progress.total) * 100);

    useEffect(() => {
        const loadWordDetails = async () => {
            if (flipped && currentWord) {
                setLoadingDetails(true);
                try {
                    const details = await fetchWordDetails(currentWord.word);
                    setWordDetails(details.result);
                } catch (error) {
                    console.error('Failed to fetch word details:', error);
                } finally {
                    setLoadingDetails(false);
                }
            }
        };

        loadWordDetails();
    }, [flipped, currentWord]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            switch (event.code) {
                case "Space":
                    setFlipped(prev => !prev);
                    break;
                case "Enter":
                    onWordLearned(currentWord.id, true, true);
                    setFlipped(false);
                    break;
                case "Escape":
                    onWordLearned(currentWord.id, false, false);
                    setFlipped(false);
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentWord, onWordLearned]);

    const buttonVariants = {
        hover: {
            scale: 1.05,
            transition: { duration: 0.2, yoyo: Infinity }
        },
        tap: { scale: 0.95 }
    };

    const iconVariants = {
        initial: { rotate: 0 },
        hover: {
            rotate: 360,
            transition: { duration: 0.5, ease: "easeInOut" }
        }
    };

    return (
        <>
            <div className="w-4/5 bg-[#BBEACB] rounded-full h-3">
                <div
                    className="bg-green-500 h-3 rounded-full transition-all duration-500 ease-linear"
                    style={{ width: `${progressPercentage}%` }}
                />
                <div className="flex justify-between items-center px-3 mt-3">
                    <div className="font-medium text-[1.1rem]">Học từ mới</div>
                    <ScoreIndicator level={currentWord.level} />
                </div>
            </div>

            <div className="flex items-center w-[800px] relative flex-col p-4 pt-28">
                <div className={cn("flashcard relative w-full h-[400px] transition-all transform duration-500", flipped && "flipped")}>
                    <div className="front rounded-xl flex flex-col gap-3 items-center justify-between pt-10 pb-4">
                        <div className="flex flex-col gap-3 items-center justify-center">
                            <h2 className="text-2xl font-semibold">{currentWord.word}</h2>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <Volume2 className="text-blue-500" />
                                </Button>
                            </div>
                        </div>
                        <div className="text-primary flex items-center gap-3 font-medium">
                            <FlipHorizontal onClick={() => setFlipped(prev => !prev)} /> Lật - Nhấn Space
                        </div>
                    </div>

                    <div className="back rounded-xl overflow-y-auto">
                        <WordDetail details={wordDetails} isLoading={loadingDetails} />
                    </div>
                </div>
            </div>

            <div className="flex justify-center items-center w-[800px] bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="w-full max-w-2xl px-4">
                    <div className="actions flex flex-col sm:flex-row gap-3 w-full">
                        <motion.button
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                            className="w-full sm:w-1/2 bg-gradient-to-r from-emerald-500 to-green-500 text-white py-2 px-3 rounded-lg shadow-md hover:shadow-green-200/50 hover:shadow-lg font-medium text-sm transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 relative overflow-hidden group"
                            onClick={() => {
                                onWordLearned(currentWord.id, true, true);
                                setFlipped(false);
                            }}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <motion.div variants={iconVariants} initial="initial" whileHover="hover">
                                    <FaCheck className="text-base group-hover:scale-125 transition-transform" />
                                </motion.div>
                                <span>Đã biết - Nhấn Escape</span>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out -z-10" />
                        </motion.button>

                        <motion.button
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                            className="w-full sm:w-1/2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 px-3 rounded-lg shadow-md hover:shadow-blue-200/50 hover:shadow-lg font-medium text-sm transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 relative overflow-hidden group"
                            onClick={() => {
                                onWordLearned(currentWord.id, false, false);
                                setFlipped(false);
                            }}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <motion.div variants={iconVariants} initial="initial" whileHover="hover">
                                    <FaQuestionCircle className="text-base group-hover:scale-125 transition-transform" />
                                </motion.div>
                                <span>Chưa biết - Nhấn Enter</span>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out -z-10" />
                        </motion.button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FlashcardMode;