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
  }; // address read on-chain per game
  JBETHPaymentTerminal: ContractData;
  DefifaDelegate: ContractData;
  DefifaGovernor: {
    interface: ContractInterface;
  }; // address read on-chain per game
  DefifaDeployer: ContractData;

  subgraph: string;
}
