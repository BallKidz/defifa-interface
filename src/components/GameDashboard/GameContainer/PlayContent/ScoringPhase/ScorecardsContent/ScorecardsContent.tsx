import { ActionContainer } from "components/GameDashboard/GameContainer/ActionContainer/ActionContainer";
import Button from "components/UI/Button";
import Container from "components/layout/Container";
import { useGameContext } from "contexts/GameContext";
import { useProposalState } from "hooks/read/ProposalState";
import { useProposalVotes } from "hooks/read/ProposalVotes";
import { useQuorum } from "hooks/read/useQuorum";
import { useAccountVotes } from "hooks/read/useGetVotes";
import { Scorecard, useScorecards } from "hooks/useScorecards";
import { useRatifyScorecard } from "hooks/write/useRatifyScorecard";
import { useAttestToScorecard } from "hooks/write/useAttestToScorecard";
import { useState } from "react";
import { ProposalState } from "types/defifa";
import { redemptionWeightToPercentage } from "utils/defifa";

const stateText = (state: ProposalState) => {
  switch (state) {
    case ProposalState.Pending:
      return "Pending (0)";
    case ProposalState.Active:
      return "Active (1)";
    case ProposalState.Canceled:
      return "Canceled (2)";
    case ProposalState.Defeated:
      return "Canceled (3)";
    case ProposalState.Succeeded:
      return "Succeeded (4)";
    case ProposalState.Queued:
      return "Queued (5)";
    case ProposalState.Expired:
      return "Expired (6)";
    case ProposalState.Executed:
      return "Executed (7)";
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
  const { governor } = useGameContext();

  const { data: proposalVotes } = useProposalVotes(
    scorecard.proposalId,
    governor
  );
  const { write, isLoading } = useRatifyScorecard(
    scorecard.redemptionTierWeights,
    governor
  );
  const { data: proposalState } = useProposalState(
    scorecard.proposalId,
    governor
  );

  const { data: quorum } = useQuorum(scorecard.proposalId, governor);
  const quourumReached = proposalVotes?.forVotes
    ? quorum?.lte(proposalVotes.forVotes)
    : false;

  const votesRemaining = quorum?.sub(proposalVotes?.forVotes ?? 0);

  return (
    <div className="mb-5">
      <span onClick={onClick} role="button" className="hover:font-bold">
        Proposal: {scorecard.proposalId.toString()}
      </span>
      <div>State: {stateText(proposalState)}</div>

      <div>
        {scorecard.redemptionTierWeights.map((weight) => (
          <div key={weight.id.toString()}>
            Tier {weight.id.toString()}:{" "}
            {redemptionWeightToPercentage(weight.redemptionWeight).toString()}%
          </div>
        ))}
      </div>

      <div className="flex gap-3 items-center">
        {proposalVotes?.forVotes.toString()} votes (
        {votesRemaining?.toNumber()} more needed)
        {quourumReached &&
        proposalState === ProposalState.Succeeded ? (
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
  const { governor } = useGameContext();
  const { write, isLoading } = useAttestToScorecard(
    selectedScorecard.proposalId,
    governor
  );

  return (
    <div className="flex justify-between">
      <div>{selectedScorecard.proposalId.toString()}</div>
      <Button loading={isLoading} onClick={() => write?.()}>
        Attest to scorecard
      </Button>
    </div>
  );
}

export function ScorecardsContent() {
  const [selectedScorecard, setSelectedScorecard] = useState<Scorecard>();
  const { governor } = useGameContext();
  const { data: scorecards, isLoading } = useScorecards(governor);
  const { data: votes } = useAccountVotes(governor);
  if (isLoading) {
    return <Container>...</Container>;
  }
  console.log(votes);
  return (
    <ActionContainer
      renderActions={
        selectedScorecard
          ? () => <ScorecardActions selectedScorecard={selectedScorecard} />
          : undefined
      }
    >
      <div className="mb-7 flex flex-col gap-2">
        <p>
          A Scorecard proposes each Pick's redemption value. Players use their
          voting power to vote for a Scorecard. The first Scorecard to reach
          quorum and be ratified is the final scorecard.
        </p>
        <p>The final Scorecard determines each Pick's redemption value.</p>
        <p>Scorecards don't necessarily reflect the game's actual outcome.</p>
      </div>

      <div className="mb-7 font-medium">
        {votes?.toString()} votes available.
      </div>

      {!scorecards || scorecards.length === 0 ? (
        <Container>
          No scorecards submitted yet.{" "}
          <div className="text-xs">
            (or, some scorecards haven't been indexed yet)
          </div>
        </Container>
      ) : (
        scorecards?.map((scorecard) => (
          <ScorecardRow
            key={scorecard.proposalId.toString()}
            scorecard={scorecard}
            onClick={() => setSelectedScorecard(scorecard)}
          />
        ))
      )}
    </ActionContainer>
  );
}
