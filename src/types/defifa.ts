import { BigNumber } from "ethers";
import {
  JBGroupedSplits,
  JBSplitGroup,
  JBProjectMetadataParams,
} from "./juicebox";
import { initial } from "lodash";

export interface DefifaTierParams {
  name: string;
  price: string;
  reservedRate: number;
  reservedTokenBeneficiary: string;
  encodedIPFSUri: string;
  shouldUseReservedTokenBeneficiaryAsDefault: boolean;
}

export interface DefifaLaunchProjectData {
  name: string;
  rules: string;
  projectMetadata: JBProjectMetadataParams;
  contractUri: string;
  baseUri: string;
  tiers: DefifaTierParams[];
  token: string;
  mintDuration: number;
  refundDuration: number;
  start: number;
  splits: JBGroupedSplits<JBSplitGroup>[];
  distributionLimit: number;
  ballkidzFeeProjectTokenAccount: string;
  defaultTokenUriResolver: string;
  votingPeriod: number; // seconds
  votingStartTime: number;
  terminal: string; // address
  store: string; // address
  defaultVotingDelegate: string;
}

export interface DefifaProjectMetadata {
  description: string;
  external_link: string;
  fee_recipient: string;
  image: string;
  name: string;
  seller_fee_basis_points: number;
}

export interface DefifaTimeData {
  mintDuration: number;
  refundDuration: number;
  start: number;
}

export interface DefifaTierRedemptionWeight {
  id: number;
  redemptionWeight: BigNumber;
}

export enum ProposalState {
  "Pending",
  "Active",
  "Canceled",
  "Defeated",
  "Succeeded",
  "Queued",
  "Expired",
  "Executed",
}

export interface DefifaTier {
  id: number;
  description: string;
  teamName: string;
  teamImage: string;
  maxSupply: number;
  remainingQuantity: number;
  initialQuantity: number;
  minted: number;
}
