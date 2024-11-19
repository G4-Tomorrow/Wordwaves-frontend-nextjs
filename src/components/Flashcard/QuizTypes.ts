export const QUIZ_TYPES = {
  FILL_IN: "FILL_IN",
  WORD_SCRAMBLE: "WORD_SCRAMBLE",
  MEMORY_MATCH: "MEMORY_MATCH",
  TRUE_FALSE: "TRUE_FALSE",
  SENTENCE_BUILDER: "SENTENCE_BUILDER",
  LISTENING: "LISTENING",
  SPELLING: "SPELLING",
  WORD_CHAIN: "WORD_CHAIN",
  DEFINITION_MATCH: "DEFINITION_MATCH",
  MULTIPLE_CHOICE: "MULTIPLE_CHOICE",
} as const;

export type QuizType = (typeof QUIZ_TYPES)[keyof typeof QUIZ_TYPES];

export const getRandomQuizType = (word: string): QuizType => {
  // Filter suitable quiz types based on word characteristics
  const availableTypes: QuizType[] = [QUIZ_TYPES.MULTIPLE_CHOICE];

  // Add FILL_IN for words longer than 3 characters
  if (word.length > 3) {
    availableTypes.push(QUIZ_TYPES.FILL_IN);
  }

  // Add WORD_SCRAMBLE for words shorter than 8 characters
  if (word.length < 8) {
    availableTypes.push(QUIZ_TYPES.WORD_SCRAMBLE);
  }

  // Add other quiz types
  availableTypes.push(
    QUIZ_TYPES.TRUE_FALSE,
    QUIZ_TYPES.SPELLING,
    QUIZ_TYPES.LISTENING,
    QUIZ_TYPES.DEFINITION_MATCH
  );

  // Randomly select a quiz type
  const randomIndex = Math.floor(Math.random() * availableTypes.length);
  return availableTypes[randomIndex];
};
