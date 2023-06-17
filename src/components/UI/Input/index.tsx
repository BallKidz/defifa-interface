import { DetailedHTMLProps, InputHTMLAttributes } from "react";

export function Input(
  props: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
) {
  // tailwind input
  return (
    <input
      className="block w-full rounded-sm border-0 py-1.5 text-neutral-50  shadow-sm ring-1 ring-inset ring-neutral-800 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6"
      {...props}
    />
  );
}
