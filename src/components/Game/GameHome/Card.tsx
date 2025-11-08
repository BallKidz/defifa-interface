'use client'

import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { useState } from "react";
import { NFTModal } from "./NFTModal";
import { useMiniAppHaptics } from "hooks/useMiniAppHaptics";

export function Card({ title, imageSrc }: { title: string; imageSrc: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { triggerSelection } = useMiniAppHaptics();

  const handleClick = () => {
    void triggerSelection();
    setIsModalOpen(true);
  };

  return (
    <>
      <div
        className={twMerge(
          "relative border-2 group bg-[#181424] border-neutral-800 shadow-lg hover:-translate-y-1 transition-all rounded-xl overflow-hidden cursor-pointer active:scale-95",
          "w-[calc(50%-0.5rem)] md:w-32"
        )}
        onClick={handleClick}
      >
        <div className="px-3 pt-3 pb-2">
          <div className="text-base md:text-sm text-left font-medium mb-2 truncate" title={title}>{title}</div>

          <div className="rounded-md overflow-hidden border-2 border-[#fea282] p-1 shadow-inner aspect-square flex items-center justify-center bg-[#0f0b16]">
            {imageSrc ? (
              <Image
                src={imageSrc}
                crossOrigin="anonymous"
                alt={title}
                width={140}
                height={140}
                className="object-cover w-full h-full md:w-auto md:h-auto"
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

      <NFTModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
        imageSrc={imageSrc}
      />
    </>
  );
}
