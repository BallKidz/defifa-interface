import { BigNumber } from "ethers";

export interface DefifaTier {
  name: string;
  price: any;
  reservedRate: number;
  reservedTokenBeneficiary: string;
  royaltyRate: number;
  royaltyBeneficiary: string;
  encodedIPFSUri: string;
  shouldUseReservedTokenBeneficiaryAsDefault: boolean;
}

export type JB721TierParams = {
  id?: BigNumber; //undefined for outgoing tier (in launch or adjustTiers tx)
  remainingQuantity?: BigNumber; //undefined for outgoing tier (in launch or adjustTiers tx)

  contributionFloor: BigNumber; //uint128
  lockedUntil: BigNumber;
  initialQuantity: BigNumber; //uint64
  votingUnits: number;
  reservedRate: number;
  reservedTokenBeneficiary: string;
  encodedIPFSUri: string; // encoded link to the rewardTier on IPFS
  allowManualMint: boolean;
  shouldUseBeneficiaryAsDefault: boolean;
  transfersPausable: boolean;
};

export interface DefifaLaunchProjectData {
  name: string;
  projectMetadata: JBProjectMetadata;
  contractUri: string;
  baseUri: string;
  tiers: DefifaTier[];
  token: string;
  mintDuration: number;
  refundPeriodDuration: number;
  start: number;
  end: number;
  splits: any;
  distributionLimit: number;
  ballkidzFeeProjectTokenAccount: string;
  votingPeriod: number;
  terminal: any;
  store: any;
}

interface JBProjectMetadata {
  content: string;
  domain: number; // 0
}

export type Chain = {
  id: number;
  name: string;
};
