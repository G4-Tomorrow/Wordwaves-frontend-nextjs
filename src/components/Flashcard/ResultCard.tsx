import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Volume2, Book, Lightbulb, Image } from 'lucide-react';

interface ResultCardProps {
  correct: boolean;
  goToNextQuizWord: () => void;
  wordDetails: any;
}

const ResultCard: React.FC<ResultCardProps> = ({ correct, goToNextQuizWord, wordDetails }) => {
  // Hàm phát âm
  const playAudio = (url: string) => {
    const audio = new Audio(url);
    audio.play();
  };

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
              {correct ? 'Tuyệt vời!' : 'Cố gắng thêm nhé!'}
            </h3>
            <p className={`text-sm ${correct ? 'text-emerald-600' : 'text-rose-600'}`}>
              {correct
                ? "Bạn đã làm rất tốt! Bạn đã hiểu từ này rồi."
                : "Không sao đâu! Học cần sự kiên trì."}
            </p>
          </div>

          {/* Hình ảnh từ vựng */}
          {wordDetails.thumbnailUrl && (
            <div className="rounded-md overflow-hidden mb-4">
              <img
                src={wordDetails.thumbnailUrl}
                alt={wordDetails.name}
                className="w-full h-32 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Thông tin từ vựng */}
          <div className="bg-white/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Book className="w-4 h-4 text-indigo-600" />
                <span className="font-medium text-gray-700">
                  {wordDetails.name} <span className='text-[0.8rem]'>({wordDetails.vietnamese})</span>
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {/* Nút phát âm */}
                {wordDetails.phonetics?.map((phonetic: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => playAudio(phonetic.audio)}
                    className="text-sm text-gray-500 flex items-center space-x-1 hover:text-indigo-600"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>{phonetic.accent}</span>
                  </button>
                ))}
              </div>
            </div>

            {wordDetails.meanings?.map((meaning: any, index: number) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-medium text-gray-600">{meaning.partOfSpeech}</span>
                </div>
                <p className="text-sm text-gray-600 pl-6">{meaning.definitions[0].definition}</p>
                <p className="text-xs italic text-gray-600 pl-6">
                  {meaning.definitions[0].definitionMeaning}
                </p>
                {meaning.definitions[0].example && (
                  <p className="text-sm text-indigo-600 pl-6 italic">
                    "Ví dụ: {meaning.definitions[0].example}"
                  </p>
                )}
                {meaning.definitions[0].exampleMeaning && (
                  <p className="text-xs text-gray-600 pl-6 italic">
                    "Ý nghĩa ví dụ: {meaning.definitions[0].exampleMeaning}"
                  </p>
                )}
              </div>
            ))}

            {/* Từ đồng nghĩa */}
            {wordDetails.meanings?.[0]?.synonyms?.length > 0 && (
              <div className="pt-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Từ đồng nghĩa: </span>
                  {wordDetails.meanings[0].synonyms.slice(0, 5).join(", ")}
                </p>
              </div>
            )}
          </div>

          {/* Nút tiếp tục */}
          <button
            onClick={goToNextQuizWord}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors flex items-center justify-center space-x-2 ${correct
              ? 'bg-emerald-500 hover:bg-emerald-600'
              : 'bg-rose-500 hover:bg-rose-600'
              }`}
          >
            <span>Tiếp tục từ khác</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ResultCard;
