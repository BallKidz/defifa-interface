import MainWrapper from "components/UI/MainWrapper";
import Navbar from "../Navbar";
import Info from "../Navbar/Info";
import DeployerCreate from "./Create";

const DeployerWrapper = () => {
  return (
    <MainWrapper>
      <Navbar>
        <Info />
      </Navbar>

      <h1 className="text-2xl mb-8 mt-8">Create your Game</h1>
      <DeployerCreate />
    </MainWrapper>
  );
};

export default DeployerWrapper;
