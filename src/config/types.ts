import { ContractInterface } from "ethers";
import { EthereumAddress } from "types/defifa";

interface ContractData {
  address: EthereumAddress;
  interface: ContractInterface;
}

export interface DefifaConfig {
  chainId: number;

  JBProjects: ContractData;
  JBTiered721DelegateStore: ContractData;
  JBController: ContractData;
  JBSingleTokenPaymentTerminalStore: {
    interface: ContractInterface;
  }; // address read onchain per game
  JBETHPaymentTerminal: ContractData;
  DefifaDelegate: ContractData;
  DefifaGovernor: ContractData;
  DefifaDeployer: ContractData;

  subgraph: string;
}
