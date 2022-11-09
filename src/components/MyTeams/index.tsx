/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
import { useMyTeams } from "../../hooks/useMyTeams";
import MyTeam from "../MyTeam/MyTeam";
import Content from "../UI/Content";
import styles from "./index.module.css";

const MyTeams = () => {
  const { isError, isLoading, teams, error } = useMyTeams();
  return (
    <Content title="My Teams" open={true} socials={true}>
      {isError && <div className={styles.error}>{error}</div>}
      {isLoading && (
        <div className={styles.loading}>
          <div className={styles.spinner}>
            <img
              style={{ marginTop: "5px" }}
              src="/assets/defifa_spinner.gif"
              alt="spinner"
              width={100}
            />
            Loading..
          </div>
        </div>
      )}
      <div className={styles.teams}>
        {teams && teams.map((team) => <MyTeam team={team} key={team.id} />)}
        {teams?.length === 0 && <div>You don't have any teams yet.</div>}
      </div>
    </Content>
  );
};

export default MyTeams;
