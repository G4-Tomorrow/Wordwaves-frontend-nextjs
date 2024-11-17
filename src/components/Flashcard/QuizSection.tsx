import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, ChevronRight, Award, Brain } from 'lucide-react';
import ResultCard from './ResultCard';
import { fetchWordDetails } from '@/lib/api';

const exerciseTypes = [
  'Sentence Builder',
  'Pronunciation Quiz',
  'Match Pairs',
  'Arrange Words',
  'Multiple Choice Quiz',
  'Fill in the Blank',
  'Spelling Quiz',
  'Flashcards',
  'True or False'
];

interface QuizSectionProps {
  unknownWords: { level: string; learningType: string; score: number; id: string; word: string }[];
}

const QuizSection: React.FC<QuizSectionProps> = ({ unknownWords }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [inputAnswer, setInputAnswer] = useState<string>('');
  const [wordDetails, setWordDetails] = useState<any>(null);
  const [currentExercise, setCurrentExercise] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [showDefinition, setShowDefinition] = useState(false);

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
      setShowDefinition(false);
    }
  }, [currentWordIndex, unknownWords, hasMoreWords]);

  const toggleAudio = () => {
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleCheckAnswer = () => {
    if (!inputAnswer.trim()) return;

    let isCorrect = false;
    switch (currentExercise) {
      case 'Spelling Quiz':
        isCorrect = inputAnswer.toLowerCase() === wordDetails.name.toLowerCase();
        break;
      case 'Multiple Choice Quiz':
      case 'True or False':
        isCorrect = inputAnswer.toLowerCase() === wordDetails.meanings[0].definitions[0].definition.toLowerCase();
        break;
      default:
        isCorrect = inputAnswer.toLowerCase() === wordDetails.name.toLowerCase();
    }
    setCorrect(isCorrect);
  };

  const handleNextWord = () => {
    if (currentWordIndex < unknownWords.length - 1) {
      setCorrect(null);
      setInputAnswer('');
      setShowDefinition(false);
      setCurrentWordIndex((prev) => prev + 1);
    } else {

    }
  };

  if (!hasMoreWords) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[400px] p-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl shadow-lg"
      >
        <Award className="w-16 h-16 text-indigo-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Congratulations!</h2>
        <p className="text-gray-600 text-center">You've completed all your review words. Great job!</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Start New Review
        </button>
      </motion.div>
    );
  }


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
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
            >
              <motion.div
                className="h-full bg-indigo-500"
                initial={{ width: '0%' }}
                animate={{ width: `${((currentWordIndex + 1) / unknownWords.length) * 100}%` }}
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
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-semibold text-indigo-900 mb-2">
                  {wordDetails?.name}
                </h3>
                <div className="flex items-center space-x-3">
                  <span className="text-indigo-600 font-medium">{wordDetails?.phonetics?.[0]?.text}</span>
                  <button
                    onClick={toggleAudio}
                    className="p-2 hover:bg-indigo-50 rounded-full transition-colors"
                  >
                    {isPlaying ? (
                      <VolumeX className="w-5 h-5 text-indigo-600" />
                    ) : (
                      <Volume2 className="w-5 h-5 text-indigo-600" />
                    )}
                  </button>
                </div>
              </div>
              {wordDetails?.thumbnailUrl && (
                <img
                  src={wordDetails.thumbnailUrl}
                  alt={wordDetails.name}
                  className="w-32 h-32 object-cover rounded-lg shadow-md"
                />
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full">
                  {currentExercise}
                </span>
                <button
                  onClick={() => setShowDefinition(!showDefinition)}
                  className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center"
                >
                  {showDefinition ? 'Hide' : 'Show'} Definition
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>

              <AnimatePresence>
                {showDefinition && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="text-gray-700 bg-indigo-50 p-4 rounded-lg">
                      {wordDetails?.meanings?.[0]?.definitions?.[0]?.definition}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-4">
                <input
                  type="text"
                  value={inputAnswer}
                  onChange={(e) => setInputAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  onKeyPress={(e) => e.key === 'Enter' && handleCheckAnswer()}
                />

                <div className="flex space-x-3">
                  <button
                    onClick={handleCheckAnswer}
                    className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                    disabled={!inputAnswer.trim()}
                  >
                    Check Answer
                  </button>
                  {correct !== null && (
                    <button
                      onClick={handleNextWord}
                      className="flex-1 bg-indigo-500 text-white py-3 rounded-lg hover:bg-indigo-600 transition-colors flex items-center justify-center space-x-2"
                    >
                      <span>Next Word</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

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