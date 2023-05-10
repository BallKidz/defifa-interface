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
    abi: MainnetJBETHPaymentTerminal.abi,
  },
  defifaDelegate: {
    address: "0x600f3b83cD74175B9f10867B8218855d755c8923",
    interface: DefifaDelegateABI.abi,
  },
  defifaGovernor: {
    address: "0x4361428f6962c808f3451e357610841c1d470306",
    interface: DefifaGovernorABI.abi,
  },
  defifaCreate: {
    address: "0x21c9Fe9ce18eD09f8D6D38343F7435402154b751",
    interface: DefifaCreateABI.abi,
  },
  defifaDeployer: "0x1b05b64aa85822554cfebff33b7447b8ac0320d3",
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
  ethPaymentTerminal: {
    address: "0x0baCb87Cf7DbDdde2299D92673A938E067a9eb29",
    abi: GoerliJBETHPaymentTerminal.abi,
  },
  defifaDelegate: {
    address: "0x87ee2f4b8ee8f4c79523f36fecbb5f76b23e7d6f",
    interface: DefifaDelegateABI.abi,
  },
  defifaGovernor: {
    address: "0x8e1aec30063565e597705e71ba14dffc4c390ef0",
    interface: DefifaGovernorABI.abi,
  },
  defifaCreate: {
    address: "0x75d81896199e0BC8A8EdA102623CE5189bA0ec54",
    interface: DefifaCreateABI.abi,
  },
  defifaDeployer: "0x75d81896199e0BC8A8EdA102623CE5189bA0ec54",
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
