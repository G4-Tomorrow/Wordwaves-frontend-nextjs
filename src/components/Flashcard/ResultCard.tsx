'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import type { Vocabulary } from './types';

interface ResultCardProps {
  correct: boolean;
  unknownWords: Vocabulary[];
  goToNextQuizWord: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ correct, unknownWords, goToNextQuizWord }) => {
  return (
    <div className={`w-2/5 ${correct ? 'bg-[#dbffec]' : 'bg-[#ffe7e6]'} mt-4 absolute bottom-0 rounded-lg p-4`}>
      <p className={`font-semibold ${correct ? 'text-[#31b06e]' : 'text-[#f4493c]'}`}>
        {correct ? 'Chính xác' : 'Không chính xác'}
      </p>
      <p className={`font-semibold underline ${correct ? 'text-[#31b06e]' : 'text-[#f4493c]'}`}>
        {unknownWords[0].meaningVn}
      </p>
      <p className="italic text-[0.9rem]">Ví dụ: "{unknownWords[0].example}"</p>
      <div className="w-full flex justify-center py-4">
        <img
          className="h-20 w-20 object-cover rounded-lg"
          src="https://images.unsplash.com/photo-1682686581498-5e85c7228119?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
          alt="Word illustration"
        />
      </div>
      <Button
        className={`w-full ${correct ? 'bg-[#31b06e]' : 'bg-[#f4493c]'} text-white`}
        onClick={goToNextQuizWord}
      >
        Tiếp tục - Nhấn Space
      </Button>
    </div>
  );
};

export default ResultCard;