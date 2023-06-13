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

export type EthereumAddress = `0x${string}`;

export interface DefifaLaunchProjectData {
  name: string;
  rules: string; // not used onchain
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
  ballkidzFeeProjectTokenAccount: EthereumAddress;
  votingPeriod: number; // seconds
  votingStartTime: number;
  defaultVotingDelegate: EthereumAddress;
  store: EthereumAddress;
  defaultTokenUriResolver: EthereumAddress;
  terminal: EthereumAddress;
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

export enum DefifaScorecardState {
  PENDING,
  ACTIVE,
  DEFEATED,
  SUCCEEDED,
  RATIFIED,
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
