import Navbar from "../Navbar";
import Info from "../Navbar/Info";
import MainWrapper from "components/UI/MainWrapper";
import ArcadeLoad from "./TurnOn";
import ArcadeDescription from "./Description";

const ArcadeWrapper = () => {
  return (
    <MainWrapper>
      <Navbar>
        <Info withCreateButton />
      </Navbar>
      <h1>Play Money Games</h1>
      <ArcadeDescription />
      <ArcadeLoad />
    </MainWrapper>
  );
};

export default ArcadeWrapper;
