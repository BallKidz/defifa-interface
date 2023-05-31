import { PropsWithChildren } from "react";

const Container = (props: PropsWithChildren) => {
  return <div className="max-w-6xl mx-auto px-3 mb-16">{props.children}</div>;
};

export default Container;
