import { PropsWithChildren } from "react";
import { twJoin } from "tailwind-merge";

const Container = (props: PropsWithChildren<{ className?: string }>) => {
  return (
    <div className={twJoin("px-8 max-w-screen-xl mx-auto", props.className)}>
      {props.children}
    </div>
  );
};

export default Container;
