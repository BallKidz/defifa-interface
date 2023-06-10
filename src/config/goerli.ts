import DefifaDeployment from "@ballkidz/defifa-collection-deployer/broadcast/Deploy.s.sol/5/run-latest.json";
import DefifaDelegate from "@ballkidz/defifa-collection-deployer/out/DefifaDelegate.sol/DefifaDelegate.json";
import DefifaDeployer from "@ballkidz/defifa-collection-deployer/out/DefifaDeployer.sol/DefifaDeployer.json";
import DefifaGovernor from "@ballkidz/defifa-collection-deployer/out/DefifaGovernor.sol/DefifaGovernor.json";
import Juice721DelegateDeployment from "@jbx-protocol/juice-721-delegate/broadcast/Deploy.s.sol/5/run-latest.json";
import IJBTiered721DelegateStore from "@jbx-protocol/juice-721-delegate/out/IJBTiered721DelegateStore.sol/IJBTiered721DelegateStore.json";
import JBController from "@jbx-protocol/juice-contracts-v3/deployments/goerli/JBController3_1.json";
import JBETHPaymentTerminal from "@jbx-protocol/juice-contracts-v3/deployments/goerli/JBETHPaymentTerminal3_1.json";
import JBProjects from "@jbx-protocol/juice-contracts-v3/deployments/goerli/JBProjects.json";
import JBSingleTokenPaymentTerminalStore from "@jbx-protocol/juice-contracts-v3/deployments/goerli/JBSingleTokenPaymentTerminalStore.json";
import { addressFor, ForgeDeploy } from "forge-run-parser";
import { chain } from "wagmi";
import { DefifaConfig } from "./types";
import { EthereumAddress } from "types/defifa";

export const DEFIFA_CONFIG_GOERLI: DefifaConfig = {
  chainId: chain.goerli.id,

  JBProjects: {
    address: JBProjects.address as EthereumAddress,
    interface: JBProjects.abi,
  },

  JBController: {
    address: JBController.address as EthereumAddress,
    interface: JBController.abi,
  },
  JBSingleTokenPaymentTerminalStore: {
    interface: JBSingleTokenPaymentTerminalStore.abi,
  },
  JBETHPaymentTerminal: {
    address: JBETHPaymentTerminal.address as EthereumAddress,
    interface: JBETHPaymentTerminal.abi,
  },
  JBTiered721DelegateStore: {
    // address: addressFor(
    //   "JBTiered721DelegateStore",
    //   Juice721DelegateDeployment as ForgeDeploy
    // )!,
    address: "0x2206f10e626dAc1b3F90eC98E4791F406e006351", // delegate 3.3, WIP
    interface: IJBTiered721DelegateStore.abi,
  },
  DefifaDelegate: {
    address: addressFor("DefifaDelegate", DefifaDeployment as ForgeDeploy)!,
    interface: DefifaDelegate.abi,
  },
  DefifaGovernor: {
    address: addressFor("DefifaGovernor", DefifaDeployment as ForgeDeploy)!,
    interface: DefifaGovernor.abi,
  },
  DefifaDeployer: {
    address: addressFor("DefifaDeployer", DefifaDeployment as ForgeDeploy)!,
    interface: DefifaDeployer.abi,
  },
  subgraph:
    "https://api.thegraph.com/subgraphs/name/tomquirk/defifa-subgrap-hosted",
};

console.info("goerli chain data::", DEFIFA_CONFIG_GOERLI);
