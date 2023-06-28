import { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

const Container = (props: PropsWithChildren<{ className?: string }>) => {
  return (
    <div className={twMerge("px-8 max-w-screen-xl mx-auto", props.className)}>
      {props.children}
    </div>
  );
};

export default Container;
