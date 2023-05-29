import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { twJoin } from "tailwind-merge";

const PRIMARY_BUTTON_CLASS = "bg-violet-600 hover:bg-violet-500 text-white";
const PRIMARY_BUTTON_DISABLED_CLASS =
  "bg-gray-700 text-white cursor-not-allowed";

const SECONDARY_BUTTON_CLASS =
  "bg-slate-950 border border-solid border-violet-500 hover:bg-violet-950 text-white";

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
        variant === "primary"
          ? props.disabled
            ? PRIMARY_BUTTON_DISABLED_CLASS
            : PRIMARY_BUTTON_CLASS
          : SECONDARY_BUTTON_CLASS
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
