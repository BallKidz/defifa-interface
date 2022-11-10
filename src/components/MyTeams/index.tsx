/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
import { useProjectCurrentFundingCycle } from "../../hooks/read/ProjectCurrentFundingCycle";
import { TeamsContext } from "../../hooks/teamsContext";
import { TeamTier, useMyTeams } from "../../hooks/useMyTeams";
import useRedeemTokensOf from "../../hooks/write/useRedeemTokensOf";
import MyTeam, { getRedeemButtonText } from "../MyTeam/MyTeam";
import Content from "../UI/Content";
import styles from "./index.module.css";

const MyTeams = () => {
  const { isError, isLoading, teams, error, removeTeams } = useMyTeams();
  const { data } = useProjectCurrentFundingCycle();
  const fundingCycle = data?.fundingCycle.number.toNumber();
  const {
    write,
    isLoading: isRedeemLoading,
    isError: isRedeemError,
    error: redeemError,
  } = useRedeemTokensOf({
    tokenIds: getTokenIdsFromTeams(teams),
    onSuccess: () => removeTeams(teams?.map((t) => t.id)),
  });
  return (
    <TeamsContext.Provider value={teams}>
      <Content
        title="My Teams"
        open={true}
        socials={true}
        rightSection={{
          enabled: (teams?.length ?? 0) > 0,
          onClick: () => {
            write?.();
          },
          title: getRedeemButtonText(fundingCycle) + " All",
          loading: isRedeemLoading,
        }}
      >
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
        {!(isError || isLoading) && (
          <div className={styles.teams}>
            {teams &&
              teams.map((team) => (
                <MyTeam
                  team={team}
                  key={team.id}
                  onRedeemSuccess={() => removeTeams([team?.id])}
                />
              ))}
            {teams?.length === 0 && <div>You dont have any teams yet.</div>}
          </div>
        )}
      </Content>
    </TeamsContext.Provider>
  );
};

export default MyTeams;

function getTokenIdsFromTeams(teams?: TeamTier[]) {
  const tokenIds: string[] = [];
  teams?.forEach((team) => {
    team.tokenIds.forEach((tokenId) => {
      tokenIds.push(tokenId);
    });
  });
  return tokenIds;
}
