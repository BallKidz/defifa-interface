import { ethers } from "ethers";
import request, { gql } from "graphql-request";
import { useEffect, useState } from "react";
import { useChainData } from "./useChainData";

const proposalsQuery = gql`
  query proposalsQuery {
    proposals {
      description
      calls {
        calldata
        id
        index
      }
      eta
      executed
      id
      proposalId
      queued
      startBlock
    }
  }
`;
interface ScoreCard {
  id: number;
  redemptionWeight: number;
  proposalId: number;
}

//createScoreCardFromArray
export function createScoreCardFromArray(
  scoreCardArray: any,
  proposalId: number
) {
  const scoreCard: ScoreCard = {
    id: scoreCardArray[0],
    redemptionWeight: scoreCardArray[1],
    proposalId,
  };
  return scoreCard;
}

// get scorecards from proposals query and update state
export function useScorecards() {
  const { chainData } = useChainData();
  const graphUrl = chainData.governorSubgraph;
  const [scoreCards, setScoreCards] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorState, setError] = useState<boolean>(false);

  useEffect(() => {
    getScoreCardsAndSetScoreCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainData]);

  function getScoreCardsAndSetScoreCards() {
    request(graphUrl, proposalsQuery)
      .then((data) => {
        const scoreCards = getScoreCardsFromProposals(data.proposals);
        setScoreCards(scoreCards);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(true);
      });
  }

  function getScoreCardsFromProposals(proposals: any) {
    let scoreCards: ScoreCard[] = [];
    proposals.forEach((proposal: any) => {
      proposal.calls.forEach((call: any) => {
        const calldata = call.calldata;
        const decodedCallData = ethers.utils.defaultAbiCoder.decode(
          ["tuple(uint256,uint256)[] a"],
          ethers.utils.hexDataSlice(calldata, 4)
        );
        const scoreCard = createScoreCardFromArray(
          decodedCallData,
          proposal.proposalId
        );
        scoreCards.push(scoreCard);
      });
    });
    return scoreCards;
  }

  return { scoreCards, isLoading, errorState };
}
