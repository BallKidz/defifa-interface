import DefifaDelegate from "@ballkidz/defifa-collection-deployer/out/DefifaDelegate.sol/DefifaDelegate.json";
import DefifaDeployer from "@ballkidz/defifa-collection-deployer/out/DefifaDeployer.sol/DefifaDeployer.json";
import DefifaGovernor from "@ballkidz/defifa-collection-deployer/out/DefifaGovernor.sol/DefifaGovernor.json";
import IJBTiered721DelegateStore from "@jbx-protocol/juice-721-delegate/out/IJBTiered721DelegateStore.sol/IJBTiered721DelegateStore.json";
import JBController from "@jbx-protocol/juice-contracts-v3/deployments/goerli/JBController3_1.json";
import JBETHPaymentTerminal from "@jbx-protocol/juice-contracts-v3/deployments/goerli/JBETHPaymentTerminal3_1.json";
import JBProjects from "@jbx-protocol/juice-contracts-v3/deployments/goerli/JBProjects.json";
import JBSingleTokenPaymentTerminalStore from "@jbx-protocol/juice-contracts-v3/deployments/goerli/JBSingleTokenPaymentTerminalStore.json";
import { DEFIFA_HOMEPAGE_PROJECT_ID_GOERLI } from "constants/constants";
import { chain } from "wagmi";
import { DefifaConfig } from "./types";

export const DEFIFA_CONFIG_GOERLI: DefifaConfig = {
  homepageProjectId: DEFIFA_HOMEPAGE_PROJECT_ID_GOERLI,
  chainId: chain.goerli.id,

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
    address: "0x8dA6B4569f88C0164d77Af5E5BF12E88d4bCd016",
    interface: IJBTiered721DelegateStore.abi,
  },

  DefifaDelegate: {
    address: "0x49120F21d94f1c76744cec46775D4C0306C04722",
    interface: DefifaDelegate.abi,
  },
  DefifaGovernor: {
    address: "0x43973556E7105b7Bf35e84F53162aB731a4c756E",
    interface: DefifaGovernor.abi,
  },
  DefifaDeployer: {
    address: "0x17cABd6BC8679954476961c73b88f5888F8FF708",
    interface: DefifaDeployer.abi,
  },
// TODO: https://api.studio.thegraph.com/query/5023/defifa-goerli/v0.0.14
  subgraph:
    "https://api.studio.thegraph.com/query/36773/defifa-aeolian/version/latest",
  governorSubgraph:
    "https://api.studio.thegraph.com/query/36773/defifa-aeolian/version/latest",
};
