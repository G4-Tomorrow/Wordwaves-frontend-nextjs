import { fetchWordDetails } from '@/lib/api';
import confetti from 'canvas-confetti';
import { AnimatePresence, motion } from 'framer-motion';
import { Award, Brain, Lightbulb, SkipForward } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import "./Congratulations.css";
import ResultCard from './ResultCard';
import ArrangeWords from './exercises/ArrangeWords';
import FillInTheBlank from './exercises/FillInTheBlank';
import ImageMatch from './exercises/ImageMatch';
import PronunciationMatch from './exercises/PronunciationMatch';
import SpeedTranslation from './exercises/SpeedTranslation';
import SyllableCount from './exercises/SyllableCount';
import TrueFalse from './exercises/TrueFalse';

// Mock data for exercises
const mockSynonyms = [
  "happy", "joyful", "pleased", "delighted", "content",
  "cheerful", "merry", "jubilant", "thrilled", "elated"
];

const mockAntonyms = [
  "sad", "unhappy", "miserable", "depressed", "gloomy",
  "melancholy", "sorrowful", "downcast", "dejected", "heartbroken"
];

const mockDefinitions = [
  "A state of well-being characterized by emotions ranging from contentment to intense joy",
  "A feeling of great pleasure and contentment",
  "Experiencing or showing pleasure or contentment",
  "Feeling or expressing joy; pleased"
];

const mockCategories = [
  "Category 1",
  "Category 2",
  "Category 3",
  "Category 4",
  "Category 5"
];

const exerciseTypes = [
  // 'Sentence Builder',
  // 'Word Association',
  'Arrange Words',
  // 'Multiple Choice Quiz',
  'Fill in the Blank',
  // 'Flashcards',
  'True or False',
  'Image Match',
  // 'Contextual Usage',
  // 'Synonym Antonym',
  // 'Match Pairs',
  'Syllable Count',
  // 'Accent Comparison',
  // 'Definition Matching',
  // 'Example Matching',
  'Pronunciation Match',
  'Speed Translation', //nay dang bi loi
  // 'Word Categorization'
];

// Mock data for examples
const mockExamples = [
  "Example sentence 1 using the word.",
  "Example sentence 2 using the word.",
  "Example sentence 3 using the word."
];

interface QuizSectionProps {
  unknownWords: { level: string; learningType: string; score: number; id: string; word: string }[];
}

