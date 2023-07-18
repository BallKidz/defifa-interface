import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { ActionContainer } from "components/Game/GameDashboard/GameContainer/ActionContainer/ActionContainer";
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
import { Tooltip } from 'antd';

const stateText = (state: DefifaScorecardState) => {
  switch (state) {
    case DefifaScorecardState.PENDING:
      return "Pending";
    case DefifaScorecardState.ACTIVE:
      return null;
    case DefifaScorecardState.DEFEATED:
      return "Defeated";
    case DefifaScorecardState.SUCCEEDED:
      return "Quorum reached";
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
    scorecard.tierWeights.map((weight) => ({
      id: weight.tierId,
      redemptionWeight: weight.redemptionWeight,
    })),
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
          SCORECARD BY:{" "}
          {stateText(proposalState) && (
            <Pill size="sm">{stateText(proposalState)}</Pill>
          )}
        </div>

        <span className="mb-4 flex justify-between items-center">
          <span>
            <EthAddress withEnsAvatar={true} address={scorecard.submitter?.id} />
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
          <span>{formatNumber(Math.max(votesRemaining?.toNumber(), 0))}</span>
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
    <div className="flex justify-between items-center w-full">
      <Tooltip title={selectedScorecard.id.toString()}>
        <div className="flex gap-2 items-center truncate">{selectedScorecard.id.toString().substring(0, 6)}...</div>
      </Tooltip>

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
    <>
      <Tooltip title="Select a scorecard that best suits your needs and objectives, while keeping
        in mind the stated rules and the implicit agreement you embraced upon
        entering the game.">
        <QuestionMarkCircleIcon className="h-4 w-4 inline" />
      </Tooltip>
      <ActionContainer
        renderActions={
          selectedScorecard
            ? () => <ScorecardActions selectedScorecard={selectedScorecard} />
            : undefined
        }
      >
        <div className="flex gap-8">
          <div className="mb-3 flex flex-col">
            <span className="uppercase text-xs">Your Votes</span>
            <span className="text-lg">
              {formatNumber(votes?.toNumber())} votes
            </span>
          </div>
          <div className="mb-3 flex flex-col">
            <span className="uppercase text-xs">Quorum</span>
            <span className="text-lg">
              {formatNumber(quorum?.toNumber())} votes
            </span>
          </div>
        </div>

        {!scorecards || scorecards.length === 0 ? (
          <div className="mt-5 text-neutral-300">
            <p>No scorecards submitted yet.</p> Anyone may submit a scorecard.
            <div className="text-xs mb-5 mt-1">
              (or, some scorecards haven't been indexed yet)
            </div>
          </div>
        ) : (
          <>
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
      </ActionContainer>
    </>
  );
}
