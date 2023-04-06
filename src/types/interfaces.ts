export interface DefifaTier {
  name: string;
  price: number;
  reservedRate: number;
  reservedTokenBeneficiary: string;
  royaltyRate: number;
  royaltyBeneficiary: string;
  encodedIPFSUri: string;
  shouldUseReservedTokenBeneficiaryAsDefault: boolean;
}

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
