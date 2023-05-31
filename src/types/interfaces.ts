import { BigNumber } from "ethers";

export interface DefifaTierParams {
  name: string;
  price: any;
  reservedRate: number;
  reservedTokenBeneficiary: string;
  encodedIPFSUri: string;
  shouldUseReservedTokenBeneficiaryAsDefault: boolean;
}

export interface DefifaLaunchProjectData {
  name: string;
  rules: string;
  projectMetadata: JBProjectMetadata;
  contractUri: string;
  baseUri: string;
  tiers: DefifaTierParams[];
  token: string;
  mintDuration: number;
  refundDuration: number;
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

export type JBFundingCycleMetadataGlobal = {
  allowSetController: boolean;
  allowSetTerminals: boolean;
  pauseTransfers: boolean;
};

export type JBFundingCycleMetadata = {
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
};
