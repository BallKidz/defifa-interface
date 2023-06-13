import { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

const SUCCESS_STYLE = "border-lime-900 text-lime-400 shadow-glowGreen";
const NEUTRAL_STYLE = "border-neutral-500";

export function Pill({
  children,
  category = "default",
  size = "md",
}: PropsWithChildren<{
  category?: "success" | "default";
  size?: "sm" | "md";
}>) {
  return (
    <span
      className={twMerge(
        "rounded-full text-sm border",
        category === "success" ? SUCCESS_STYLE : NEUTRAL_STYLE,
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm font-medium"
      )}
    >
      {children}
    </span>
  );
}
