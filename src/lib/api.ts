const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://backend-production-7ea7.up.railway.app/wordwaves";
export interface Phonetic {
  text: string;
  audio: string;
}

export interface Definition {
  definition: string;
  synonyms: string[];
  antonyms: string[];
  example: string | null;
}

export interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
  synonyms: string[];
  antonyms: string[];
}

export interface WordDetail {
  id: string;
  name: string;
  thumbnailUrl: string;
  vietnamese: string | null;
  phonetics: Phonetic[];
  meanings: Meaning[];
}

export interface WordDetailResponse {
  code: number;
  message: string;
  result: WordDetail;
}

export interface LearningWord {
  level: any;
  learningType:
    | "SENTENCE_BUILDER"
    | "MULTIPLE_CHOICE_MEANING"
    | "MULTIPLE_CHOICE"
    | "TRUE_FALSE"
    | "FILL_IN";
  score: number;
  id: string;
  word: string;
}

export interface LearningResponse {
  code: number;
  message: string;
  result: {
    numOfWords: number;
    numOfNotRetainedWords: number;
    words: LearningWord[];
  };
}

export interface WordUpdate {
  wordId: string;
  isCorrect: boolean;
}

export const fetchWordDetails = async (
  word: string
): Promise<WordDetailResponse> => {
  const accessToken = localStorage.getItem("accessToken");
  const response = await fetch(`${BASE_URL}/words/${word}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch word details");
  }
  return response.json();
};

export const fetchCollectionWords = async (
  collectionId: string,
  numOfWords: number = 20
): Promise<LearningResponse> => {
  const accessToken = localStorage.getItem("accessToken");

  const response = await fetch(
    `${BASE_URL}/learning/collections/${collectionId}/learn?numOfWords=${numOfWords}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch collection words");
  }
  return response.json();
};

export const fetchTopicReviewWords = async (
  topicId: string,
  numOfWords: number = 20
): Promise<LearningResponse> => {
  const accessToken = localStorage.getItem("accessToken");

  const response = await fetch(
    `${BASE_URL}/learning/topics/${topicId}/review?numOfWords=${numOfWords}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch topic review words");
  }
  return response.json();
};

export const updateLearningProgress = async (
  updates: WordUpdate[]
): Promise<void> => {
  const accessToken = localStorage.getItem("accessToken");

  const response = await fetch(`${BASE_URL}/learning`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error("Failed to update learning progress");
  }
};
export const fetchCollectionRevisionWords = async (
  collectionId: string,
  numOfWords: number = 5
): Promise<LearningResponse> => {
  const accessToken = localStorage.getItem("accessToken");

  const response = await fetch(
    `${BASE_URL}/learning/collections/${collectionId}/review?numOfWords=${numOfWords}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch collection revision words");
  }
  return response.json();
};

export const fetchTopicRevisionWords = async (
  topicId: string,
  numOfWords: number = 5
): Promise<LearningResponse> => {
  const accessToken = localStorage.getItem("accessToken");

  const response = await fetch(
    `${BASE_URL}/learning/topics/${topicId}/review?numOfWords=${numOfWords}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch topic revision words");
  }
  return response.json();
};
