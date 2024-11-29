'use client';
import React, { useState, useEffect } from 'react';
import { useFlashcards } from '@/hooks/useFlashcards';
import FlashcardMode from './FlashcardMode';
import QuizMode from './QuizMode';

import NoWordsMessage from './NoWordsMessage';
import ErrorState from './ErrorState';
import LoadingState from './LoadingState';

interface FlashcardProps {
  mode: "collection" | "topic";
  id: string;
  isRevision?: boolean;
}

export const Flashcard: React.FC<FlashcardProps> = ({ mode, id, isRevision }) => {
  const {
    words,
    loading,
    error,
    progress,
    markWordAsLearned,
    submitPendingUpdates,
  } = useFlashcards({ mode, id, isRevision });

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [unknownWords, setUnknownWords] = useState<typeof words>([]);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [isLearnMode, setIsLearnMode] = useState(false);

  // Get the current path to determine whether we are in "new" or "review" mode
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

  useEffect(() => {
    if (isRevision && words.length > 0) {
      setIsQuizMode(true);
    }
  }, [isRevision, words]);

  useEffect(() => {
    if (!isRevision && currentWordIndex >= words.length) {
      if (unknownWords.length > 0) {
        setIsQuizMode(true);
        setCurrentWordIndex(0);
      }
    }
  }, [currentWordIndex, words.length, isRevision, unknownWords]);

  useEffect(() => {
    // Check if we are in "learn" or "review" mode based on the current path
    if (currentPath.includes('new new')) {
      setIsLearnMode(true);
    } else if (currentPath.includes('review')) {
      setIsLearnMode(false);
    }
  }, [currentPath]);

  if (loading) return <LoadingState />;
  if (words.length === 0) return <NoWordsMessage />;

  const handleWordLearned = async (wordId: string, isCorrect: boolean, isAlreadyKnow: boolean) => {
    const currentWord = words[currentWordIndex];

    if (!isCorrect && currentWord) {
      setUnknownWords((prev) => [...prev, currentWord]);
    }

    await markWordAsLearned(wordId, isCorrect, isAlreadyKnow);

    const nextIndex = currentWordIndex + 1;
    if (nextIndex < words.length) {
      setCurrentWordIndex(nextIndex);
    } else {
      if (unknownWords.length > 0) {
        setIsQuizMode(true);
      } else {
        await submitPendingUpdates();
      }
    }
  };

  return (
    <div className="flex relative flex-col justify-center items-center w-full pt-4">

      {unknownWords.length}
      {isQuizMode ? (
        <QuizMode
          unknownWords={unknownWords.length > 0 ? unknownWords : words}
          onComplete={() => {
            submitPendingUpdates();
            setUnknownWords([]);
          }}
        />
      ) : (
        <FlashcardMode
          words={words}
          currentIndex={currentWordIndex}
          progress={progress}
          onWordLearned={handleWordLearned}
        />
      )}
    </div>
  );
};
