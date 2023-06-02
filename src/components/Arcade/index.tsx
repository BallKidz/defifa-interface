import Navbar from "../Navbar";
import Info from "../Navbar/Info";
import Container from "components/UI/Container";
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
