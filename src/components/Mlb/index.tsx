import Navbar from "../layout/Navbar";
import Container from "components/layout/Container";
import MLBGamesSchedule from "./Content";
import MlbDescription from "./Description";

const MlbWrapper = () => {
  return (
    <Container>
      <Navbar />

      <h1>Launch an MLB Money Games With Friends</h1>
      <MlbDescription />
      <MLBGamesSchedule />
    </Container>
  );
};

export default MlbWrapper;
