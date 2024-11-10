"use client";

import { useState, useEffect } from "react";
import {
  fetchCollectionWords,
  fetchTopicReviewWords,
  updateLearningProgress,
  LearningWord,
  WordUpdate,
  fetchCollectionRevisionWords,
  fetchTopicRevisionWords,
} from "@/lib/api";

interface UseFlashcardsProps {
  mode: "collection" | "topic";
  id: string;
}

const MAX_SCORE = 5;

export const useFlashcards = ({ mode, id }: UseFlashcardsProps) => {
  const [words, setWords] = useState<LearningWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{
    total: number;
    completed: number;
  }>({ total: 0, completed: 0 });
  const [pendingUpdates, setPendingUpdates] = useState<WordUpdate[]>([]);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        setLoading(true);
        const response =
          mode === "collection"
            ? await fetchCollectionWords(id)
            : await fetchTopicReviewWords(id);

        setWords(response.result.words);
        setProgress({
          total: response.result.numOfWords,
          completed: 0,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch words");
      } finally {
        setLoading(false);
      }
    };

    fetchWords();
  }, [mode, id]);
  useEffect(() => {
    const fetchWords = async () => {
      try {
        setLoading(true);
        let response;

        if (mode === "collection") {
          response = await fetchCollectionRevisionWords(id);
        } else {
          response = await fetchTopicRevisionWords(id);
        }

        setWords(response.result.words);
        setProgress({
          total: response.result.numOfWords,
          completed: 0,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch words");
      } finally {
        setLoading(false);
      }
    };

    fetchWords();
  }, [mode, id]);
  const markWordAsLearned = async (
    wordId: string,
    isCorrect: boolean,
    isAlreadyKnow: boolean = false
  ) => {
    try {
      // Add to pending updates
      setPendingUpdates((prev) => [
        ...prev,
        { wordId, isCorrect, isAlreadyKnow },
      ]);

      // Update local state
      setWords((prev) =>
        prev.map((word) => {
          if (word.id === wordId) {
            return {
              ...word,
              score: isAlreadyKnow
                ? MAX_SCORE
                : isCorrect
                ? Math.min(word.score + 1, MAX_SCORE)
                : word.score,
              isAlreadyKnow,
            };
          }
          return word;
        })
      );

      setProgress((prev) => ({
        ...prev,
        completed: prev.completed + 1,
      }));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update progress"
      );
    }
  };

  const submitPendingUpdates = async () => {
    if (pendingUpdates.length === 0) return;

    try {
      await updateLearningProgress(pendingUpdates);
      setPendingUpdates([]); // Clear pending updates after successful submission
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit updates");
    }
  };

  // Submit pending updates when component unmounts or when switching modes
  useEffect(() => {
    return () => {
      if (pendingUpdates.length > 0) {
        submitPendingUpdates();
      }
    };
  }, []);

  return {
    words,
    loading,
    error,
    progress,
    markWordAsLearned,
    submitPendingUpdates,
    pendingUpdates,
  };
};
