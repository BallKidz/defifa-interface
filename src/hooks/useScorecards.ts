import request, { gql } from "graphql-request";
import { useEffect, useState } from "react";
import { useChainData } from "./useChainData";
import { ethers } from "ethers";
import { useInterval } from "./useInterval";

const proposalsQuery = gql`
  query proposalsQuery($owner: String!) {
    {
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
  }
`;
interface ScoreCard {
  id: number;
  redemptionWeight: number;
}

//createScoreCardFromArray
export function createScoreCardFromArray(scoreCardArray: any) {
  const scoreCard: ScoreCard = {
    id: scoreCardArray[0],
    redemptionWeight: scoreCardArray[1],
  };
  return scoreCard;
}

// get scorecards from proposals query and update state
export function useScorecards() {
  //chainData
  const { chainData } = useChainData();
  const graphUrl = chainData.governorSubgraph;
  const [scoreCards, setScoreCards] = useState<ScoreCard[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorState, setError] = useState<boolean>(false);

  function getScoreCardsAndSetScoreCards() {
    if (graphUrl) {
      request(graphUrl, proposalsQuery)
        .then((data) => {
          const scoreCards = getScoreCardsFromProposals(data.proposals);
          setScoreCards(scoreCards);
        })
        .catch((error) => {
          setError(true);
        });
    }
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
        const scoreCard = decodedCallData;
        scoreCards.push(createScoreCardFromArray(scoreCard));
      });
    });
    return scoreCards;
  }

  useEffect(() => {
    getScoreCardsAndSetScoreCards();
  }, []);

  useInterval(() => {
    getScoreCardsAndSetScoreCards();
  }, 5000);
}
