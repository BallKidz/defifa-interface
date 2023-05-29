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
      className="block w-full rounded-sm border-0 py-1.5 text-white bg-slate-950 shadow-sm ring-1 ring-inset ring-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6"
      {...props}
    />
  );
}
