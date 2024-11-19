import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const levelMapping = {
    NOT_RETAINED: 1,
    BEGINNER: 2,
    LEARNING: 3,
    FAMILIAR: 4,
    LEARNED: 5,
    PROFICIENT: 6,
    MASTER: 7
};

const petalColors = [
    "from-pink-300 to-purple-300",
    "from-blue-300 to-indigo-300",
    "from-green-300 to-teal-300",
    "from-yellow-300 to-orange-300",
    "from-red-300 to-pink-300",
    "from-purple-300 to-indigo-300",
    "from-teal-300 to-blue-300"
];

const ScoreIndicator = ({ level = "PROFICIENT" }: { level?: keyof typeof levelMapping }) => {
    const [petalCount, setPetalCount] = useState(1);

    useEffect(() => {
        setPetalCount(levelMapping[level] || 1);
    }, [level]);

    const renderPetals = () => {
        const petals = [];
        const angleStep = (360 / petalCount);
        const radius = 12; // Even smaller radius

        for (let i = 0; i < petalCount; i++) {
            const angle = i * angleStep;
            const x = radius * Math.cos((angle - 90) * (Math.PI / 180));
            const y = radius * Math.sin((angle - 90) * (Math.PI / 180));

            petals.push(
                <motion.div
                    key={i}
                    className={`absolute w-2 h-4 rounded-full bg-gradient-to-b ${petalColors[i]} opacity-80 origin-bottom cursor-pointer
            hover:opacity-100 hover:scale-105 transition-all duration-300 ease-in-out`}
                    style={{
                        transform: `translate(${x}px, ${y}px) rotate(${angle}deg)`,
                        transformOrigin: "center bottom"
                    }}
                    initial={{ scale: 0, rotate: angle }}
                    animate={{
                        scale: 1,
                        rotate: angle,
                        y: 0
                    }}
                    transition={{
                        delay: i * 0.1,
                        duration: 0.5,
                        type: "spring",
                        stiffness: 100
                    }}
                    role="img"
                    aria-label={`Petal ${i + 1} of ${petalCount}`}
                    whileHover={{ scale: 1.1 }}
                />
            );
        }
        return petals;
    };

    return (
        <div
            className="relative w-16 h-16 flex items-center justify-center" // Smaller container
            role="progressbar"
            aria-label={`Score Indicator - Level: ${level}`}
            aria-valuenow={petalCount}
            aria-valuemin={1}
            aria-valuemax={7}
        >
            <div className="relative w-full h-full flex items-center justify-center">
                {renderPetals()}
                <motion.div
                    className="w-2 h-2 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-400 z-10" // Smaller center
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                        delay: 0.5,
                        type: "spring",
                        stiffness: 200
                    }}
                />
            </div>
            <div className="absolute -bottom-3 mt-1 text-center text-gray-700 font-semibold text-[10px]">
                {level.replace("_", " ")}
            </div>
        </div>
    );
};

export default ScoreIndicator;