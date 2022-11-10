import { useContractRead, useNetwork } from "wagmi";
import { getChainData } from "../../constants/addresses";
import DefifaDeployer from "@jbx-protocol/juice-defifa/out/DefifaDeployer.sol/DefifaDeployer.json";
import { useState, useEffect } from "react";
import { formatDateToUTC } from "../../utils/format/formatDate";

type DescriptionDates = {
  mint: {
    date: string;
    phase: number;
  };
  start: {
    date: string;
    phase: number;
  };
  tradeDeadline: {
    date: string;
    phase: number;
  };
  end: {
    date: string;
    phase: number;
  };
};

export function useDeployerDuration() {
  const network = useNetwork();
  const chainData = getChainData(network?.chain?.id);
  const defifaDeployer = chainData.defifaDeployer;
  const { data: deployerDates } = useContractRead({
    addressOrName: defifaDeployer,
    contractInterface: DefifaDeployer.abi,
    functionName: "timesFor",
    args: chainData.projectId,
    chainId: chainData.chainId,
  });
  const [dates, setDates] = useState<DescriptionDates>({
    mint: { date: "", phase: 0 },
    start: { date: "", phase: 0 },
    tradeDeadline: { date: "", phase: 0 },
    end: { date: "", phase: 0 },
  });

  useEffect(() => {
    if (!deployerDates) return;

    setDates({
      mint: { date: formatDateToUTC(deployerDates.start * 1000), phase: 1 },
      start: { date: formatDateToUTC(deployerDates.start * 1000), phase: 2 },
      tradeDeadline: {
        date: formatDateToUTC(deployerDates.tradeDeadline * 1000),
        phase: 3,
      },
      end: { date: formatDateToUTC(deployerDates.end * 1000), phase: 4 },
    });
  }, [deployerDates]);

  return dates;
}
