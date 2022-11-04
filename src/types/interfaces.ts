import { BigNumber } from "@ethersproject/bignumber";

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

export type Chain = {
  id: number;
  name: string;
};
