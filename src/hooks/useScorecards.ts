import { BigNumber, ethers } from "ethers";
import request, { gql } from "graphql-request";
import { DefifaTierRedemptionWeight } from "types/defifa";
import { useQuery } from "wagmi";
import { useChainData } from "./useChainData";

// TODO flesh out
interface Proposal {
  scorecardId: number;
  calls: {
    calldata: string;
  }[];
}

const proposalsQuery = gql`
  query proposalsQuery($governorAddress: String!) {
    proposals(where: { governor_: { id: $governorAddress } }) {
      description
      calls {
        calldata
        id
        index
      }
      eta
      executed
      id
      scorecardId
      queued
      governor {
        id
      }
      startBlock
    }
  }
`;

export interface Scorecard {
  scorecardId: number;
  redemptionTierWeights: DefifaTierRedemptionWeight[];
}
[];

function getScoreCardsFromProposals(proposals: Proposal[]): Scorecard[] {
  const scoreCards = proposals?.map((proposal) => {
    return {
      scorecardId: proposal.scorecardId,
      redemptionTierWeights: proposal.calls.flatMap((call) => {
        const calldata = call.calldata;
        const decodedCallData = ethers.utils.defaultAbiCoder.decode(
          ["tuple(uint256,uint256)[]"],
          ethers.utils.hexDataSlice(calldata, 4)
        ) as BigNumber[][][];

        return decodedCallData[0].map((t) => ({
          id: t[0].toNumber(),
          redemptionWeight: t[1],
        }));
      }),
    };
  });

  return scoreCards;
}

export function useScorecards(governorAddress: string | undefined) {
  const { chainData } = useChainData();
  const graphUrl = chainData.subgraph;

  return useQuery(
    ["scorecards", governorAddress],
    async () => {
      if (!governorAddress) return;
      const res = await request<{ proposals: Proposal[] }>(
        graphUrl,
        proposalsQuery,
        {
          governorAddress: governorAddress.toLowerCase(),
        }
      );

      const scoreCards = getScoreCardsFromProposals(res.proposals);

      return scoreCards;
    },
    {
      enabled: Boolean(governorAddress),
    }
  );
}
