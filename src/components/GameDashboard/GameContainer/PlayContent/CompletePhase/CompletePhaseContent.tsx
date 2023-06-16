import { RedeemPicksContent } from "./RedeemPicksContent";
import { TopHoldrsContent } from "components/LeaderBoard/TopHodlrs/TopHodlrs";
import { TopPlayerContent } from "components/LeaderBoard/TopPlayers/TopPlayers";

export function CompletePhaseContent() {
  return (
    <div>
      <RedeemPicksContent />
      {/*  <div className="text-center">
        <h2 className="text-2xl mb-4">Leaderboards</h2>
      </div>
      <TopHoldrsContent />
      <TopPlayerContent /> */}
    </div>

  );
}
