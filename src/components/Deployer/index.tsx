import Container from "components/layout/Container";
import Navbar from "../layout/Navbar";
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
