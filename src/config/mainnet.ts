import IJBTiered721DelegateStore from "@jbx-protocol/juice-721-delegate/out/IJBTiered721DelegateStore.sol/IJBTiered721DelegateStore.json";
import JBController from "@jbx-protocol/juice-contracts-v3/deployments/mainnet/JBController.json";
import JBETHPaymentTerminal from "@jbx-protocol/juice-contracts-v3/deployments/mainnet/JBETHPaymentTerminal.json";
import JBProjects from "@jbx-protocol/juice-contracts-v3/deployments/mainnet/JBProjects.json";
import JBSingleTokenPaymentTerminalStore from "@jbx-protocol/juice-contracts-v3/deployments/mainnet/JBSingleTokenPaymentTerminalStore.json";
import DefifaDelegateABI from "@jbx-protocol/juice-defifa-nfl-playoff-edition/out/DefifaDelegate.sol/DefifaDelegate.json";
import DefifaDeployerABI from "@jbx-protocol/juice-defifa-nfl-playoff-edition/out/DefifaDeployer.sol/DefifaDeployer.json";
import DefifaGovernorABI from "@jbx-protocol/juice-defifa-nfl-playoff-edition/out/DefifaGovernor.sol/DefifaGovernor.json";
import { DEFIFA_PROJECT_ID_MAINNET } from "constants/constants";
import { chain } from "wagmi";
import { DefifaConfig } from "./types";

/**
 * !!! WARNING this file is completely out of date for NBA defifa edition !!!
 */
export const DEFIFA_CONFIG_MAINNET: DefifaConfig = {
  projectId: DEFIFA_PROJECT_ID_MAINNET,
  chainId: chain.mainnet.id,

  JBProjects: {
    address: JBProjects.address,
    interface: JBProjects.abi,
  },
  JBController: {
    address: JBController.address,
    interface: JBController.abi,
  },
  JBSingleTokenPaymentTerminalStore: {
    address: JBSingleTokenPaymentTerminalStore.address,
    interface: JBSingleTokenPaymentTerminalStore.abi,
  },
  JBETHPaymentTerminal: {
    address: JBETHPaymentTerminal.address,
    interface: JBETHPaymentTerminal.abi,
  },

  JBTiered721DelegateStore: {
    address: "0x167ea060D75727Aa93C1c02873f189d22ef98856",
    interface: IJBTiered721DelegateStore.abi,
  },

  DefifaDelegate: {
    address: "0x600f3b83cD74175B9f10867B8218855d755c8923",
    interface: DefifaDelegateABI.abi,
  },
  DefifaGovernor: {
    interface: DefifaGovernorABI.abi,
    address: "", // TODO
  },
  DefifaDeployer: {
    address: "0x5e49F480f2Cdf6e638d0aBB7faa703e6aBAD46d1",
    interface: DefifaDeployerABI.abi,
  },

  subgraph: "https://api.thegraph.com/subgraphs/name/devianyeth/defifa-nfl",
  governorSubgraph:
    "https://api.thegraph.com/subgraphs/name/devianyeth/defifa-nfl-governor",
};
