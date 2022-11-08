import { useMyTeams } from "../../hooks/useMyTeams";
import MyTeam from "../MyTeam/MyTeam";
import Content from "../UI/Content";
import styles from "./index.module.css";

const MyTeams = () => {
  const { isError, isLoading, teams, error } = useMyTeams();
  return (
    <Content title="My Teams" open={true} socials={true}>
      {isError && <div className={styles.error}>{error}</div>}
      {isLoading && <div className={styles.loading}>Loading...</div>}
      <div className={styles.teams}>
      {teams && teams.map((team) => <MyTeam team={team} />)}
      </div>
    </Content>
  );
};

export default MyTeams;
