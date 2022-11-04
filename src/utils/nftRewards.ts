import { Result } from "ethers/lib/utils";
import { V3ContractName } from "../models/contracts";
import { JB721TierParams } from "../types/interfaces";
import { ForgeDeploy } from "./contractLoaders/loadV2V3Contract";
import { decodeEncodedIPFSUri } from "./ipfs";

async function loadNftRewardsDeployment(chainId: number) {
  const latestNftContractDeployments = (await import(
    `@jbx-protocol/juice-721-delegate/broadcast/Deploy.s.sol/${chainId}/run-latest.json`
  )) as ForgeDeploy;

  return latestNftContractDeployments;
}

export async function findJBTiered721DelegateProjectDeployerAddress(
  chainId: number
) {
  const latestNftContractDeployments = await loadNftRewardsDeployment(chainId);
  return latestNftContractDeployments.transactions.find(
    (tx) =>
      tx.contractName === V3ContractName.JBTiered721DelegateProjectDeployer
  )?.contractAddress;
}

export async function findJBTiered721DelegateStoreAddress(chainId: number) {
  const latestNftContractDeployments = await loadNftRewardsDeployment(chainId);
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
