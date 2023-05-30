import { PropsWithChildren } from "react";

const MainWrapper = (props: PropsWithChildren) => {
  return <div className="max-w-5xl mx-auto px-3 mb-16">{props.children}</div>;
};

export default MainWrapper;
