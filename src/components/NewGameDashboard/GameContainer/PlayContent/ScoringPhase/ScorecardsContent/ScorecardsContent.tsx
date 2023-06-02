import { ScoreCardProposalState } from "components/GameDashboard/SelfReferee/Attestation/types";
import { ActionContainer } from "components/NewGameDashboard/GameContainer/ActionContainer/ActionContainer";
import Button from "components/UI/Button";
import Container from "components/UI/Container";
import { useGameContext } from "contexts/GameContext";
import { ONE_BILLION } from "hooks/NftRewards";
import { useProposalState } from "hooks/read/ProposalState";
import { useProposalVotes } from "hooks/read/ProposalVotes";
import { useQuorum } from "hooks/read/Quorum";
import { useAccountVotes } from "hooks/read/useGetVotes";
import { Scorecard, useScorecards } from "hooks/useScorecards";
import { useApproveScorecard } from "hooks/write/useApproveScorecard";
import { useAttestToScorecard } from "hooks/write/useAttestToScorecard";
import { useState } from "react";

const redemptionRateToPercentage = (redemptionRate: number) => {
  return redemptionRate === 0 ? 0 : (redemptionRate / ONE_BILLION) * 100;
};

export function ScorecardRow({
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
  const { write, isLoading } = useApproveScorecard(
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

      <div>
        {scorecard.redemptionTierWeights.map((weight) => (
          <div key={weight.id.toString()}>
            Tier {weight.id.toString()}:{" "}
            {redemptionRateToPercentage(weight.redemptionWeight).toString()}%
          </div>
        ))}
      </div>

      <div className="flex gap-3 items-center">
        {proposalVotes?.forVotes.toString()} attestations (
        {votesRemaining?.toNumber()} more needed)
        {quourumReached && proposalState === ScoreCardProposalState.Active ? (
          <Button size="sm" loading={isLoading} onClick={() => write?.()}>
            Ratify scorecard
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export function ScorecardActions({
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
  console.log(votes);
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
      <div className="mb-7">{votes?.toString()} votes available.</div>

      {!scorecards || scorecards.length === 0 ? (
        <Container>
          No scorecards submitted yet.{" "}
          <div className="text-xs">
            (or, some scorecards haven&apos;t been indexed yet)
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
