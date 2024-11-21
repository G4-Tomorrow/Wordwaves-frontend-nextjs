"use client";
import { useState, useEffect, useCallback } from "react";
import {
  fetchCollectionWords,
  fetchTopicReviewWords,
  fetchCollectionRevisionWords,
  fetchTopicRevisionWords,
  updateLearningProgress,
  type LearningWord,
  type WordUpdate,
} from "@/lib/api";

interface UseFlashcardsProps {
  mode: "collection" | "topic" | "revision";
  id: string;
  isRevision?: boolean;
}

interface Progress {
  completed: number;
  total: number;
}

export const useFlashcards = ({ mode, id, isRevision }: UseFlashcardsProps) => {
  const [words, setWords] = useState<LearningWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<Progress>({
    completed: 0,
    total: 0,
  });
  const [pendingUpdates, setPendingUpdates] = useState<WordUpdate[]>([]);

  const fetchWords = useCallback(async () => {
    try {
      setLoading(true);
      let response;

      if (mode === "collection") {
        if (isRevision) {
          response = await fetchCollectionRevisionWords(id);
        } else {
          response = await fetchCollectionWords(id);
        }
      } else if (mode === "topic") {
        if (isRevision) {
          response = await fetchTopicRevisionWords(id);
        } else {
          response = await fetchTopicReviewWords(id);
        }
      }

      if (response) {
        setWords(response.result.words);
        setProgress({
          completed: 0,
          total: response.result.words.length,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch words");
    } finally {
      setLoading(false);
    }
  }, [mode, id, isRevision]);

  useEffect(() => {
    fetchWords();
  }, [fetchWords]);

  const markWordAsLearned = useCallback(
    async (
      wordId: string,
      isCorrect: boolean,
      isAlreadyKnow: boolean = false
    ) => {
      setPendingUpdates((prev) => [...prev, { wordId, isCorrect }]);

      setProgress((prev) => ({
        ...prev,
        completed: prev.completed + 1,
      }));
    },
    []
  );

  const submitPendingUpdates = useCallback(async () => {
    if (pendingUpdates.length === 0) return;

    try {
      await updateLearningProgress(pendingUpdates);
      setPendingUpdates([]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update learning progress"
      );
    }
  }, [pendingUpdates]);

  useEffect(() => {
    return () => {
      submitPendingUpdates();
    };
  }, [submitPendingUpdates]);

  return {
    words,
    loading,
    error,
    progress,
    markWordAsLearned,
    submitPendingUpdates,
  };
};
