import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { twJoin, twMerge } from "tailwind-merge";

const PRIMARY_BUTTON_CLASS = "bg-violet-600 hover:bg-violet-500 text-gray-50";
const PRIMARY_BUTTON_DISABLED_CLASS =
  "bg-gray-700 text-gray-50 cursor-not-allowed";

const SECONDARY_BUTTON_CLASS =
  "bg-violet-1100 border border-solid border-violet-400 hover:bg-violet-1000 text-violet-400";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  ...props
}: {
  children: any;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) => {
  return (
    <button
      className={twMerge(
        "rounded-full font-medium px-3 py-2 text-sm shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600",
        variant === "primary"
          ? props.disabled
            ? PRIMARY_BUTTON_DISABLED_CLASS
            : PRIMARY_BUTTON_CLASS
          : SECONDARY_BUTTON_CLASS,
        size === "sm"
          ? "px-2.5 py-1.5"
          : size === "lg"
          ? "px-7 py-2.5 text-md"
          : "px-3 py-2"
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
