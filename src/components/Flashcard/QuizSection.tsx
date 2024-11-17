'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FaSoundcloud } from 'react-icons/fa6';

import type { Vocabulary } from './types';

interface QuizSectionProps {
  quizType: string;
  unknownWords: Vocabulary[];
  multipleChoiceAnswers: string[];
  multipleChoiceMeanings: string[];
  selectedAnswer: string | null;
  correct: boolean | null;
  inputAnswer: string;
  trueFalseQuestion: string;
  handleMultipleChoiceAnswer: (selected: string) => void;
  handleMultipleChoiceMeaningAnswer: (selected: string) => void;
  handleFillInAnswer: () => void;
  handleHint: () => void;
  setInputAnswer: (value: string) => void;
  handleTrueFalseAnswer: (value: boolean) => void;
  setUnknownWords: React.Dispatch<React.SetStateAction<Vocabulary[]>>; // New prop to update unknownWords
}

const QuizSection: React.FC<QuizSectionProps> = ({
  quizType,
  unknownWords = [], // Khởi tạo giá trị mặc định là mảng rỗng
  multipleChoiceAnswers,
  multipleChoiceMeanings,
  selectedAnswer,
  correct,
  inputAnswer,
  trueFalseQuestion,
  handleMultipleChoiceAnswer,
  handleMultipleChoiceMeaningAnswer,
  handleFillInAnswer,
  handleHint,
  setInputAnswer,
  handleTrueFalseAnswer,
  setUnknownWords, // Getting the function to update unknownWords
}) => {
  // Kiểm tra nếu unknownWords không có hoặc rỗng
  if (!unknownWords || unknownWords.length === 0) {
    return <p className="text-lg font-semibold">Bạn đã ôn tập xong từ vựng!</p>;
  }

  // Function to handle answer submission and add the word back if it was incorrect
  const handleAnswerSubmission = (isCorrect: boolean, word: Vocabulary) => {
    if (!isCorrect) {
      // If answer is incorrect, add word back to unknownWords
      setUnknownWords((prevWords) => [...prevWords, word]);
    } else {
      // Remove the word from unknownWords if the answer was correct
      setUnknownWords((prevWords) => prevWords.filter((w) => w.id !== word.id));
    }
  };

  // Xử lý các loại câu hỏi khác nhau
  switch (quizType) {
    case "multipleChoiceMeaning":
      return (
        <div className="space-y-4">
          <p className="text-lg mb-2 text-center text-[0.9rem]">
            Chọn nghĩa đúng cho từ: "{unknownWords[0]?.word}"
          </p>
          <ul className="grid grid-cols-2 gap-10">
            {multipleChoiceMeanings.map((option) => (
              <li key={option} className="flex flex-col items-center">
                <Button
                  className={`w-24 h-24 ${selectedAnswer === option
                    ? correct && option === unknownWords[0]?.meaningVn
                      ? "bg-green-500"
                      : "bg-red-500"
                    : "bg-blue-500"
                    } text-white`}
                  onClick={() => {
                    handleMultipleChoiceMeaningAnswer(option);
                    handleAnswerSubmission(option === unknownWords[0]?.meaningVn, unknownWords[0]);
                  }}
                  disabled={selectedAnswer !== null}
                >
                  {option}
                </Button>
              </li>
            ))}
          </ul>
        </div>
      );

    case "multipleChoice":
      return (
        <div className="space-y-4">
          <p className="text-lg mb-2 text-center text-[0.9rem]">
            Chọn từ đúng cho nghĩa tiếng Việt: "{unknownWords[0]?.meaningVn}"
          </p>
          <ul className="grid grid-cols-2 gap-10">
            {multipleChoiceAnswers.map((option) => (
              <li key={option} className="flex flex-col items-center">
                <Button
                  className={`w-24 h-24 rounded-full ${selectedAnswer === option
                    ? correct && option === unknownWords[0]?.word
                      ? "bg-green-500"
                      : "bg-red-500"
                    : "bg-blue-500"
                    } text-white`}
                  onClick={() => {
                    handleMultipleChoiceAnswer(option);
                    handleAnswerSubmission(option === unknownWords[0]?.word, unknownWords[0]);
                  }}
                  disabled={selectedAnswer !== null}
                >
                  <FaSoundcloud className="h-12 w-12" />
                </Button>
                {option}
              </li>
            ))}
          </ul>
        </div>
      );

    case "fillIn":
      return (
        <div className="space-y-4 w-full max-w-md">
          <p className="text-lg mb-2 text-center text-[0.75rem]">
            Điền từ đúng cho nghĩa tiếng Việt: "{unknownWords[0]?.meaningVn}"
          </p>
          <input
            type="text"
            value={inputAnswer}
            onChange={(e) => setInputAnswer(e.target.value)}
            className={`w-full p-2 border rounded ${correct === true
              ? "bg-green-500 text-white"
              : correct === false
                ? "bg-red-500 text-white"
                : ""
              }`}
          />
          <div className="flex gap-4">
            <Button variant="outline" className="w-1/2" onClick={handleHint}>
              Gợi ý (2) - Nhấn Shift
            </Button>
            <Button className="w-1/2" onClick={() => {
              handleFillInAnswer();
              handleAnswerSubmission(inputAnswer === unknownWords[0]?.word, unknownWords[0]);
            }}>
              Kiểm tra - Nhấn Enter
            </Button>
          </div>
        </div>
      );

    case "trueFalse":
      return (
        <div className="bg-white rounded-lg p-4 h-[300px] w-full max-w-md">
          <div className="flex flex-col items-center justify-center gap-10 mb-8">
            <div className="font-bold text-xl">{unknownWords[0]?.word}</div>
            <div className="italic text-primary">có nghĩa là</div>
            <div className="text-xl">"{trueFalseQuestion}"</div>
          </div>
          <div className="flex gap-4">
            <Button className="w-1/2" onClick={() => {
              handleTrueFalseAnswer(true);
              handleAnswerSubmission(true, unknownWords[0]);
            }}>
              Đúng
            </Button>
            <Button variant="outline" className="w-1/2" onClick={() => {
              handleTrueFalseAnswer(false);
              handleAnswerSubmission(false, unknownWords[0]);
            }}>
              Sai
            </Button>
          </div>
        </div>
      );

    default:
      return null;
  }
};

export default QuizSection;
