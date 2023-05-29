import { PropsWithChildren } from "react";

const Navbar = (props: PropsWithChildren) => {
  return (
    <nav className="flex justify-between items-center w-full px-3 mb-10 my-5">
      {props.children}
    </nav>
  );
};

export default Navbar;
