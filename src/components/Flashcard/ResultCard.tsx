import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Volume2, Book, Lightbulb } from 'lucide-react';

interface ResultCardProps {
  correct: boolean;
  goToNextQuizWord: () => void;
  wordDetails: any;
}

const ResultCard: React.FC<ResultCardProps> = ({ correct, goToNextQuizWord, wordDetails }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl p-6 ${correct ? 'bg-emerald-50 border border-emerald-200' : 'bg-rose-50 border border-rose-200'
        }`}
    >
      <div className="flex items-start space-x-4">
        {correct ? (
          <CheckCircle className="w-8 h-8 text-emerald-500 flex-shrink-0" />
        ) : (
          <XCircle className="w-8 h-8 text-rose-500 flex-shrink-0" />
        )}

        <div className="flex-1 space-y-4">
          <div>
            <h3 className={`text-lg font-semibold ${correct ? 'text-emerald-700' : 'text-rose-700'
              }`}>
              {correct ? 'Excellent!' : 'Keep Practicing!'}
            </h3>
            <p className={`text-sm ${correct ? 'text-emerald-600' : 'text-rose-600'
              }`}>
              {correct
                ? "Great job! You've mastered this word."
                : "Don't worry! Learning takes practice."}
            </p>
          </div>

          <div className="bg-white/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Book className="w-4 h-4 text-indigo-600" />
                <span className="font-medium text-gray-700">{wordDetails.name}</span>
              </div>
              <span className="text-sm text-gray-500">{wordDetails.phonetics?.[0]?.text}</span>
            </div>

            {wordDetails.meanings?.map((meaning: any, index: number) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-medium text-gray-600">
                    {meaning.partOfSpeech}
                  </span>
                </div>
                <p className="text-sm text-gray-600 pl-6">
                  {meaning.definitions[0].definition}
                </p>
                {meaning.definitions[0].example && (
                  <p className="text-sm text-indigo-600 pl-6 italic">
                    "{meaning.definitions[0].example}"
                  </p>
                )}
              </div>
            ))}

            {wordDetails.meanings?.[0]?.synonyms?.length > 0 && (
              <div className="pt-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Synonyms: </span>
                  {wordDetails.meanings[0].synonyms.slice(0, 5).join(", ")}
                </p>
              </div>
            )}
          </div>

          <button
            onClick={goToNextQuizWord}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors flex items-center justify-center space-x-2 ${correct
              ? 'bg-emerald-500 hover:bg-emerald-600'
              : 'bg-rose-500 hover:bg-rose-600'
              }`}
          >
            <span>Continue to Next Word</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ResultCard;