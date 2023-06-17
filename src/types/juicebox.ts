import { BigNumber } from "ethers";

export interface JBProjectMetadataParams {
  content: string;
  domain: number;
}

export type JBSplit = {
  beneficiary: string | undefined; // address
  percent: BigNumber;
  preferClaimed: boolean | undefined;
  lockedUntil: number | undefined;
  projectId: string | undefined;
  allocator: string | undefined;
};

export type JBETHPayoutSplitGroup = 1;
export type JBReservedTokensSplitGroup = 2;
export type JBSplitGroup = JBETHPayoutSplitGroup | JBReservedTokensSplitGroup;

export interface JBGroupedSplits<G> {
  group: G;
  splits: JBSplit[];
}

export type JBETHPayoutGroupedSplits = JBGroupedSplits<JBETHPayoutSplitGroup>;
export type JBReservedTokensGroupedSplits =
  JBGroupedSplits<JBReservedTokensSplitGroup>;

interface JBFundingCycleMetadataGlobal {
  allowSetController: boolean;
  allowSetTerminals: boolean;
  pauseTransfers: boolean;
}

export interface JBFundingCycleMetadata {
  version?: number;
  global: JBFundingCycleMetadataGlobal;
  reservedRate: BigNumber;
  redemptionRate: BigNumber;
  ballotRedemptionRate: BigNumber;
  pausePay: boolean;
  pauseDistributions: boolean;
  pauseRedeem: boolean;
  pauseBurn: boolean;
  allowMinting: boolean;
  allowTerminalMigration: boolean;
  allowControllerMigration: boolean;
  holdFees: boolean;
  useTotalOverflowForRedemptions: boolean;
  useDataSourceForPay: boolean; // undefined for outgoing NFT args
  useDataSourceForRedeem: boolean;
  dataSource: string; // hex, contract address. undefined for outgoing NFT args
  preferClaimedTokenOverride?: boolean;
  metadata?: BigNumber;
}

export type JBFundingCycle = {
  duration: BigNumber;
  weight: BigNumber;
  discountRate: BigNumber;
  ballot: string; // hex, contract address
  number: BigNumber;
  configuration: BigNumber;
  basedOn: BigNumber;
  start: BigNumber;
  metadata: BigNumber; // encoded FundingCycleMetadata
};

export interface JB721TierParams {
  allowManualMint: boolean;
  category: number; // 1
  encodedIPFSUri: string; // encoded link to the rewardTier on IPFS
  initialQuantity: BigNumber; // uint64
  reservedRate: BigNumber;
  reservedTokenBeneficiary: string;
  transfersPausable: boolean;
  votingUnits: BigNumber;
  price: BigNumber;
}

// Tiers as they are stored onchain.
export type JB721Tier = JB721TierParams & {
  id: BigNumber;
  remainingQuantity?: BigNumber;
  resolvedUri?: string | null;
};
