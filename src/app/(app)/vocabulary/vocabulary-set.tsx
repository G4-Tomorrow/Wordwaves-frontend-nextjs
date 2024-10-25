import {
  IconCircleCheckFilled,
  IconClockFilled,
  IconCrown,
} from "@tabler/icons-react";
import Image from "next/image";

export interface VocabularySetProps {
  title: string;
  thumbnail: string;
  level: string;
  progress: string;
  completed: number;
  total: number;
  timeLeft: number;
  crown: boolean;
  width?: number;
  height?: number;
}

const VocabularySet: React.FC<VocabularySetProps> = ({
  title,
  thumbnail,
  progress,
  completed,
  total,
  timeLeft,
  crown,
  width = 56,
  height = 44,
}) => (
  <div
    className={`relative bg-white rounded-xl shadow-md overflow-hidden flex flex-col justify-end
    ${width === 64 ? "w-64" : ""}
    ${width === 56 ? "w-56" : ""}
    ${height === 44 ? "h-44" : ""}
    ${height === 52 ? "h-52" : ""}
      `}
  >
    <Image
      src={thumbnail}
      width={224}
      height={126}
      alt={`${title} thumbnail`}
      className="absolute inset-0 w-auto h-auto object-cover opacity-95 brightness-75"
    />

    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>

    <div className="absolute left-2 bottom-2 z-10 flex flex-col items-start space-y-1 text-white">
      <p className="text-base font-bold">{progress}</p>

      <div className="flex mt-2 gap-2 bg-white text-xs font-semibold px-2 py-1 rounded-xl">
        <div className="text-[#0088E6] flex items-center gap-1">
          <IconCircleCheckFilled width={19} height={19} />
          {completed}/{total}
        </div>
        <div className="text-primary flex items-center gap-1">
          <IconClockFilled width={19} height={19} />
          {timeLeft}
        </div>
      </div>
    </div>
    {crown && (
      <span className="absolute top-2 right-2 text-yellow-500">
        <IconCrown />
      </span>
    )}
  </div>
);

export default VocabularySet;
