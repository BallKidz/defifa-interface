import { ContractInterface } from "ethers";

export interface ContractData {
  address: string;
  interface: ContractInterface;
}

export interface DefifaConfig {
  chainId: number;
  projectId: number;

  JBProjects: ContractData;
  JBTiered721DelegateStore: ContractData;
  JBController: ContractData;
  JBSingleTokenPaymentTerminalStore: ContractData;
  JBETHPaymentTerminal: ContractData;
  DefifaDelegate: ContractData;
  DefifaGovernor: ContractData;
  DefifaDeployer: ContractData;

  subgraph: string;
  governorSubgraph: string;
}