const QuizSection: React.FC<QuizSectionProps> = ({ unknownWords }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [wordDetails, setWordDetails] = useState<any>(null);
  const [currentExercise, setCurrentExercise] = useState<string>('');
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [correctCategory, setCorrectCategory] = useState<string>('');

  const hasMoreWords = currentWordIndex < unknownWords.length;

  useEffect(() => {
    const getWordDetails = async (word: string) => {
      try {
        const details = await fetchWordDetails(word);
        setWordDetails(details.result);
        if (details.result.phonetics?.[0]?.audio) {
          setAudio(new Audio(details.result.phonetics[0].audio));
        }
      } catch (error) {
        console.error('Error fetching word details:', error);
      }
    };

    if (hasMoreWords) {
      getWordDetails(unknownWords[currentWordIndex].word);
      setCurrentExercise(exerciseTypes[Math.floor(Math.random() * exerciseTypes.length)]);
      setShowAnswer(false);
    }
  }, [currentWordIndex, unknownWords, hasMoreWords]);

  const handleAnswer = (answer: any) => {
    let isCorrect = false;

    switch (currentExercise) {


      case 'Arrange Words':
        isCorrect = answer.toLowerCase() === wordDetails.name.toLowerCase();
        break;

      case 'Fill in the Blank':
        isCorrect = answer.toLowerCase() === wordDetails.name.toLowerCase();
        break;
      case 'True or False':
        isCorrect = answer === true;
        break;
      case 'Image Match':
        isCorrect = answer === true;
        break;


      case 'Syllable Count':
        isCorrect = answer === true;
        break;

        isCorrect = answer === true;
        break;
      case 'Pronunciation Match':
        isCorrect = answer === true;
        break;
      case 'Speed Translation':
        isCorrect = answer === true;
        break;


      default:
        isCorrect = answer.toLowerCase() === wordDetails.name.toLowerCase();
    }

    setCorrect(isCorrect);
  };

  const handleNextWord = () => {
    setCorrect(null);
    setShowAnswer(false);
    if (currentWordIndex < unknownWords.length - 1) {
      setCurrentWordIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleSkip = () => {
    setCorrect(null);
    setShowAnswer(false);
    handleNextWord();
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  if (isCompleted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 150 }}
        className="relative flex flex-col items-center justify-center min-h-[500px] p-12 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 rounded-3xl shadow-2xl shadow-purple-300/50 overflow-hidden"
      >
        {/* Hiệu ứng ánh sáng di chuyển */}
        <div className="absolute -top-10 -left-10 w-80 h-80 bg-gradient-to-r from-pink-400 to-purple-500 opacity-20 blur-3xl animate-pulse-slow rounded-full"></div>
        <div className="absolute -bottom-20 right-0 w-96 h-96 bg-gradient-to-t from-indigo-400 to-purple-600 opacity-30 blur-3xl animate-pulse-slow rounded-full"></div>

        {/* Icon với hiệu ứng xoay */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
          className="relative mb-8"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-pink-500 blur-lg opacity-40 rounded-full animate-pulse"></div>
          <Award className="w-28 h-28 text-indigo-600 relative animate-bounce" />
        </motion.div>

        {/* Tiêu đề chúc mừng với hiệu ứng */}
        <motion.h2
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 80 }}
          className="text-5xl font-extrabold text-gray-900 mb-6 tracking-wide animate-text-gradient"
        >
          Chúc mừng bạn! 🎉
        </motion.h2>

        {/* Nội dung */}
        <motion.p
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-xl text-gray-700 text-center mb-10 animate-fade-in"
        >
          Bạn đã hoàn thành tất cả các từ cần ôn tập! 🌟
        </motion.p>

        {/* Nút hành động với hiệu ứng rung nhẹ */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex gap-6"
        >
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-4 bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-transform duration-300 ease-out animate-wiggle"
          >
            Bắt đầu lại phiên mới
          </button>
        </motion.div>
      </motion.div>

    );
  }

  const renderExercise = () => {
    if (!wordDetails) return null;

    const commonProps = {
      word: wordDetails.name,
      definition: wordDetails.meanings[0].definitions[0].definition,
      onSubmit: handleAnswer,
      showAnswer,
      onShowAnswer: handleShowAnswer
    };

    switch (currentExercise) {


      case 'Arrange Words':
        return <ArrangeWords {...commonProps} />;


      case 'Fill in the Blank':
        return (
          <FillInTheBlank
            {...commonProps}
            sentence={wordDetails.meanings[0].definitions[0].example || `The ${wordDetails.name} is an important concept.`}
          />
        );

      case 'True or False':
        return (
          <TrueFalse
            {...commonProps}
            statement={`The word "${wordDetails.name}" means: ${wordDetails.meanings[0].definitions[0].definition}`}
          />
        );
      case 'Image Match':
        return (
          <ImageMatch
            {...commonProps}
            imageUrl={wordDetails.thumbnailUrl}
          />
        );


      case 'Syllable Count':
        return (
          <SyllableCount
            {...commonProps}
            phonetics={wordDetails.phonetics}
            onSubmit={handleAnswer}
            showAnswer={showAnswer}
          />
        );


      case 'Pronunciation Match':
        return (
          <PronunciationMatch
            {...commonProps}
            phonetics={wordDetails.phonetics}
            onSubmit={handleAnswer}
            showAnswer={showAnswer}
          />
        );
      case 'Speed Translation':
        return (
          <SpeedTranslation
            {...commonProps}
            vietnamese={wordDetails.meanings[0].definitions[0].example}
            timeLimit={30}
            onSubmit={handleAnswer}
            showAnswer={showAnswer}
          />
        );


      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-6"
    >
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-indigo-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Brain className="w-8 h-8 text-indigo-500" />
            <h2 className="text-2xl font-bold text-gray-800">Word Review</h2>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-indigo-600">
              {currentWordIndex + 1}/{unknownWords.length}
            </span>
            <motion.div
              className="w-32 h-2 bg-indigo-100 rounded-full overflow-hidden"
            >
              <motion.div
                className="h-full bg-indigo-500"
                initial={{ width: '0%' }}
                animate={{
                  width: `${((currentWordIndex + 1) / unknownWords.length) * 100}%`,
                }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentWordIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full">
                {currentExercise}
              </span>
              <div className="flex items-center space-x-3">
                {!showAnswer && !correct && (
                  <button
                    onClick={handleShowAnswer}
                    className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 px-3 py-2 rounded-lg hover:bg-indigo-50 transition-colors"
                  >
                    <Lightbulb className="w-4 h-4" />
                    <span>Show Answer</span>
                  </button>
                )}
                <button
                  onClick={handleSkip}
                  className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <SkipForward className="w-4 h-4" />
                  <span>Skip</span>
                </button>
              </div>
            </div>

            {renderExercise()}

            {correct !== null && (
              <ResultCard
                correct={correct}
                goToNextQuizWord={handleNextWord}
                wordDetails={wordDetails}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default QuizSection;