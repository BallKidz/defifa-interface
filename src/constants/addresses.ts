import DefifaDeployerABI from "@jbx-protocol/juice-defifa-nfl-playoff-edition/out/DefifaDeployer.sol/DefifaDeployer.json";
import DefifaDelegateABI from "@jbx-protocol/juice-defifa-nfl-playoff-edition/out/DefifaDelegate.sol/DefifaDelegate.json";
import DefifaGovernorABI from "@jbx-protocol/juice-defifa-nfl-playoff-edition/out/DefifaGovernor.sol/DefifaGovernor.json";
import DefifaCreateABI from "@ballkidz/defifa-collection-deployer/out/DefifaDeployer.sol/DefifaDeployer.json";
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
    address: "0x167ea060D75727Aa93C1c02873f189d22ef98856",
    interface: IJBTiered721DelegateStore.abi,
  },
  chainId: chain.mainnet.id,
  JBController: JBControllerMainnet,
  JBSingleTokenPaymentTerminalStore: MainnetJBSingleTokenPaymentTerminalStore,
  projectId: DEFIFA_PROJECT_ID_MAINNET,
  ethPaymentTerminal: {
    address: "0xFA391De95Fcbcd3157268B91d8c7af083E607A5C",
    interface: MainnetJBETHPaymentTerminal.abi,
  },
  defifaDelegate: {
    address: "0x600f3b83cD74175B9f10867B8218855d755c8923",
    interface: DefifaDelegateABI.abi,
  },
  DefifaDelegateABI: DefifaDelegateABI.abi,
  defifaGovernor: {
    interface: DefifaGovernorABI.abi,
  },
  defifaCreate: {
    address: "0x5e49F480f2Cdf6e638d0aBB7faa703e6aBAD46d1",
    interface: DefifaDelegateABI.abi,
  },
  defifaDeployer: "0x5e49F480f2Cdf6e638d0aBB7faa703e6aBAD46d1",

  defifaDeployerInterface: DefifaDeployerABI.abi,
  subgraph: "https://api.thegraph.com/subgraphs/name/devianyeth/defifa-nfl",
  governorSubgraph:
    "https://api.thegraph.com/subgraphs/name/devianyeth/defifa-nfl-governor",
};

export const goerliData = {
  JBTiered721DelegateStore: {
    address: "0xC7E775BbA411Df1D3c5D70Ec4C45f3DF8A85B0d0",
    interface: IJBTiered721DelegateStore.abi,
  },
  chainId: chain.goerli.id,
  JBController: JBControllerGoerli,
  JBSingleTokenPaymentTerminalStore: GoerliJJBSingleTokenPaymentTerminalStore,
  projectId: DEFIFA_PROJECT_ID_GOERLI,
  ethPaymentTerminal: {
    address: "0x0baCb87Cf7DbDdde2299D92673A938E067a9eb29",
    interface: GoerliJBETHPaymentTerminal.abi,
  },
  DefifaDelegateABI: DefifaDelegateABI.abi,
  defifaGovernor: {
    interface: DefifaGovernorABI.abi,
  },
  defifaCreate: {
    address: "0x5e49F480f2Cdf6e638d0aBB7faa703e6aBAD46d1",
    interface: DefifaCreateABI.abi,
  },
  defifaDeployer: "0x5e49F480f2Cdf6e638d0aBB7faa703e6aBAD46d1",
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
