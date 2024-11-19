import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface MultipleChoiceProps {
    word: string;
    correctDefinition: string;
    wrongDefinitions: string[];
    onSubmit: (isCorrect: boolean) => void;
}

const MultipleChoice: React.FC<MultipleChoiceProps> = ({
    word,
    correctDefinition,
    wrongDefinitions,
    onSubmit,
}) => {
    // Kết hợp đáp án đúng và sai rồi xáo trộn thứ tự
    const options = [correctDefinition, ...wrongDefinitions].sort(() => Math.random() - 0.5);

    // State để lưu trạng thái đáp án đã chọn
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    // Xử lý khi chọn đáp án
    const handleSelect = (option: string) => {
        setSelectedOption(option);
        onSubmit(option === correctDefinition);
    };

    return (
        <div className="space-y-6">
            {/* Phần hiển thị từ cần chọn nghĩa */}
            <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-700 font-medium">Chọn nghĩa đúng của từ:</p>
                <p className="text-lg font-bold text-blue-900">{word}</p>
            </div>

            {/* Hiển thị các đáp án */}
            <div className="space-y-3">
                {options.map((option, index) => {
                    // Xác định màu sắc cho từng đáp án sau khi đã chọn
                    const isCorrect = option === correctDefinition;
                    const isSelected = option === selectedOption;
                    const optionClass = selectedOption
                        ? isCorrect
                            ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                            : isSelected
                                ? 'bg-rose-100 text-rose-700 border-rose-300'
                                : 'bg-gray-50 text-gray-700'
                        : 'hover:bg-blue-50 border-blue-200';

                    return (
                        <motion.button
                            key={index}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSelect(option)}
                            disabled={!!selectedOption} // Chặn chọn lại khi đã chọn xong
                            className={`w-full p-4 text-left rounded-lg border transition-colors ${optionClass}`}
                        >
                            {option}
                        </motion.button>
                    );
                })}
            </div>

            {/* Thông báo kết quả */}
            {selectedOption && (
                <div className="mt-4">
                    {selectedOption === correctDefinition ? (
                        <p className="text-emerald-600 font-medium">Chúc mừng! Bạn đã chọn đúng.</p>
                    ) : (
                        <p className="text-rose-600 font-medium">Rất tiếc! Đáp án chưa đúng.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default MultipleChoice;
