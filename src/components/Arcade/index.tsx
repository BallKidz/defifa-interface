import Navbar from "../layout/Navbar";
import Info from "../layout/Navbar/Info";
import Container from "components/layout/Container";
import ArcadeLoad from "./TurnOn";
import ArcadeDescription from "./Description";

const ArcadeWrapper = () => {
  return (
    <Container>
      <Navbar />

      <h1>Play Money Games With Friends</h1>
      <ArcadeDescription />
      <ArcadeLoad />
    </Container>
  );
};

export default ArcadeWrapper;
