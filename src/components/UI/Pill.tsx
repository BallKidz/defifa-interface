import { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

const SUCCESS_STYLE = "border-lime-900 text-lime-400 shadow-glowGreen";
const NEUTRAL_STYLE = "border-neutral-500";

export function Pill({
  children,
  category = "default",
}: PropsWithChildren<{ category?: "success" | "default" }>) {
  return (
    <span
      className={twMerge(
        "px-3 py-1 rounded-full text-sm font-medium border",
        category === "success" ? SUCCESS_STYLE : NEUTRAL_STYLE
      )}
    >
      {children}
    </span>
  );
}
