import { chain } from "wagmi";
import { abi } from "@jbx-protocol/juice-721-delegate/out/IJBTiered721DelegateStore.sol/IJBTiered721DelegateStore.json";
import {
  DEFIFA_PROJECT_ID_GOERLI,
  DEFIFA_PROJECT_ID_MAINNET,
} from "./constants";
import JBControllerMainnet from "@jbx-protocol/juice-contracts-v3/deployments/mainnet/JBController.json";
import JBControllerGoerli from "@jbx-protocol/juice-contracts-v3/deployments/goerli/JBController.json";
import MainnetJBETHPaymentTerminal from "@jbx-protocol/juice-contracts-v3/deployments/mainnet/JBSingleTokenPaymentTerminalStore.json";
import GoerliJBETHPaymentTerminal from "@jbx-protocol/juice-contracts-v3/deployments/goerli/JBSingleTokenPaymentTerminalStore.json";
export const ETH_TOKEN_ADDRESS = "0x000000000000000000000000000000000000eeee";
export const goerliData = {
  JBTiered721DelegateStore: {
    address: "0x3ea16deff07f031e86bd13c55961eb576cd579a6",
    interface: abi,
  },
  chainId: chain.goerli.id,
  JBController: JBControllerGoerli,
  projectId: DEFIFA_PROJECT_ID_GOERLI,
  ethPaymentTerminal: GoerliJBETHPaymentTerminal,
};

export const mainnetData = {
  JBTiered721DelegateStore: {
    address: "0xffb2cd8519439a7ddcf2c933caedd938053067d2",
    interface: abi,
  },
  chainId: chain.mainnet.id,
  JBController: JBControllerMainnet,
  projectId: DEFIFA_PROJECT_ID_MAINNET,
  ethPaymentTerminal: MainnetJBETHPaymentTerminal,
};

export const mainnet = false;

export function getChainData(chainId?: number) {
  if (chainId === chain.mainnet.id) {
    return mainnetData;
  }
  if (chainId === chain.goerli.id) {
    return goerliData;
  }
  return mainnet ? mainnetData : goerliData;
}
