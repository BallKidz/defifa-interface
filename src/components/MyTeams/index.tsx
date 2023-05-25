/* eslint-disable @next/next/no-img-element */
import { useProjectCurrentFundingCycle } from "../../hooks/read/ProjectCurrentFundingCycle";
import { TeamsContext } from "../../hooks/teamsContext";
import { TeamTier, useMyTeams } from "../../hooks/useMyTeams";
import useRedeemTokensOf from "../../hooks/write/useRedeemTokensOf";
import MyTeam from "../MyTeam/MyTeam";
import Button from "../UI/Button";
import Content from "../UI/Content";
import styles from "./index.module.css";

const MyTeams = () => {
  const { isError, isLoading, teams, error, removeTeams } = useMyTeams();
  console.log("MyTeams stil loading ", isLoading)
  if (!isLoading) {
    console.log("MyTeams teams ", teams)
  }
  const { data } = useProjectCurrentFundingCycle();
  const fundingCycle = data?.fundingCycle.number.toNumber();
  console.log("fundingCycle MyTeams", data)
  
  const {
    write,
    isLoading: isRedeemLoading,
    isError: isRedeemError,
    error: redeemError,
  } = useRedeemTokensOf({
    tokenIds: getTokenIdsFromTeams(teams),
    onSuccess: () => removeTeams(teams?.map((t) => t.id)),
  });
  const canRedeem =
    fundingCycle === 1 || fundingCycle === 2 || fundingCycle === 4;
    
  return (
    <TeamsContext.Provider value={teams}>
      <Content title="Manage" open={true} socials={false}>
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
          <>
            {teams && teams.length > 1 && canRedeem ? (
              <div className={styles.buttonContainer}>
                <Button
                  size="medium"
                  onClick={() => write?.()}
                  disabled={isRedeemLoading}
                >
                  {isRedeemLoading ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      style={{ marginTop: "5px" }}
                      src="/assets/defifa_spinner.gif"
                      alt="spinner"
                      width={35}
                    />
                  ) : fundingCycle === 1 || fundingCycle === 2 ? (
                    "Refund all"
                  ) : (
                    "Redeem all"
                  )}
                </Button>
              </div>
            ) : null}

            <div className={styles.teams}>
              {teams &&
                teams
                  .sort((a, b) => b.quantity - a.quantity)
                  .map((team) => (
                    <MyTeam
                      team={team}
                      key={team.id}
                      onRedeemSuccess={() => removeTeams([team?.id])}
                      disableRedeem={isRedeemLoading}
                    />
                  ))}
              {teams?.length === 0 && <div>You dont have any teams yet.</div>}
            </div>
          </>
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
  console.log("getTokenIdsFromTeams", tokenIds)
  return tokenIds;
}
