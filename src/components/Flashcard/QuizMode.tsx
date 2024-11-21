'use client';
import React from 'react';
import QuizSection from './QuizSection';
import { LearningWord } from '@/lib/api';

interface QuizModeProps {
    unknownWords: any;
    onComplete: () => void;
}

const QuizMode: React.FC<QuizModeProps> = ({ unknownWords, onComplete }) => {
    return (
        <QuizSection
            unknownWords={unknownWords}
            onComplete={onComplete}
        />
    );
};

export default QuizMode;