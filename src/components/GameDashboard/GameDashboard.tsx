import Description from "components/GameDashboard/Description";
import Mint from "components/GameDashboard/Mint";
import MyTeams from "components/GameDashboard/MyTeams";
import Navbar from "components/Navbar";
import Info from "components/Navbar/Info";
import SelfReferee from "components/GameDashboard/SelfReferee";
import Divider from "components/UI/Divider";
import Container from "components/UI/Container";

export function GameDashboard() {
  return (
    <Container>
      <Navbar />

      <Description />

      <Divider />
      <Mint />

      <Divider />
      <MyTeams />

      <Divider />
      <SelfReferee />
    </Container>
  );
}
