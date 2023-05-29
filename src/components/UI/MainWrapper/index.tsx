import { PropsWithChildren } from "react";

const MainWrapper = (props: PropsWithChildren) => {
  return <div className="max-w-5xl mx-auto px-3">{props.children}</div>;
};

export default MainWrapper;
