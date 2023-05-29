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
