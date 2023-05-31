import { PropsWithChildren } from "react";
import Info from "./Info";

const Navbar = (props: PropsWithChildren) => {
  return (
    <nav className="flex justify-between items-center w-full px-3 mb-10 my-5">
      <Info />
    </nav>
  );
};

export default Navbar;
