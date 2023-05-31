import { Html, Head, Main, NextScript } from "next/document";
import { ToastContainer } from "react-toastify";

export default function Document() {
  return (
    <Html>
      <Head />
      <body className="bg-violet-1100 font-mono text-neutral-50">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
