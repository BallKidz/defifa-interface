import { ethers } from "ethers";
import request, { gql } from "graphql-request";
import { DefifaTierRedemptionWeight } from "types/defifa";
import { useQuery } from "wagmi";
import { useChainData } from "./useChainData";

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
      proposalId
      queued
      governor {
        id
      }
      startBlock
    }
  }
`;

export interface Scorecard {
  proposalId: number;
  redemptionTierWeights: DefifaTierRedemptionWeight[];
}
[];

function getScoreCardsFromProposals(proposals: any): Scorecard[] {
  const scoreCards = proposals?.map((proposal: any) => {
    return {
      proposalId: proposal.proposalId,
      redemptionTierWeights: proposal.calls.flatMap((call: any) => {
        const calldata = call.calldata;
        const decodedCallData = ethers.utils.defaultAbiCoder.decode(
          ["tuple(uint256,uint256)[]"],
          ethers.utils.hexDataSlice(calldata, 4)
        );

        return decodedCallData[0].map((t: any) => ({
          id: t[0],
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
      const res = await request(graphUrl, proposalsQuery, {
        governorAddress: governorAddress.toLowerCase(),
      });

      const scoreCards = getScoreCardsFromProposals(res.proposals);

      return scoreCards;
    },
    {
      enabled: Boolean(governorAddress),
    }
  );
}
