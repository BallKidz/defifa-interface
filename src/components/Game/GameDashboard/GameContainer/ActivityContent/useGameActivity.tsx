import { useGameContext } from "contexts/GameContext";
import { gql } from "graphql-request";
import { requestWithAuth } from "lib/graphql";
import { useChainData } from "hooks/useChainData";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { useGameNFTAddress } from "hooks/read/useGameNFTAddress";

const query = gql`
  query gameActivityQuery($contractAddress: String!) {
    transfers(where: { token_: { contract: $contractAddress } }, orderBy: timestamp, orderDirection: desc) {
      transactionHash
      timestamp
      from {
        id
      }
      to {
        id
      }
      token {
        number
        metadata {
          image
          name
        }
      }
    }
  }
`;

export interface TransferEvent {
  transactionHash: string;
  timestamp: string;
  from: { id: string };
  to: { id: string };
  token: {
    number: string;
    metadata: {
      image: string;
      name: string;
    } | null;
  };
}

export interface GroupedTransferEvent {
  transactionHash: string;
  timestamp: string;
  from: { id: string };
  to: { id: string };
  tokens: Array<{
    number: string;
    metadata: {
      image: string;
      name: string;
    } | null;
  }>;
  action: "Mint" | "Redeem";
  nonZeroId: string;
}

export function useGameActivity() {
  const {
    chainData: { subgraph },
  } = useChainData();
  const { gameId } = useGameContext();
  const { nftAddress } = useGameNFTAddress(gameId);

  return useQuery({
    queryKey: ["gameActivity", gameId, nftAddress],
    queryFn: async () => {
      const result = await requestWithAuth<{ transfers: TransferEvent[] }>(subgraph, query, {
        contractAddress: nftAddress?.toLowerCase(),
      });

      // Group transfers by transaction hash
      const groupedTransfers: { [key: string]: GroupedTransferEvent } = {};
      
      result.transfers.forEach((transfer: TransferEvent) => {
        const txHash = transfer.transactionHash;
        
        if (!groupedTransfers[txHash]) {
          // Determine action and non-zero ID
          let action: "Mint" | "Redeem";
          let nonZeroId: string;
          
          if (transfer.to.id === "0x0000000000000000000000000000000000000000") {
            action = "Redeem";
            nonZeroId = transfer.from.id;
          } else if (transfer.from.id === "0x0000000000000000000000000000000000000000") {
            action = "Mint";
            nonZeroId = transfer.to.id;
          } else {
            // Skip non-mint/redeem transfers
            return;
          }

          groupedTransfers[txHash] = {
            transactionHash: transfer.transactionHash,
            timestamp: transfer.timestamp,
            from: transfer.from,
            to: transfer.to,
            tokens: [],
            action,
            nonZeroId,
          };
        }
        
        // Add token to the group
        groupedTransfers[txHash].tokens.push({
          number: transfer.token.number,
          metadata: transfer.token.metadata,
        });
      });

      // Convert to array and sort by timestamp
      const groupedArray = Object.values(groupedTransfers).sort(
        (a, b) => parseInt(b.timestamp) - parseInt(a.timestamp)
      );

      return { transfers: groupedArray };
    },
    enabled: !!gameId && !!nftAddress,
    // Simple 5-second polling - no complex caching
    refetchInterval: 5 * 1000, // 5 seconds
    refetchIntervalInBackground: true,
    staleTime: 0, // Always consider data stale
  });
}
