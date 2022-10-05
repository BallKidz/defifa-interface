import Button from "../UI/Button";
import Header from "../UI/Header";
import Logo from "../UI/Logo";
import Info from "./Info";
import Wallet from "./Wallet";

const Navbar = () => {
  return (
    <Header>
      <>
        <Logo src="/assets/defifa.svg" width="389px" height="322px" />
        <Info />
        <Wallet />
      </>
    </Header>
  );
};

export default Navbar;
