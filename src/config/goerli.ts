import DefifaCreateABI from "@ballkidz/defifa-collection-deployer/out/DefifaDeployer.sol/DefifaDeployer.json";
import IJBTiered721DelegateStore from "@jbx-protocol/juice-721-delegate/out/IJBTiered721DelegateStore.sol/IJBTiered721DelegateStore.json";
import JBController from "@jbx-protocol/juice-contracts-v3/deployments/goerli/JBController.json";
import JBETHPaymentTerminal from "@jbx-protocol/juice-contracts-v3/deployments/goerli/JBETHPaymentTerminal.json";
import JBProjects from "@jbx-protocol/juice-contracts-v3/deployments/goerli/JBProjects.json";
import JBSingleTokenPaymentTerminalStore from "@jbx-protocol/juice-contracts-v3/deployments/goerli/JBSingleTokenPaymentTerminalStore.json";
import DefifaDelegateABI from "@jbx-protocol/juice-defifa-nfl-playoff-edition/out/DefifaDelegate.sol/DefifaDelegate.json";
import DefifaDeployerABI from "@jbx-protocol/juice-defifa-nfl-playoff-edition/out/DefifaDeployer.sol/DefifaDeployer.json";
import DefifaGovernorABI from "@jbx-protocol/juice-defifa-nfl-playoff-edition/out/DefifaGovernor.sol/DefifaGovernor.json";
import { chain } from "wagmi";
import { DEFIFA_PROJECT_ID_GOERLI } from "../constants/constants";
import { DefifaConfig } from "./types";

export const DEFIFA_CONFIG_GOERLI: DefifaConfig = {
  projectId: DEFIFA_PROJECT_ID_GOERLI,
  chainId: chain.goerli.id,

  JBProjects: {
    address: JBProjects.address,
    interface: JBProjects.abi,
  },
  JBTiered721DelegateStore: {
    address: "0xC7E775BbA411Df1D3c5D70Ec4C45f3DF8A85B0d0",
    interface: IJBTiered721DelegateStore.abi,
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
    address: "0x0baCb87Cf7DbDdde2299D92673A938E067a9eb29",
    interface: JBETHPaymentTerminal.abi,
  },
  DefifaDelegate: {
    address: "", // TODO
    interface: DefifaDelegateABI.abi,
  },
  DefifaGovernor: {
    interface: DefifaGovernorABI.abi,
  },
  DefifaCreate: {
    address: "0x47f699C71B3dfB25299dE9a22f1ad01774EA91A1",
    interface: DefifaCreateABI.abi,
  },
  DefifaDeployer: {
    address: "0x47f699C71B3dfB25299dE9a22f1ad01774EA91A1",
    interface: DefifaDeployerABI.abi,
  },

  subgraph: "https://api.studio.thegraph.com/proxy/5023/defifa-goerli/v0.0.12b",
  governorSubgraph:
    "https://api.studio.thegraph.com/proxy/5023/defifa-goerli/v0.0.12b",
};
