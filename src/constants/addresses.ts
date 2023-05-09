import DefifaDeployerABI from "@jbx-protocol/juice-defifa-nfl-playoff-edition/out/DefifaDeployer.sol/DefifaDeployer.json";
import DefifaDelegateABI from "@jbx-protocol/juice-defifa-nfl-playoff-edition/out/DefifaDelegate.sol/DefifaDelegate.json";
import DefifaGovernorABI from "@jbx-protocol/juice-defifa-nfl-playoff-edition/out/DefifaGovernor.sol/DefifaGovernor.json";
import { chain } from "wagmi";
import IJBTiered721DelegateStore from "@jbx-protocol/juice-721-delegate/out/IJBTiered721DelegateStore.sol/IJBTiered721DelegateStore.json";
import {
  DEFIFA_PROJECT_ID_GOERLI,
  DEFIFA_PROJECT_ID_MAINNET,
} from "./constants";
import JBControllerMainnet from "@jbx-protocol/juice-contracts-v3/deployments/mainnet/JBController.json";
import JBControllerGoerli from "@jbx-protocol/juice-contracts-v3/deployments/goerli/JBController.json";
import MainnetJBETHPaymentTerminal from "@jbx-protocol/juice-contracts-v3/deployments/mainnet/JBETHPaymentTerminal.json";
import GoerliJBETHPaymentTerminal from "@jbx-protocol/juice-contracts-v3/deployments/goerli/JBETHPaymentTerminal.json";
import MainnetJBSingleTokenPaymentTerminalStore from "@jbx-protocol/juice-contracts-v3/deployments/mainnet/JBSingleTokenPaymentTerminalStore.json";
import GoerliJJBSingleTokenPaymentTerminalStore from "@jbx-protocol/juice-contracts-v3/deployments/goerli/JBSingleTokenPaymentTerminalStore.json";
export const ETH_TOKEN_ADDRESS = "0x000000000000000000000000000000000000eeee";

export const mainnetData = {
  JBTiered721DelegateStore: {
    address: "0xffb2cd8519439a7ddcf2c933caedd938053067d2",
    interface: IJBTiered721DelegateStore.abi,
  },
  chainId: chain.mainnet.id,
  JBController: JBControllerMainnet,
  JBSingleTokenPaymentTerminalStore: MainnetJBSingleTokenPaymentTerminalStore,
  projectId: DEFIFA_PROJECT_ID_MAINNET,
  ethPaymentTerminal: MainnetJBETHPaymentTerminal,
  defifaDelegate: {
    address: "0x600f3b83cD74175B9f10867B8218855d755c8923",
    interface: DefifaDelegateABI.abi,
  },
  DefifaDelegateABI: DefifaDelegateABI.abi,
  defifaGovernor: {
    interface: DefifaGovernorABI.abi,
  },
  defifaCreate: {
    address: "0x65c8AE99784179F0D604125b5D2A8f56965fB3Bc",
    interface: DefifaDelegateABI.abi,
  },
  defifaDeployer: "0x65c8AE99784179F0D604125b5D2A8f56965fB3Bc",

  defifaDeployerInterface: DefifaDeployerABI.abi,
  subgraph: "https://api.thegraph.com/subgraphs/name/devianyeth/defifa-nfl",
  governorSubgraph:
    "https://api.thegraph.com/subgraphs/name/devianyeth/defifa-nfl-governor",
};

export const goerliData = {
  JBTiered721DelegateStore: {
    address: "0xF85DC8C2b9dFfeab95c614A306141882048dE467",
    interface: IJBTiered721DelegateStore.abi,
  },
  chainId: chain.goerli.id,
  JBController: JBControllerGoerli,
  JBSingleTokenPaymentTerminalStore: GoerliJJBSingleTokenPaymentTerminalStore,
  projectId: DEFIFA_PROJECT_ID_GOERLI,
  ethPaymentTerminal: GoerliJBETHPaymentTerminal,
  DefifaDelegateABI: DefifaDelegateABI.abi,
  defifaGovernor: {
    interface: DefifaGovernorABI.abi,
  },
  defifaCreate: {
    address: "0x65c8AE99784179F0D604125b5D2A8f56965fB3Bc",
    interface: DefifaDelegateABI.abi,
  },
  defifaDeployer: "0x65c8AE99784179F0D604125b5D2A8f56965fB3Bc",
  defifaDeployerInterface: DefifaDeployerABI.abi,
  subgraph:
    "https://api.thegraph.com/subgraphs/name/devianyeth/defifa-nfl-goerli",
  governorSubgraph:
    "https://api.thegraph.com/subgraphs/name/devianyeth/defifa-nfl-governor-goerli",
};

export const mainnet = true;

export function getChainData(chainId?: number) {
  if (chainId === chain.mainnet.id) {
    return mainnetData;
  }
  if (chainId === chain.goerli.id) {
    return goerliData;
  }
  return mainnet ? mainnetData : goerliData;
}
