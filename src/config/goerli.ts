import DefifaDelegate from "@ballkidz/defifa-collection-deployer/out/DefifaDelegate.sol/DefifaDelegate.json";
import DefifaDeployer from "@ballkidz/defifa-collection-deployer/out/DefifaDeployer.sol/DefifaDeployer.json";
import DefifaGovernor from "@ballkidz/defifa-collection-deployer/out/DefifaGovernor.sol/DefifaGovernor.json";
import IJBTiered721DelegateStore from "@jbx-protocol/juice-721-delegate/out/IJBTiered721DelegateStore.sol/IJBTiered721DelegateStore.json";
import JBController from "@jbx-protocol/juice-contracts-v3/deployments/goerli/JBController.json";
import JBETHPaymentTerminal from "@jbx-protocol/juice-contracts-v3/deployments/goerli/JBETHPaymentTerminal.json";
import JBProjects from "@jbx-protocol/juice-contracts-v3/deployments/goerli/JBProjects.json";
import JBSingleTokenPaymentTerminalStore from "@jbx-protocol/juice-contracts-v3/deployments/goerli/JBSingleTokenPaymentTerminalStore.json";
import { DEFIFA_PROJECT_ID_GOERLI } from "constants/constants";
import { chain } from "wagmi";
import { DefifaConfig } from "./types";

export const DEFIFA_CONFIG_GOERLI: DefifaConfig = {
  projectId: DEFIFA_PROJECT_ID_GOERLI,
  chainId: chain.goerli.id,

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
    address: "0xC7E775BbA411Df1D3c5D70Ec4C45f3DF8A85B0d0",
    interface: IJBTiered721DelegateStore.abi,
  },

  DefifaDelegate: {
    address: "0x168FD684Ac6aDa8B022Ddd0a7d75ba12C1fBE874",
    interface: DefifaDelegate.abi,
  },
  DefifaGovernor: {
    address: "0xa5cdF50f25EBBFf94ac57507Dc24B63af8514DaE",
    interface: DefifaGovernor.abi,
  },
  DefifaDeployer: {
    address: "0x020fe1ecE9cAeb6bc6243e124d2a617237Ae4675",
    interface: DefifaDeployer.abi,
  },

  subgraph: "https://api.studio.thegraph.com/proxy/5023/defifa-goerli/v0.0.12b",
  governorSubgraph:
    "https://api.studio.thegraph.com/proxy/5023/defifa-goerli/v0.0.12b",
};
