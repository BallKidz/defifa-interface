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
    address: JBProjects.address,
    interface: JBProjects.abi,
  },

  JBController: {
    address: JBController.address,
    interface: JBController.abi,
  },
  JBSingleTokenPaymentTerminalStore: {
    interface: JBSingleTokenPaymentTerminalStore.abi,
  },
  JBETHPaymentTerminal: {
    address: JBETHPaymentTerminal.address,
    interface: JBETHPaymentTerminal.abi,
  },
  JBTiered721DelegateStore: {
    address: "0x8dA6B4569f88C0164d77Af5E5BF12E88d4bCd016",
    interface: IJBTiered721DelegateStore.abi,
  },

  DefifaDelegate: {
    address: "0xDBbc2fF20c6136bd3358b2aa435854086dB1bB33",
    interface: DefifaDelegate.abi,
  },
  DefifaGovernor: {
    address: "0xdb885021DfF7bc22c05697aE59c9525352DA526B",
    interface: DefifaGovernor.abi,
  },
  DefifaDeployer: {
    address: "0x2304C37e0727cd4F3e89Be2bc695e3D0f118df1c",
    interface: DefifaDeployer.abi,
  },

  subgraph: "https://api.studio.thegraph.com/query/5023/defifa-goerli/v0.0.13",
  governorSubgraph:
    "https://api.studio.thegraph.com/query/5023/defifa-goerli/v0.0.13",
};
