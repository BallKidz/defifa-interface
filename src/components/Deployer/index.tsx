import Container from "components/UI/Container";
import Navbar from "../Navbar";
import Info from "../Navbar/Info";
import DeployerCreate from "./Create";

const DeployerWrapper = () => {
  return (
    <Container>
      <Navbar />

      <DeployerCreate />
    </Container>
  );
};

export default DeployerWrapper;
