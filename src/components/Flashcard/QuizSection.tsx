'use client';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Brain, Lightbulb, SkipForward } from 'lucide-react';
import confetti from 'canvas-confetti';
import { fetchWordDetails, updateLearningProgress, type WordDetail as WordDetailType } from '@/lib/api';
import ArrangeWords from './exercises/ArrangeWords';
import FillInTheBlank from './exercises/FillInTheBlank';
import ImageMatch from './exercises/ImageMatch';
import PronunciationMatch from './exercises/PronunciationMatch';
import SpeedTranslation from './exercises/SpeedTranslation';
import SyllableCount from './exercises/SyllableCount';
import TrueFalse from './exercises/TrueFalse';
import ResultCard from './ResultCard';
import ScoreIndicator from './ScoreIndicator';
import "./styles.css";

const exerciseTypes = [
  'Arrange Words',
  'Fill in the Blank',
  'True or False',
  'Image Match',
  'Syllable Count',
  'Pronunciation Match',
  'Speed Translation'
];

interface QuizSectionProps {
  unknownWords: { level: string; learningType: string; score: number; id: string; word: string }[];
  onComplete: () => void;
}

const QuizSection: React.FC<QuizSectionProps> = ({ unknownWords, onComplete }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [wordDetails, setWordDetails] = useState<WordDetailType | null>(null);
  const [currentExercise, setCurrentExercise] = useState<string>('');
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [pendingUpdates, setPendingUpdates] = useState<{ wordId: string; isCorrect: boolean }[]>([]);

  const hasMoreWords = currentWordIndex < unknownWords.length;
  const progressPercentage = Math.round((currentWordIndex / unknownWords.length) * 100);
  const currentWord = unknownWords[currentWordIndex] as { level: "NOT_RETAINED" | "BEGINNER" | "LEARNING" | "FAMILIAR" | "LEARNED" | "PROFICIENT" | "MASTER"; id: string; word: string };

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
      case 'Fill in the Blank':
        isCorrect = answer.toLowerCase() === wordDetails?.name.toLowerCase();
        break;
      case 'True or False':
      case 'Image Match':
      case 'Syllable Count':
      case 'Pronunciation Match':
      case 'Speed Translation':
        isCorrect = answer === true;
        break;
      default:
        isCorrect = answer.toLowerCase() === wordDetails?.name.toLowerCase();
    }

    setCorrect(isCorrect);

    // Lưu kết quả vào pendingUpdates
    setPendingUpdates((prev) => [...prev, { wordId: currentWord.id, isCorrect }]);
  };


  const handleNextWord = () => {
    setCorrect(null);
    setShowAnswer(false);
    if (currentWordIndex < unknownWords.length - 1) {
      setCurrentWordIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
      onComplete();
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

  useEffect(() => {
    console.log(pendingUpdates)
    if (isCompleted) {
      const updateProgress = async () => {
        try {
          if (pendingUpdates.length > 0) {
            await updateLearningProgress(pendingUpdates);
            setPendingUpdates([]);
          }
          alert("Hoàn thành!");
        } catch (error) {
          console.error(error);
        }
      };

      updateProgress();
    }
  }, [isCompleted, pendingUpdates]);





  const renderExercise = () => {
    if (!wordDetails) return null;

    const commonProps = {
      word: wordDetails.name,
      definition: wordDetails.meanings[0]?.definitions[0]?.definition,
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
            sentence={wordDetails.meanings[0]?.definitions[0]?.example || `The ${wordDetails.name} is an important concept.`}
          />
        );
      case 'True or False':
        return (
          <TrueFalse
            {...commonProps}
            statement={`The word "${wordDetails.name}" means: ${wordDetails.meanings[0]?.definitions[0]?.definition}`}
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
          />
        );
      case 'Pronunciation Match':
        return (
          <PronunciationMatch
            {...commonProps}
            phonetics={wordDetails.phonetics.map(p => ({
              text: p.text,
              audio: p.audio,
              accent: (p as any).accent || 'default-accent'
            }))}
          />
        );
      case 'Speed Translation':
        return (
          <SpeedTranslation
            {...commonProps}
            vietnamese={wordDetails.vietnamese || ''}
            timeLimit={30}
          />
        );
      default:
        return null;
    }
  };
  console.log(currentWord)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl flex flex-col gap-20 mx-auto "
    >
      <div className="  w-full mb-6 bg-[#BBEACB] rounded-full h-3">
        <div
          className="bg-green-500 h-3 rounded-full transition-all duration-500 ease-linear"
          style={{ width: `${progressPercentage}%` }}
        />
        <div className="flex justify-between items-center px-3 mt-3">
          <div className="font-medium text-[1.1rem]">Ôn tập từ vựng</div>
          <ScoreIndicator level={currentWord?.level} />
        </div>
      </div>

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
            <motion.div className="w-32 h-2 bg-indigo-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-indigo-500"
                initial={{ width: '0%' }}
                animate={{ width: `${((currentWordIndex + 1) / unknownWords.length) * 100}%` }}
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

            {correct !== null && wordDetails && (
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