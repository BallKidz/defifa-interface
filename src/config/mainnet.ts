import DefifaDelegate from "@ballkidz/defifa-collection-deployer/out/DefifaDelegate.sol/DefifaDelegate.json";
import DefifaDeployer from "@ballkidz/defifa-collection-deployer/out/DefifaDeployer.sol/DefifaDeployer.json";
import DefifaGovernor from "@ballkidz/defifa-collection-deployer/out/DefifaGovernor.sol/DefifaGovernor.json";
import IJBTiered721DelegateStore from "@jbx-protocol/juice-721-delegate/out/IJBTiered721DelegateStore.sol/IJBTiered721DelegateStore.json";
import JBController from "@jbx-protocol/juice-contracts-v3/deployments/mainnet/JBController.json";
import JBETHPaymentTerminal from "@jbx-protocol/juice-contracts-v3/deployments/mainnet/JBETHPaymentTerminal.json";
import JBProjects from "@jbx-protocol/juice-contracts-v3/deployments/mainnet/JBProjects.json";
import JBSingleTokenPaymentTerminalStore from "@jbx-protocol/juice-contracts-v3/deployments/mainnet/JBSingleTokenPaymentTerminalStore.json";
import { chain } from "wagmi";
import { DefifaConfig } from "./types";

/**
 * !!! WARNING this file is completely out of date for NBA defifa edition !!!
 */
export const DEFIFA_CONFIG_MAINNET: DefifaConfig = {
  chainId: chain.mainnet.id,

  JBProjects: {
    address: JBProjects.address as `0x${string}`,
    interface: JBProjects.abi,
  },
  JBController: {
    address: JBController.address as `0x${string}`,
    interface: JBController.abi,
  },
  JBSingleTokenPaymentTerminalStore: {
    interface: JBSingleTokenPaymentTerminalStore.abi,
  },
  JBETHPaymentTerminal: {
    address: JBETHPaymentTerminal.address as `0x${string}`,
    interface: JBETHPaymentTerminal.abi,
  },

  JBTiered721DelegateStore: {
    address: "0x167ea060D75727Aa93C1c02873f189d22ef98856",
    interface: IJBTiered721DelegateStore.abi,
  },

  DefifaDelegate: {
    address: "0x600f3b83cD74175B9f10867B8218855d755c8923",
    interface: DefifaDelegate.abi,
  },
  DefifaGovernor: {
    interface: DefifaGovernor.abi,
  },
  DefifaDeployer: {
    address: "0x5e49F480f2Cdf6e638d0aBB7faa703e6aBAD46d1",
    interface: DefifaDeployer.abi,
  },

  subgraph: "",
};
