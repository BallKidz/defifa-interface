import { ContractInterface } from "ethers";

interface ContractData {
  address: `0x${string}`;
  interface: ContractInterface;
}

export interface DefifaConfig {
  chainId: number;

  JBProjects: ContractData;
  JBTiered721DelegateStore: ContractData;
  JBController: ContractData;
  JBSingleTokenPaymentTerminalStore: {
    interface: ContractInterface;
  };
  JBETHPaymentTerminal: ContractData;
  DefifaDelegate: ContractData;
  DefifaGovernor: ContractData;
  DefifaDeployer: ContractData;

  subgraph: string;
  governorSubgraph: string;
}
