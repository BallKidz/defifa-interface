import { BigNumber } from "ethers";
import {
  JBGroupedSplits,
  JBProjectMetadataParams,
  JBSplitGroup,
} from "./juicebox";

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
  projectMetadata: JBProjectMetadataParams;
  contractUri: string;
  baseUri: string;
  tiers: DefifaTierParams[];
  token: string;
  mintPeriodDuration: number;
  refundPeriodDuration: number;
  start: number;
  splits: JBGroupedSplits<JBSplitGroup>[];
  ballkidzFeeProjectTokenAccount: EthereumAddress;
  ballkidzFeeProjectTokenAllocator: EthereumAddress;
  attestationStartTime: number;
  attestationGracePeriod: number; // seconds
  defaultAttestationDelegate: EthereumAddress;
  defaultTokenUriResolver: EthereumAddress;
  terminal: EthereumAddress;
  store: EthereumAddress;

  rules: string; // not used onchain
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
  start: number;
  mintPeriodDuration: number;
  refundPeriodDuration: number;
}

export interface DefifaTierRedemptionWeightParams {
  id: number; // tier ID
  redemptionWeight: BigNumber;
}

export interface DefifaTierRedemptionWeight {
  id: number; // id of the weight, computed in the subgraph
  tierId: number;
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
  price: BigNumber;
}
