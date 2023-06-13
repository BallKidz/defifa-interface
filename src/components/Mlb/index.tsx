import Container from "components/layout/Container";
import Navbar from "../layout/Navbar";
import MlbCreate from "./Create";

const MlbWrapper = () => {
  return (
    <Container>
      <Navbar />

      <MlbCreate />
    </Container>
  );
};

export default MlbWrapper;
