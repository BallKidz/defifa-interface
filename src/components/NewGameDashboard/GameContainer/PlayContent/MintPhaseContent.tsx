import Team from "components/Team";
import { useGameContext } from "contexts/GameContext";
import useNftRewards from "hooks/NftRewards";
import { useNftRewardTiersOf } from "hooks/read/NftRewardsTiers";
import { useNftRewardsTotalSupply } from "hooks/read/NftRewardsTotalSupply";
import { useProjectCurrentFundingCycle } from "hooks/read/ProjectCurrentFundingCycle";

export function MintPhaseContent() {
  const {
    nfts: { tiers, totalSupply },
  } = useGameContext();

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {tiers?.map((t: any) => (
          <Team
            key={t.id}
            id={t.id}
            img={t.teamImage}
            name={t.teamName}
            minted={t.minted}
            supply={totalSupply?.toNumber() ?? 0}
          />
        ))}
      </div>
    </div>
  );
}
