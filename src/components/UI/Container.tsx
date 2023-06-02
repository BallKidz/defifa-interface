import { PropsWithChildren } from "react";
import { twJoin } from "tailwind-merge";

const Container = (props: PropsWithChildren<{ className?: string }>) => {
  return (
    <div className={twJoin("max-w-5xl mx-auto px-3 w-full", props.className)}>
      {props.children}
    </div>
  );
};

export default Container;
