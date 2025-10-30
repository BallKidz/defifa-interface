import Image from "next/image";
import { twMerge } from "tailwind-merge";

export function Card({ title, imageSrc }: { title: string; imageSrc: string }) {
  return (
    <div
      className={twMerge(
        "relative border-2 group bg-[#181424] border-neutral-800 shadow-lg hover:-translate-y-1 transition-all rounded-xl w-32 overflow-hidden"
      )}
    >
      <div className="px-3 pt-3 pb-2">
        <div className="text-sm text-left font-medium mb-2 truncate" title={title}>{title}</div>

        <div className="rounded-md overflow-hidden border-2 border-[#fea282] p-1 shadow-inner aspect-square flex items-center justify-center bg-[#0f0b16]">
          {imageSrc ? (
            <Image
              src={imageSrc}
              crossOrigin="anonymous"
              alt={title}
              width={120}
              height={120}
              className="object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-[#fea282] text-2xl font-bold mb-1">
                {title.substring(0, 9).toUpperCase()}
              </div>
              <div className="text-[#c0b3f1] text-xs"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
