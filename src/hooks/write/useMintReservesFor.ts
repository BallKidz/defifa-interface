import { useConnectModal } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { useOutstandingNumber } from "../read/OutStandingReservedTokens";
import { useChainData } from "../useChainData";
import { DefifaGamePhase } from "components/NewGameDashboard/QueueNextPhaseButton/useCurrentGamePhase";
import { useGameContext } from "contexts/GameContext";

export function useMintReservesFor(
  simulate = false,
  dataSourceAddress: string
) {
  const { address, connector, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { chainData } = useChainData();
  const outStanding = useOutstandingNumber();
  const {
    currentPhase,
    loading: { currentPhaseLoading },
  } = useGameContext();

  const { config, error: err } = usePrepareContractWrite({
    addressOrName: dataSourceAddress,
    contractInterface: chainData.DefifaDelegate.interface,
    functionName: "mintReservesFor((uint256,uint256)[])",
    args: [outStanding],
    chainId: chainData.chainId,
    enabled: !currentPhaseLoading && currentPhase === DefifaGamePhase.SCORING,
  });

  const filteredOutstanding = outStanding.filter((item) => {
    return item.count > 0;
  });

  const { data, write, error, isError } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({ hash: data?.hash });

  return {
    data,
    write: () => {
      if (!isConnected) {
        openConnectModal!();
      } else {
        write?.();
      }
    },
    isLoading,
    isSuccess,
    error,
    isError,
    disabled: filteredOutstanding.length == 0,
  };
}
