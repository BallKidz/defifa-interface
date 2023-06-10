import { ActionContainer } from "components/GameDashboard/GameContainer/ActionContainer/ActionContainer";
import Button from "components/UI/Button";
import Container from "components/layout/Container";
import { useGameContext } from "contexts/GameContext";
import { useScorecardState } from "hooks/read/ScorecardState";
import { useProposalVotes } from "hooks/read/ProposalVotes";
import { useAccountVotes } from "hooks/read/useGetVotes";
import { useQuorum } from "hooks/read/useQuorum";
import { Scorecard, useScorecards } from "hooks/useScorecards";
import { useAttestToScorecard } from "hooks/write/useAttestToScorecard";
import { useRatifyScorecard } from "hooks/write/useRatifyScorecard";
import { useState } from "react";
import { DefifaScorecardState } from "types/defifa";
import { redemptionWeightToPercentage } from "utils/defifa";

const stateText = (state: DefifaScorecardState) => {
  switch (state) {
    case DefifaScorecardState.PENDING:
      return "Pending (0)";
    case DefifaScorecardState.ACTIVE:
      return "Active (1)";
    case DefifaScorecardState.DEFEATED:
      return "Defeated (2)";
    case DefifaScorecardState.SUCCEEDED:
      return "Succeeded (3)";
    case DefifaScorecardState.RATIFIED:
      return "Ratified (4)";
    default:
      return "Unknown";
  }
};

function ScorecardRow({
  scorecard,
  onClick,
}: {
  scorecard: Scorecard;
  onClick?: () => void;
}) {
  const { governor, nfts, gameId } = useGameContext();

  const { data: proposalVotes } = useProposalVotes(scorecard.id, governor);
  const { write, isLoading } = useRatifyScorecard(
    gameId,
    scorecard.tierWeights,
    governor
  );
  const { data: proposalState } = useScorecardState(
    gameId,
    scorecard.id,
    governor
  );

  const { data: quorum } = useQuorum(gameId, scorecard.id, governor);

  const votesRemaining = quorum?.sub(proposalVotes?.forVotes ?? 0);

  return (
    <div
      className="border border-pink-500 rounded-lg shadow p-4 mb-5"
      onClick={onClick}
    >
      <h2 className="text-xl font-bold mb-4" role="button">
        Proposed Scorecard
      </h2>
      <div>
        {scorecard.tierWeights.map((weight) => (
          <div key={weight.id.toString()}>
            {nfts?.tiers?.[weight.id - 1].teamName}: {/* tiers 0 indexed */}
            {redemptionWeightToPercentage(weight.redemptionWeight).toString()}%
          </div>
        ))}
      </div>
      <div>State: {stateText(proposalState)}</div>

      <div className="flex gap-3 items-center">
        Current votes: {proposalVotes?.forVotes.toString()} (
        {votesRemaining?.toNumber()} more needed)
        {proposalState === DefifaScorecardState.SUCCEEDED ? (
          <Button size="sm" loading={isLoading} onClick={() => write?.()}>
            Ratify scorecard
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function ScorecardActions({
  selectedScorecard,
}: {
  selectedScorecard: Scorecard;
}) {
  const { governor, gameId } = useGameContext();
  const { write, isLoading } = useAttestToScorecard(
    gameId,
    selectedScorecard.id,
    governor
  );

  return (
    <div className="flex justify-between">
      <div>{selectedScorecard.id.toString()}</div>
      <Button loading={isLoading} onClick={() => write?.()}>
        Attest to scorecard
      </Button>
    </div>
  );
}

export function ScorecardsContent() {
  const [selectedScorecard, setSelectedScorecard] = useState<Scorecard>();
  const { gameId, governor } = useGameContext();
  const { data: scorecards, isLoading } = useScorecards(gameId);

  const { data: votes } = useAccountVotes(governor);
  if (isLoading) {
    return <Container>...</Container>;
  }

  return (
    <ActionContainer
      renderActions={
        selectedScorecard
          ? () => <ScorecardActions selectedScorecard={selectedScorecard} />
          : undefined
      }
    >
      {!scorecards || scorecards.length === 0 ? (
        <Container>
          <span className="text-pink-500">No scorecards submitted yet.</span>{" "}
          Anybody may submit a scorecard.
          <div className="text-xs mb-5">
            (or, some scorecards haven't been indexed yet)
          </div>
        </Container>
      ) : (
        <>
          <div className="mb-3 font-bold text-lg">Select a Scorecard:</div>
          {scorecards?.map((scorecard) => (
            <ScorecardRow
              key={scorecard.id.toString()}
              scorecard={scorecard}
              onClick={() => setSelectedScorecard(scorecard)}
            />
          ))}
        </>
      )}
      <div className="mb-7 flex flex-col gap-2">
        <p>
          A Scorecard proposes each Pick's redemption value. Players use their
          voting power to vote for a Scorecard. The first Scorecard to reach
          quorum of 50% and be ratified is the final scorecard.
        </p>
        <p>The final Scorecard determines each Pick's redemption value.</p>
        <p>Scorecards don't necessarily reflect the game's actual outcome.</p>
      </div>

      <div className="mb-7 font-medium">
        {votes?.toString()} votes available.
      </div>
    </ActionContainer>
  );
}
