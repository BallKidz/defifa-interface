import { PropsWithChildren } from "react";
import Info from "./Info";

const Navbar = (props: PropsWithChildren) => {
  return (
    <nav className="flex justify-between items-center w-full mb-8 my-5">
      <Info />
    </nav>
  );
};

export default Navbar;
