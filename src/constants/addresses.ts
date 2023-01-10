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
    address: "0xf41eaa1241c07833de9e4f48ce1b4c46dbb9d48d",
    interface: DefifaDelegateABI.abi,
  },
  defifaGovernor: {
    address: "0x4361428f6962c808f3451e357610841c1d470306",
    interface: DefifaGovernorABI.abi,
  },
  defifaDeployer: "0x1b05b64aa85822554cfebff33b7447b8ac0320d3",
  defifaDeployerInterface: DefifaDeployerABI.abi,
  subgraph: "https://api.thegraph.com/subgraphs/name/devianyeth/defifa-nfl",
  governorSubgraph:
    "https://api.thegraph.com/subgraphs/name/devianyeth/defifa-governor",
};

export const goerliData = {
  JBTiered721DelegateStore: {
    address: "0x3ea16deff07f031e86bd13c55961eb576cd579a6",
    interface: IJBTiered721DelegateStore.abi,
  },
  chainId: chain.goerli.id,
  JBController: JBControllerGoerli,
  JBSingleTokenPaymentTerminalStore: GoerliJJBSingleTokenPaymentTerminalStore,
  projectId: DEFIFA_PROJECT_ID_GOERLI,
  ethPaymentTerminal: GoerliJBETHPaymentTerminal,
  defifaDelegate: {
    address: "0x87ee2f4b8ee8f4c79523f36fecbb5f76b23e7d6f",
    interface: DefifaDelegateABI.abi,
  },
  defifaGovernor: {
    address: "0x1f011db6b3d6729531e224281d2d4e82ce7f8e32",
    interface: DefifaGovernorABI.abi,
  },
  defifaDeployer: "0xb52f73d870fa8c4d7232cda5c34e4de43fed1d2a",
  defifaDeployerInterface: DefifaDeployerABI.abi,
  subgraph:
    "https://api.thegraph.com/subgraphs/name/devianyeth/defifa-nfl-goerli",
  governorSubgraph:
    "https://api.thegraph.com/subgraphs/name/devianyeth/defifa-governor-goerli",
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
