import Navbar from "../Navbar";
import Info from "../Navbar/Info";
import MainWrapper from "components/UI/MainWrapper";
import DeployerCreate from "./Create";
import DeployerDescription from "./Description";

const DeployerWrapper = () => {
  return (
    <MainWrapper>
      <Navbar>
        <Info />
      </Navbar>

      <h1>Create your Game</h1>
      <DeployerDescription />
      <DeployerCreate />
    </MainWrapper>
  );
};

export default DeployerWrapper;
