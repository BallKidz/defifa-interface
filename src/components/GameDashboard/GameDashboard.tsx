import Description from "components/Description";
import Mint from "components/Mint";
import MyTeams from "components/MyTeams";
import Navbar from "components/Navbar";
import Info from "components/Navbar/Info";
import SelfReferee from "components/SelfReferee";
import Divider from "components/UI/Divider";
import styles from "../../styles/Home.module.css";

export function GameDashboard() {
  return (
    <>
      <Navbar>
        <Info withCreateButton />
      </Navbar>

      <main className={styles.container}>
        <Description />

        <Divider />
        <Mint />

        <Divider />
        <MyTeams />

        <Divider />
        <SelfReferee />
      </main>
    </>
  );
}
