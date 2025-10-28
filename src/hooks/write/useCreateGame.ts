import { constants } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { useChainData } from "hooks/useChainData";
import { useChainValidation } from "hooks/useChainValidation";
import { getChainData } from "config";
import { DefifaLaunchProjectData } from "types/defifa";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { Abi } from "viem";

export function useCreateGame(_launchProjectData?: DefifaLaunchProjectData, targetChainId?: number) {
  const { isConnected, chainId: walletChainId } = useAccount();
  const { chainData } = useChainData();
  
  // Use targetChainId if provided, otherwise use current wallet chain
  const deploymentChainId = targetChainId || chainData.chainId;
  const deploymentChainData = targetChainId ? getChainData(targetChainId) : chainData;
  
  // Validate chain for deployment
  const chainValidation = useChainValidation(deploymentChainId);

  const defaultTokenUriResolver =
    _launchProjectData?.defaultTokenUriResolver || constants.AddressZero;
  
  // Destructure to remove 'rules' field which is only for IPFS metadata, not the contract
  const preparedLaunchProjectData = _launchProjectData
    ? (() => {
        const { rules, ...contractData } = _launchProjectData;
        return {
          ...contractData,
          defaultTokenUriResolver,
          tiers: _launchProjectData.tiers.map((tier) => ({
            ...tier,
            price: parseEther(tier.price),
          })),
        };
      })()
    : undefined;

  const { 
    data: hash, 
    writeContract, 
    error, 
    isError 
  } = useWriteContract();

  if (isError) {
    console.error("useCreateGame::useWriteContract::error", error);
  }

  const {
    isLoading,
    isSuccess,
    isError: isWaitForTransactionError,
    error: waitForTransactionError,
    data: transactionData,
  } = useWaitForTransactionReceipt({ hash });
  
  if (isWaitForTransactionError) {
    console.error(
      "useCreateGame::useWaitForTransaction::error",
      waitForTransactionError
    );
  }

  const handleWrite = async () => {
    if (!isConnected) {
      return; // Let the UI handle showing connect modal
    }

    // Check chain validation first
    if (!chainValidation.isValid) {
      if (chainValidation.needsSwitch) {
        try {
          await chainValidation.switchChain();
          // Wait a moment for chain switch to complete
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error('Failed to switch chain:', error);
          return;
        }
      } else {
        console.error('Chain validation failed:', chainValidation.error);
        return;
      }
    }

    console.log("useCreateGame::payload", preparedLaunchProjectData);
    console.log("useCreateGame::deploymentChainData", deploymentChainData);
    console.log("useCreateGame::deploymentChainId", deploymentChainId);
    console.log("useCreateGame::walletChainId", walletChainId);
    console.log("useCreateGame::terminal", preparedLaunchProjectData?.terminal);
    console.log("useCreateGame::store", preparedLaunchProjectData?.store);
    console.log("useCreateGame::defaultAttestationDelegate", preparedLaunchProjectData?.defaultAttestationDelegate);
    
    // Force reasonable gas limits for testnets
    const gasLimit = deploymentChainId === 11155111 ? 3000000n : // Sepolia: 3M gas
                     deploymentChainId === 84532 ? 2000000n :    // Base Sepolia: 2M gas  
                     5000000n; // Default: 5M gas
    
    console.log("useCreateGame::gasLimit", gasLimit, "for chainId", deploymentChainId);
    
    writeContract({
      address: deploymentChainData.DefifaDeployer.address as `0x${string}`,
      abi: deploymentChainData.DefifaDeployer.interface as any,
      functionName: "launchGameWith",
      args: [preparedLaunchProjectData as any],
      chainId: deploymentChainId,
      gas: gasLimit, // Force reasonable gas limit
    });
  };

  return {
    data: hash,
    transactionData,
    write: handleWrite,
    isLoading,
    isSuccess,
    error,
    isError,
  };
}
