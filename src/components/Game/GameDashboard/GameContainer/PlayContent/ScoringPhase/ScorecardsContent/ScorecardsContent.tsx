import { ActionContainer } from "components/Game/GameDashboard/GameContainer/ActionContainer/ActionContainer";
import Button from "components/UI/Button";
import { EthAddress } from "components/UI/EthAddress";
import { Pill } from "components/UI/Pill";
import Container from "components/layout/Container";
import { useGameContext } from "contexts/GameContext";
import { useProposalVotes } from "hooks/read/ProposalVotes";
import { useScorecardState } from "hooks/read/ScorecardState";
import { useGameQuorum } from "hooks/read/useGameQuorum";
import { useAccountVotes } from "hooks/read/useGetVotes";
import { Scorecard, useScorecards } from "hooks/useScorecards";
import { useAttestToScorecard } from "hooks/write/useAttestToScorecard";
import { useRatifyScorecard } from "hooks/write/useRatifyScorecard";
import { useTierAttestationUnits } from "hooks/read/useTierAttestationUnits";
import { useGameNFTAddress } from "hooks/read/useGameNFTAddress";
import { useState } from "react";
import { DefifaScorecardState } from "types/defifa";
import { redemptionWeightToPercentage } from "utils/defifa";
import { formatNumber } from "utils/format/formatNumber";
import { Tooltip } from 'components/UI/Tooltip';

const stateText = (state: DefifaScorecardState) => {
  switch (state) {
    case DefifaScorecardState.PENDING:
      return "Pending";
    case DefifaScorecardState.ACTIVE:
      return null;
    case DefifaScorecardState.DEFEATED:
      return "Defeated";
    case DefifaScorecardState.SUCCEEDED:
      return "Quorum";
    case DefifaScorecardState.RATIFIED:
      return "Locked";
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
  gameQuroum: bigint;
  onClick?: () => void;
}) {
  const { governor, nfts, gameId } = useGameContext();
  const { data: proposalVotes } = useProposalVotes(
    gameId,
    scorecard.scorecardId || BigInt(0),
    governor
  );

  const mappedTierWeights = scorecard.tierWeights.map((weight) => ({
    id: weight.tierId, // Use tierId, not the composite id
    redemptionWeight: weight.redemptionWeight,
  }));


  const { write, isLoading } = useRatifyScorecard(
    gameId,
    scorecard.scorecardId || BigInt(0),
    mappedTierWeights,
    governor
  );
  const { data: proposalState } = useScorecardState(
    gameId,
    scorecard.scorecardId || BigInt(0),
    governor
  );
  const votesRemaining = gameQuroum && proposalVotes 
    ? gameQuroum - BigInt(proposalVotes.toString()) 
    : gameQuroum;

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
          <span>{formatNumber(proposalVotes ? Number(proposalVotes) : 0)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-300">Votes needed</span>
          <span>{formatNumber(Math.max(votesRemaining ? Number(votesRemaining) : 0, 0))}</span>
        </div>
      </div>

      <div className="flex border-t border-neutral-700">
        <Button
          disabled={proposalState !== DefifaScorecardState.SUCCEEDED}
          onClick={() => {
            if (write) {
              write();
            }
          }}
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
  onSuccess,
}: {
  selectedScorecard: Scorecard;
  onSuccess?: () => void;
}) {
  const { governor, gameId } = useGameContext();
  const { write, isLoading, error, isError } = useAttestToScorecard(
    gameId,
    selectedScorecard.scorecardId || BigInt(0),
    governor,
    onSuccess
  );
  
  const { data: scorecardState } = useScorecardState(
    gameId,
    selectedScorecard.scorecardId || BigInt(0),
    governor
  );

  const handleVote = () => {
    if (write) {
      write();
    }
  };

  // Check if scorecard is in a votable state (ACTIVE or SUCCEEDED)
  const canVote = scorecardState === DefifaScorecardState.ACTIVE || 
                  scorecardState === DefifaScorecardState.SUCCEEDED;


  return (
    <div className="flex justify-between items-center w-full">
      <Tooltip title={selectedScorecard.id?.toString() || 'Unknown'}>
        <div className="flex gap-2 items-center truncate">
          {/* {selectedScorecard.scorecardId.toString().substring(0, 6)}... */}
          {scorecardState !== undefined && stateText(scorecardState) && (
            <Pill size="sm">{stateText(scorecardState)}</Pill>
          )}
        </div>
      </Tooltip>

      <div className="flex flex-col items-end">
        <Button 
          loading={isLoading} 
          onClick={handleVote}
          disabled={!write || !canVote}
        >
          {isLoading ? "Voting..." : "Vote for scorecard"}
        </Button>
        {!canVote && scorecardState !== undefined && (
          <span className="text-yellow-500 text-xs mt-1">
            Scorecard is {stateText(scorecardState)?.toLowerCase() || 'not votable'}
          </span>
        )}
        {isError && error && (
          <span className="text-red-500 text-xs mt-1">
            Error: {error.message}
          </span>
        )}
      </div>
    </div>
  );
}

export function ScorecardsContent() {
  const [selectedScorecard, setSelectedScorecard] = useState<Scorecard>();
  const { gameId, governor, currentPhase, nfts } = useGameContext();
  const { data: scorecards, isLoading } = useScorecards(gameId);
  const { data: votes } = useAccountVotes(gameId, governor);
  const { data: quorum } = useGameQuorum(gameId, governor);

  function handleVoteSuccess() {
    // Clear the selected scorecard (shopping cart)
    setSelectedScorecard(undefined);
  }
  
  // Get the proper NFT contract address from subgraph
  const { nftAddress } = useGameNFTAddress(gameId);


  if (isLoading) {
    return <Container>...</Container>;
  }

  return (
    <ActionContainer
      renderActions={
        selectedScorecard
          ? () => <ScorecardActions selectedScorecard={selectedScorecard} onSuccess={handleVoteSuccess} />
          : undefined
      }
    >
      <div className="flex gap-8">
        <div className="mb-3 flex flex-col">
          <span className="uppercase text-xs">Your Votes</span>
          <span className="text-lg">
            {formatNumber(votes ? Number(votes) : 0)} votes
          </span>
        </div>
            <div className="mb-3 flex flex-col">
              <span className="uppercase text-xs">Quorum</span>
              <span className="text-lg">
                {formatNumber(quorum ? Number(quorum) : 0)} votes
              </span>
            </div>
          </div>


      {!scorecards || scorecards.length === 0 ? (
        <div className="mt-5 text-neutral-300">
          <p>No scorecards submitted yet.</p> Anyone can submit a scorecard.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {scorecards?.map((scorecard: Scorecard, index: number) => (
              <ScorecardRow
                key={scorecard.id?.toString() || `scorecard-${index}`}
                scorecard={scorecard}
                onClick={() => setSelectedScorecard(scorecard)}
                gameQuroum={quorum ? BigInt(quorum.toString()) : BigInt(0)}
              />
            ))}
          </div>
        </>
      )}
    </ActionContainer>
  );
}
