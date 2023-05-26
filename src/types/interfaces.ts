import { BigNumber } from "ethers";

export interface DefifaTierParams {
  name: string;
  price: any;
  reservedRate: number;
  reservedTokenBeneficiary: string;
  encodedIPFSUri: string;
  shouldUseReservedTokenBeneficiaryAsDefault: boolean;
}

export type JB721TierParams = {
  price: BigNumber; //uint128
  lockedUntil: BigNumber;
  initialQuantity: BigNumber; //uint64
  votingUnits: number;
  reservedRate: number;
  reservedTokenBeneficiary: string;
  encodedIPFSUri: string; // encoded link to the rewardTier on IPFS
  allowManualMint: boolean;
  shouldUseReservedTokenBeneficiaryAsDefault: boolean;
  transfersPausable: boolean;
  useVotingUnits: boolean;
  category: number;
};

export interface DefifaLaunchProjectData {
  name: string;
  rules: string;
  projectMetadata: JBProjectMetadata;
  contractUri: string;
  baseUri: string;
  tiers: DefifaTierParams[];
  token: string;
  mintDuration: number;
  refundPeriodDuration: number;
  start: number;
  splits: any[];
  distributionLimit: number;
  ballkidzFeeProjectTokenAccount: string;
  defaultTokenUriResolver: string;
  votingPeriod: number;
  votingStartTime: number;
  terminal: string; // address
  store: string; // address
}

interface JBProjectMetadata {
  content: string;
  domain: number; // 0
}

export type Chain = {
  id: number;
  name: string;
};
