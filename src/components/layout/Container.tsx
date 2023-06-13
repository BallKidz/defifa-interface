import { PropsWithChildren } from "react";
import { twJoin } from "tailwind-merge";

const Container = (props: PropsWithChildren<{ className?: string }>) => {
  return (
    <div className={twJoin("px-7", props.className)}>{props.children}</div>
  );
};

export default Container;
