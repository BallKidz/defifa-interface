import { Html, Head, Main, NextScript } from "next/document";
import { ToastContainer } from "react-toastify";

export default function Document() {
  return (
    <Html>
      <Head />
      <body className="bg-black text-neutral-50">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
