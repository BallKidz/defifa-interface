import { ActionContainer } from "components/GameDashboard/GameContainer/ActionContainer/ActionContainer";
import Button from "components/UI/Button";
import { EthAddress } from "components/UI/EthAddress";
import { Pill } from "components/UI/Pill";
import Container from "components/layout/Container";
import { useGameContext } from "contexts/GameContext";
import { BigNumber } from "ethers";
import { useProposalVotes } from "hooks/read/ProposalVotes";
import { useScorecardState } from "hooks/read/ScorecardState";
import { useGameQuorum } from "hooks/read/useGameQuorum";
import { useAccountVotes } from "hooks/read/useGetVotes";
import { useEnsName } from "hooks/useEnsName";
import { Scorecard, useScorecards } from "hooks/useScorecards";
import { useAttestToScorecard } from "hooks/write/useAttestToScorecard";
import { useRatifyScorecard } from "hooks/write/useRatifyScorecard";
import { useState } from "react";
import { DefifaScorecardState } from "types/defifa";
import { redemptionWeightToPercentage } from "utils/defifa";

const stateText = (state: DefifaScorecardState) => {
  switch (state) {
    case DefifaScorecardState.PENDING:
      return "Pending";
    case DefifaScorecardState.ACTIVE:
      return "Active";
    case DefifaScorecardState.DEFEATED:
      return "Defeated";
    case DefifaScorecardState.SUCCEEDED:
      return "Succeeded";
    case DefifaScorecardState.RATIFIED:
      return "Ratified";
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

  const { data: proposalVotes } = useProposalVotes(
    gameId,
    scorecard.id,
    governor
  );

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

  const { data: quorum } = useGameQuorum(gameId, governor);
  const votesRemaining = quorum?.sub(proposalVotes ?? BigNumber.from(0));

  return (
    <div className="border border-violet-800 shadow-glowViolet rounded-lg mb-5 overflow-hidden flex flex-col justify-between">
      <div className="p-4">
        <span className="text-xs">SCORECARD</span>
        <span className="mb-4 flex justify-between items-center">
          <span>
            By <EthAddress address={scorecard.submitter.id} />
          </span>
          <span>
            <Pill>{stateText(proposalState)}</Pill>
          </span>
        </span>
        <div className="w-full text-sm mb-5">
          <div className="flex justify-between w-full">
            <span>Tier</span>
            <span>Score</span>
          </div>
          {scorecard.tierWeights.map((weight) => (
            <div
              key={weight.id.toString()}
              className="flex justify-between w-full border-b border-gray-800 p-1"
            >
              <span>{nfts?.tiers?.[weight.id - 1].teamName}</span>{" "}
              {/* tiers 0 indexed */}
              <span>
                {redemptionWeightToPercentage(
                  weight.redemptionWeight
                ).toString()}
                %
              </span>
            </div>
          ))}
        </div>

        <div className="flex justify-between mb-2">
          <span>Votes</span>
          <span>{proposalVotes?.toString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Votes needed</span>
          <span>{quorum?.toNumber()}</span>
        </div>
      </div>

      <div className="flex border-t border-gray-700">
        <Button
          disabled={proposalState !== DefifaScorecardState.SUCCEEDED}
          onClick={() => write?.()}
          className="flex-1 p-2 border-t-0 border-b-0 border-l-0 border-r border-gray-800 rounded-none"
          category="secondary"
        >
          Lock in
        </Button>
        <Button
          className="flex-1 p-2 rounded-none border-none"
          onClick={onClick}
          category="secondary"
        >
          Select
        </Button>
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
        Vote for scorecard
      </Button>
    </div>
  );
}

export function ScorecardsContent() {
  const [selectedScorecard, setSelectedScorecard] = useState<Scorecard>();
  const { gameId, governor } = useGameContext();
  const { data: scorecards, isLoading } = useScorecards(gameId);

  const { data: votes } = useAccountVotes(gameId, governor);
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
          <div className="mb-3 font-medium text-lg">
            Select a Scorecard and vote
          </div>
          <div className="mb-3">You have {votes?.toString()} votes.</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {scorecards?.map((scorecard) => (
              <ScorecardRow
                key={scorecard.id.toString()}
                scorecard={scorecard}
                onClick={() => setSelectedScorecard(scorecard)}
              />
            ))}
          </div>
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
    </ActionContainer>
  );
}
