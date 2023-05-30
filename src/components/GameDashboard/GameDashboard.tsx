import Description from "components/GameDashboard/Description";
import Mint from "components/GameDashboard/Mint";
import MyTeams from "components/GameDashboard/MyTeams";
import Navbar from "components/Navbar";
import Info from "components/Navbar/Info";
import SelfReferee from "components/GameDashboard/SelfReferee";
import Divider from "components/UI/Divider";
import MainWrapper from "components/UI/MainWrapper";

export function GameDashboard() {
  return (
    <MainWrapper>
      <Navbar>
        <Info />
      </Navbar>

      <Description />

      <Divider />
      <Mint />

      <Divider />
      <MyTeams />

      <Divider />
      <SelfReferee />
    </MainWrapper>
  );
}
