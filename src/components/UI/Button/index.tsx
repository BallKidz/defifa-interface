import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { twMerge } from "tailwind-merge";

const PRIMARY_BUTTON_CLASS = "bg-violet-600 hover:bg-violet-500 text-neutral-50";
const PRIMARY_BUTTON_DISABLED_CLASS =
  "bg-gray-700 text-neutral-50 cursor-not-allowed";

const SECONDARY_BUTTON_CLASS =
  "bg-violet-1100 border border-solid font-medium border-violet-400 hover:bg-violet-1000 text-violet-400";
const SECONDARY_BUTTON_DISABLED_CLASS =
  "bg-violet-1100 text-neutral-400 cursor-not-allowed border border-solid border-gray-600";

const TERTIARY_CONFIRM_BUTTON_CLASS =
  "bg-violet-1100 hover:bg-violet-1000 text-violet-400 underline";
const TERTIARY_DEFAULT_BUTTON_CLASS =
  "bg-neutral-950 hover:bg-neutral-1000 text-neutral-50 underline";

const Button = ({
  children,
  category = "primary",
  variant = "confirm",
  size = "md",
  loading = false,
  ...props
}: {
  children: any;
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
        props.className,
        " min-w-[70px] rounded-full font-medium px-3 py-2 text-sm shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600",
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
          : "px-3 py-2"
      )}
      disabled={loading || props.disabled}
    >
      {loading ? "..." : children}
    </button>
  );
};

export default Button;
