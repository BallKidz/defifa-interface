import Image from "next/image";
import { twMerge } from "tailwind-merge";

export function Card({ title, imageSrc }: { title: string; imageSrc: string }) {
  return (
    <div
      className={twMerge(
        "relative border-2 group bg-[#181424] border-neutral-800 shadow-lg hover:-translate-y-1 transition-all rounded-xl max-w-[500px] mx-auto overflow-hidden"
      )}
    >
      <div className="px-5 pt-5 mb-2">
        <div className="text-lg text-left">{title}</div>

        <div className="rounded-md overflow-hidden border-black p-2 shadow-inner border-2">
          <Image
            src={imageSrc}
            crossOrigin="anonymous"
            alt="Team"
            width={500}
            height={500}
          />
        </div>
      </div>
    </div>
  );
}
