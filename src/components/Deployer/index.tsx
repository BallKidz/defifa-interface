import Container from "components/UI/Container";
import Navbar from "../Navbar";
import Info from "../Navbar/Info";
import DeployerCreate from "./Create";

const DeployerWrapper = () => {
  return (
    <Container>
      <Navbar />

      <h1 className="text-2xl mb-8 mt-8">Create your Game</h1>
      <DeployerCreate />
    </Container>
  );
};

export default DeployerWrapper;
