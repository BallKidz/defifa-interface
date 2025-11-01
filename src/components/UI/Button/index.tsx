'use client';

import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  MouseEvent,
  useCallback,
} from "react";
import { twMerge } from "tailwind-merge";
import { useMiniAppHaptics } from "hooks/useMiniAppHaptics";

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
  success = false,
  ...props
}: {
  category?: "primary" | "secondary" | "tertiary";
  variant?: "default" | "confirm";
  loading?: boolean;
  success?: boolean;
  size?: "sm" | "md" | "lg";
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) => {
  const { triggerImpact } = useMiniAppHaptics();
  const { onClick, className, disabled, ...restProps } = props;
  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      if (!loading && !disabled) {
        void triggerImpact("light");
      }
      onClick?.(event);
    },
    [disabled, loading, onClick, triggerImpact]
  );
  const isDisabled = loading || disabled;

  return (
    <button
      {...restProps}
      className={twMerge(
        "min-w-[70px] transition-all rounded-lg font-medium px-3 py-2 text-sm shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600 inline-flex items-center justify-center",
        category === "primary"
          ? isDisabled
            ? PRIMARY_BUTTON_DISABLED_CLASS
            : PRIMARY_BUTTON_CLASS
          : category === "secondary"
          ? isDisabled
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
        className
      )}
      onClick={handleClick}
      disabled={isDisabled}
    >
      {loading ? (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
          processing
        </div>
      ) : success ? (
        <div className="flex items-center text-green-400">
          <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {children}
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
