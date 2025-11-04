import { ReactNode, useState } from "react";

interface TooltipProps {
  title: string | ReactNode;
  children: ReactNode;
  className?: string;
}

export function Tooltip({ title, children, className }: TooltipProps) {
  const [show, setShow] = useState(false);

  return (
    <div className={`relative inline-block ${className || ""}`}>
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </div>
      {show && (
        <div className={`absolute z-50 px-3 py-2 text-sm text-white bg-neutral-900 rounded-lg shadow-lg border border-neutral-700 bottom-full left-1/2 -translate-x-1/2 mb-2 ${typeof title === "string" ? "whitespace-nowrap" : "max-w-sm"}`}>
          {typeof title === "string" ? (
            <span>{title}</span>
          ) : (
            title
          )}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-neutral-900" />
        </div>
      )}
    </div>
  );
}

