import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { twMerge } from "tailwind-merge";

const PRIMARY_BUTTON_CLASS = "bg-pink-700 hover:bg-pink-600 text-neutral-50";
const PRIMARY_BUTTON_DISABLED_CLASS =
  "bg-neutral-700 text-neutral-50 cursor-not-allowed";

const SECONDARY_BUTTON_CLASS =
  "bg-gray-950 border border-solid font-medium border-pink-400 hover:bg-pink-950 text-pink-400";
const SECONDARY_BUTTON_DISABLED_CLASS =
  "bg-gray-950 text-neutral-500 cursor-not-allowed border border-solid border-neutral-600";

const TERTIARY_CONFIRM_BUTTON_CLASS =
  "bg-gray-950 hover:bg-pink-950 text-pink-400";
const TERTIARY_DEFAULT_BUTTON_CLASS =
  "bg-gray-950 hover:bg-neutral-800 text-neutral-50";

const Button = ({
  children,
  category = "primary",
  variant = "confirm",
  size = "md",
  loading = false,
  ...props
}: {
  category?: "primary" | "secondary" | "tertiary";
  variant?: "default" | "confirm";
  loading?: boolean;
  size?: "sm" | "md" | "lg";
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) => {
  return (
    <button
      {...props}
      className={twMerge(
        "min-w-[70px] transition-all rounded-lg font-medium px-3 py-2 text-sm shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600 inline-flex items-center justify-center",
        category === "primary"
          ? props.disabled
            ? PRIMARY_BUTTON_DISABLED_CLASS
            : PRIMARY_BUTTON_CLASS
          : category === "secondary"
          ? props.disabled
            ? SECONDARY_BUTTON_DISABLED_CLASS
            : SECONDARY_BUTTON_CLASS
          : variant === "default"
          ? TERTIARY_DEFAULT_BUTTON_CLASS
          : TERTIARY_CONFIRM_BUTTON_CLASS,
        size === "sm"
          ? "px-3 py-1"
          : size === "lg"
          ? "px-7 py-2.5 text-md"
          : "px-3 py-2",
        props.className
      )}
      disabled={loading || props.disabled}
    >
      {loading ? "..." : children}
    </button>
  );
};

export default Button;
