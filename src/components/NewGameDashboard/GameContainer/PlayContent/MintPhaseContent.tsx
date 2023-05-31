import Team from "components/Team";
import { useGameContext } from "contexts/GameContext";
import { ActionContainer } from "../ActionContainer/ActionContainer";
import Button from "components/UI/Button";

export function MintActions() {
  return (
    <div className="flex justify-between">
      <div>asd</div>
      <Button>Mint</Button>
    </div>
  );
}

export function MintPhaseContent() {
  const {
    nfts: { tiers, totalSupply },
  } = useGameContext();

  return (
    <ActionContainer renderActions={MintActions}>
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
    </ActionContainer>
  );
}
