import { useChainData } from "hooks/useChainData";
import { useReadContract } from "wagmi";
import { Abi } from "viem";

export function useDirectOwnerCheck(governorAddress: string | undefined) {
  const { chainData } = useChainData();

  // Try to call owner() directly with a minimal ABI
  const minimalOwnerABI = [
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  const { data: owner, isLoading, error } = useReadContract({
    address: (governorAddress ?? "") as `0x${string}`,
    abi: minimalOwnerABI as Abi,
    functionName: "owner",
    chainId: chainData.chainId,
    query: {
      enabled: !!governorAddress,
    },
  });

  console.log("🔥 useDirectOwnerCheck", {
    governorAddress,
    owner,
    isLoading,
    error,
    deployerAddress: "0x4502dda1f33dc5703008e9a1c86b9752c3cd6024"
  });

  return { owner, isLoading, error };
}
