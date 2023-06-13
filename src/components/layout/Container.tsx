import { PropsWithChildren } from "react";
import { twJoin } from "tailwind-merge";

const Container = (props: PropsWithChildren<{ className?: string }>) => {
  return (
    <div className={twJoin("px-7 max-w-7xl mx-auto", props.className)}>
      {props.children}
    </div>
  );
};

export default Container;
