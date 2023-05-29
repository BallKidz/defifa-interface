import { ButtonHTMLAttributes, DetailedHTMLProps, HTMLAttributes } from "react";
import { twJoin } from "tailwind-merge";

const PRIMARY_BUTTON_CLASS = "bg-violet-600 hover:bg-violet-500 text-white";
const SECONDARY_BUTTON_CLASS =
  "bg-slate-900 border border-solid border-purple-600 hover:bg-violet-900 text-white";

const Button = ({
  children,
  variant = "primary",
  ...props
}: {
  children: any;
  variant?: "primary" | "secondary";
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) => {
  return (
    <button
      className={twJoin(
        "rounded-sm  px-3 py-2 text-sm  shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600",
        variant === "primary" ? PRIMARY_BUTTON_CLASS : SECONDARY_BUTTON_CLASS
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
