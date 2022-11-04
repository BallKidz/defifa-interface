import { Result } from "ethers/lib/utils";
import { useNetwork } from "wagmi";
import { V3ContractName } from "../models/contracts";
import { JB721TierParams } from "../types/interfaces";
import { ForgeDeploy } from "./contractLoaders/loadV2V3Contract";
import { decodeEncodedIPFSUri } from "./ipfs";

async function loadNftRewardsDeployment() {
  const latestNftContractDeployments = (await import(
    `@jbx-protocol/juice-721-delegate/broadcast/Deploy.s.sol/${5}/run-latest.json`
  )) as ForgeDeploy;

  return latestNftContractDeployments;
}

export async function findJBTiered721DelegateProjectDeployerAddress() {
  const latestNftContractDeployments = await loadNftRewardsDeployment();
  return latestNftContractDeployments.transactions.find(
    (tx) =>
      tx.contractName === V3ContractName.JBTiered721DelegateProjectDeployer
  )?.contractAddress;
}

export async function findJBTiered721DelegateStoreAddress() {
  const latestNftContractDeployments = await loadNftRewardsDeployment();
  return latestNftContractDeployments.transactions.find(
    (tx) => tx.contractName === V3ContractName.JBTiered721DelegateStore
  )?.contractAddress;
}

export function CIDsOfNftRewardTiersResponse(
  nftRewardTiersResponse: Result
): string[] {
  const cids: string[] = nftRewardTiersResponse
    .map((contractRewardTier: JB721TierParams) => {
      return decodeEncodedIPFSUri(contractRewardTier.encodedIPFSUri);
    })
    .filter((cid) => cid.length > 0);
  return cids;
}
