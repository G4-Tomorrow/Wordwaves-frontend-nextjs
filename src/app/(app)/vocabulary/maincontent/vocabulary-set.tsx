import {
  IconCircleCheckFilled,
  IconClockFilled,
  IconCrown,
} from "@tabler/icons-react";
import Image from "next/image";

export interface VocabularySetProps {
  title: string;
  thumbnail: string;
  completed: number;
  total: number;
  timeLeft: number;
  width?: number;
  height?: number;
}

const VocabularySet: React.FC<VocabularySetProps> = ({
  title,
  thumbnail,
  completed,
  total,
  timeLeft,
  width = 56,
  height = 44,
}) => (
  <div
    className={`relative bg-white rounded-xl shadow-md overflow-hidden flex flex-col justify-end p-1
    ${width === 64 ? "w-64" : ""}
    ${width === 56 ? "w-56" : ""}
    ${height === 44 ? "h-44" : ""}
    ${height === 52 ? "h-52" : ""}
      `}
  >
    <Image
      src={
        thumbnail ||
        "https://voca-land.sgp1.cdn.digitaloceanspaces.com/-1/1651986733015/16ac3159ff81a6e6afd1c18fa4e4ccc0ce193d5720ac0b807345150bec0f7be0.png"
      }
      width={224}
      height={126}
      alt={`${title} thumbnail`}
      className="absolute w-full inset-0 object-cover opacity-95 brightness-75"
    />

    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>

    <div className="absolute left-2.5 bottom-2 z-10 flex flex-col items-start space-y-1 text-white">
      <div className="">{title}</div>
      <div className="flex mt-2 gap-2 bg-white text-xs font-semibold px-2 py-1 rounded-lg">
        <div className="text-[#0088E6] flex items-center gap-1 tracking-[0.1em]">
          <IconCircleCheckFilled width={19} height={19} />
          {completed}/{total}
        </div>
        <div className="text-primary flex items-center gap-1">
          <IconClockFilled width={19} height={19} />
          {timeLeft}
        </div>
      </div>
    </div>
  </div>
);

export default VocabularySet;
