'use client';
import React, { useEffect, useState } from 'react';
import { FlipHorizontal, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useFlashcards } from '@/hooks/useFlashcards';

import ResultCard from './ResultCard';
import WordDetail from './WordDetail';
import { motion } from "framer-motion";
import { FaCheck, FaQuestionCircle } from "react-icons/fa";
import { fetchWordDetails, type WordDetail as WordDetailType } from '@/lib/api';
import './styles.css';

import QuizSection from './QuizSection';
import ScoreIndicator from './ScoreIndicator';


interface FlashcardProps {

  mode: "collection" | "topic" | "revision";

  id: string;

  isRevision?: boolean;
}

const Flashcard: React.FC<FlashcardProps> = ({ mode, id, isRevision }) => {
  const {
    words,
    loading,
    error,
    progress,
    markWordAsLearned,
    submitPendingUpdates,
  } = useFlashcards({ mode, id, isRevision });

  const isReviewMode = mode === "revision";
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [quizMode, setQuizMode] = useState(false);
  const [inputAnswer, setInputAnswer] = useState("");
  const [multipleChoiceAnswers, setMultipleChoiceAnswers] = useState<string[]>([]);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [wordDetails, setWordDetails] = useState<WordDetailType | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [unknownWords, setUnknownWords] = useState(words);



  // const updateCurrentWord = (word: WordDetailType) => {
  //   const updatedWords = words.map((w) => (w.id === word.id ? word : w));
  //   setUnknownWords(updatedWords);
  // };

  useEffect(() => {
    if (!isReviewMode && currentWordIndex >= words.length) {
      if (unknownWords.length > 0) {
        console.log("Kích hoạt quizMode với các từ chưa biết:", unknownWords);
        setQuizMode(true);
        setCurrentWordIndex(0);
      } else {
        console.log("Bạn đã ôn tập xong từ vựng!");
        setQuizMode(false);
      }
    }
  }, [currentWordIndex, words.length, isReviewMode, unknownWords]);

  useEffect(() => {
    if (quizMode && words.length > 0) {
      const currentWord = words[currentWordIndex];
      const otherWords = words.filter((_, index) => index !== currentWordIndex);
      const randomWords = otherWords
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(w => w.word);
      setMultipleChoiceAnswers([currentWord.word, ...randomWords].sort(() => 0.5 - Math.random()));
    }
  }, [quizMode, currentWordIndex, words]);

  useEffect(() => {
    const loadWordDetails = async () => {
      if (flipped && words[currentWordIndex]) {
        setLoadingDetails(true);
        try {
          const details = await fetchWordDetails(words[currentWordIndex].word);
          setWordDetails(details.result);
        } catch (error) {
          console.error('Failed to fetch word details:', error);
        } finally {
          setLoadingDetails(false);
        }
      }
    };

    loadWordDetails();
  }, [flipped, currentWordIndex, words]);

  useEffect(() => {
    if (currentWordIndex === words.length - 1) {
      submitPendingUpdates();
    }
  }, [currentWordIndex, words.length]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case "Space":
          handleFlip();
          break;
        case "Enter":
          handleAnswer(true, true);
          break;
        case "Escape":
          handleAnswer(false);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentWordIndex, flipped, words]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (words.length === 0) {
    return <div>No words to learn</div>;
  }

  const currentWord = words[currentWordIndex];
  const progressPercentage = Math.round((progress.completed / progress.total) * 100);

  const handleFlip = () => setFlipped(prev => !prev);

  const handleAnswer = async (isCorrect: boolean, isAlreadyKnow: boolean = false) => {
    const currentWord = words[currentWordIndex];

    if (!isCorrect && currentWord) {
      setUnknownWords((prev) => [...prev, currentWord]);
    }
    await markWordAsLearned(currentWord.id, isCorrect, isAlreadyKnow);

    const nextIndex = currentWordIndex + 1;

    if (nextIndex < words.length) {
      setCurrentWordIndex(nextIndex);
      setFlipped(false);
    } else if (unknownWords.length > 0) {
      setQuizMode(true);
    } else {
      setQuizMode(false);
      console.log("Bạn đã hoàn thành ôn tập!");
    }
  };

  const handleQuizAnswer = (isCorrect: boolean) => {
    setCorrect(isCorrect);
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        yoyo: Infinity
      }
    },
    tap: {
      scale: 0.95
    }
  };

  const iconVariants = {
    initial: { rotate: 0 },
    hover: {
      rotate: 360,
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="flex relative flex-col justify-center items-center w-full pt-4">

      {!quizMode && (
        <div className="w-4/5 bg-[#BBEACB] onClick={handleFlip}  rounded-full h-3">
          <div
            className="bg-green-500 h-3 rounded-full transition-all duration-500 ease-linear"
            style={{ width: `${progressPercentage}%` }}
          />
          <div className="flex justify-between items-center  px-3 mt-3">
            <div className="font-medium text-[1.1rem]">
              {isReviewMode ? "Ôn tập" : "Học từ mới"}
            </div>

            <ScoreIndicator level={currentWord.level} />

          </div>
        </div>)

      }

      <div className={`flex items-center w-[800px] relative flex-col p-4 ${!quizMode ? 'pt-28' : 'pt-0'}`}>
        {!quizMode ? (
          <div className={cn("flashcard relative w-full h-[400px] transition-all transform duration-500", flipped && "flipped")}>
            <div className="front  rounded-xl flex flex-col gap-3 items-center justify-between pt-10 pb-4">
              <div className="flex flex-col gap-3 items-center justify-center">
                <h2 className="text-2xl font-semibold">{currentWord.word}</h2>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Volume2 className="text-blue-500" />
                  </Button>
                </div>
              </div>
              <div className="text-primary flex items-center gap-3 font-medium">
                <FlipHorizontal onClick={handleFlip} /> Lật - Nhấn Space
              </div>
            </div>

            <div className="back rounded-xl overflow-y-auto ">
              <WordDetail details={wordDetails} isLoading={loadingDetails} />
            </div>
          </div>
        ) : (
          <QuizSection

            unknownWords={unknownWords}

          />
        )}
      </div>
      {!quizMode && (
        <div className="flex justify-center items-center w-[800px]  bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="w-full max-w-2xl px-4">
            <div className="actions flex flex-col sm:flex-row gap-3 w-full">
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="w-full sm:w-1/2 bg-gradient-to-r from-emerald-500 to-green-500 text-white py-2 px-3 rounded-lg shadow-md hover:shadow-green-200/50 hover:shadow-lg font-medium text-sm transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 relative overflow-hidden group"
                onClick={() => handleAnswer(true, true)}
              >
                <div className="flex items-center justify-center gap-2">
                  <motion.div
                    variants={iconVariants}
                    initial="initial"
                    whileHover="hover"
                  >
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
                onClick={() => handleAnswer(false)}
              >
                <div className="flex items-center justify-center gap-2">
                  <motion.div
                    variants={iconVariants}
                    initial="initial"
                    whileHover="hover"
                  >
                    <FaQuestionCircle className="text-base group-hover:scale-125 transition-transform" />
                  </motion.div>
                  <span>Chưa biết - Nhấn Enter</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out -z-10" />
              </motion.button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Flashcard;