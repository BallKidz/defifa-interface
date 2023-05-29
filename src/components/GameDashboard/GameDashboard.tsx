import Description from "components/Description";
import Mint from "components/Mint";
import MyTeams from "components/MyTeams";
import Navbar from "components/Navbar";
import Info from "components/Navbar/Info";
import SelfReferee from "components/SelfReferee";
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
