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
import { Scorecard, useScorecards } from "hooks/useScorecards";
import { useAttestToScorecard } from "hooks/write/useAttestToScorecard";
import { useRatifyScorecard } from "hooks/write/useRatifyScorecard";
import { useState } from "react";
import { DefifaScorecardState } from "types/defifa";
import { redemptionWeightToPercentage } from "utils/defifa";
import { formatNumber } from "utils/format/formatNumber";

const stateText = (state: DefifaScorecardState) => {
  switch (state) {
    case DefifaScorecardState.PENDING:
      return "Pending";
    case DefifaScorecardState.ACTIVE:
      return "Voting open";
    case DefifaScorecardState.DEFEATED:
      return "Defeated";
    case DefifaScorecardState.SUCCEEDED:
      return "Approved";
    case DefifaScorecardState.RATIFIED:
      return "Locked in";
    default:
      return "Unknown";
  }
};

function ScorecardRow({
  scorecard,
  gameQuroum,
  onClick,
}: {
  scorecard: Scorecard;
  gameQuroum: BigNumber;
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

  const votesRemaining = gameQuroum?.sub(proposalVotes ?? BigNumber.from(0));

  return (
    <div className="border border-neutral-800 shadow-glowWhite rounded-lg mb-5 overflow-hidden flex flex-col justify-between">
      <div className="p-4">
        <div className="text-xs flex justify-between items-center mb-2">
          SCORECARD <Pill size="sm">{stateText(proposalState)}</Pill>
        </div>
        <span className="mb-4 flex justify-between items-center">
          <span>
            By <EthAddress address={scorecard.submitter?.id} />
          </span>
        </span>

        <div className="text-sm mb-5">
          <div className="flex justify-between font-medium border-b border-neutral-700 py-1">
            <span>Tier</span>
            <span>Score</span>
          </div>
          {scorecard.tierWeights.map((weight) => (
            <div
              key={weight.id.toString()}
              className="flex justify-between w-full border-b border-neutral-800 p-1"
            >
              <span>{nfts?.tiers?.[weight.tierId - 1]?.teamName}</span>{" "}
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

        <div className="flex justify-between mb-1 text-sm">
          <span className="text-neutral-300">Total Votes</span>
          <span>{formatNumber(proposalVotes?.toNumber())}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-300">Votes needed</span>
          <span>{formatNumber(votesRemaining?.toNumber())}</span>
        </div>
      </div>

      <div className="flex border-t border-neutral-700">
        <Button
          disabled={proposalState !== DefifaScorecardState.SUCCEEDED}
          onClick={() => write?.()}
          className="flex-1 p-2 border-t-0 border-b-0 border-l-0 border-r border-neutral-800 rounded-none"
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
  const { data: quorum } = useGameQuorum(gameId, governor);

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
          <div className="mb-3">
            You have {formatNumber(votes?.toNumber())} votes.
          </div>
          <div className="mb-3">
            A Scorecard needs at least {formatNumber(quorum?.toNumber())} votes
            before it can be locked in.
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {scorecards?.map((scorecard) => (
              <ScorecardRow
                key={scorecard.id.toString()}
                scorecard={scorecard}
                onClick={() => setSelectedScorecard(scorecard)}
                gameQuroum={quorum}
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
