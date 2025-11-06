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
      className="block w-full rounded-md border-0 py-1.5 text-neutral-50 bg-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-800 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6 autofill:bg-neutral-900 autofill:text-neutral-50"
      style={{
        WebkitTextFillColor: 'rgb(250 250 249)',
        WebkitBoxShadow: '0 0 0px 1000px rgb(23 23 23) inset',
      }}
      {...props}
    />
  );
}
