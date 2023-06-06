import { getChainData } from "config";
import { ETH_TOKEN_ADDRESS } from "constants/addresses";
import {
  BALLKIDZ_MULTISIG_ADDRESS,
  JUICEBOX_PROJECT_METADATA_DOMAIN,
  MINT_PRICE,
} from "constants/constants";
import { constants } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { DefifaLaunchProjectData } from "types/defifa";

const DEFAULT_MINT_DURATION_SECONDS = 60 * 60; // 1 hour
const DEFAULT_REFUND_DURATION_SECONDS = 60 * 60; // 1 hour
const GAME_START_BUFFER_SECONDS = 60 * 1; // 1 minute

export const createDefaultLaunchProjectData = (): DefifaLaunchProjectData => {
  const chainData = getChainData();
  const currentUnixTimestamp = Math.floor(Date.now() / 1000);

  const scoringStartTime =
    currentUnixTimestamp +
    DEFAULT_MINT_DURATION_SECONDS +
    DEFAULT_REFUND_DURATION_SECONDS +
    GAME_START_BUFFER_SECONDS;

  return {
    name: "",
    rules: "",
    mintDuration: DEFAULT_MINT_DURATION_SECONDS,
    refundDuration: DEFAULT_REFUND_DURATION_SECONDS,
    start: scoringStartTime,
    votingPeriod: 0, // seconds, 0 to allow ratify as soon as quorum is reached.
    votingStartTime: 0,
    tiers: [],
    splits: [],
    token: ETH_TOKEN_ADDRESS,
    ballkidzFeeProjectTokenAccount: BALLKIDZ_MULTISIG_ADDRESS,
    defaultVotingDelegate: BALLKIDZ_MULTISIG_ADDRESS,
    defaultTokenUriResolver: constants.AddressZero,
    contractUri: "",
    baseUri: "ipfs://",
    distributionLimit: 0,
    projectMetadata: {
      content: "",
      domain: JUICEBOX_PROJECT_METADATA_DOMAIN,
    },
    terminal: chainData.JBETHPaymentTerminal.address,
    store: chainData.JBTiered721DelegateStore.address,
  };
};

export const createDefaultTierData = () => {
  return {
    name: "",
    price: formatUnits(MINT_PRICE),
    reservedRate: 0,
    reservedTokenBeneficiary: constants.AddressZero,
    encodedIPFSUri:
      "0x0000000000000000000000000000000000000000000000000000000000000000",
    shouldUseReservedTokenBeneficiaryAsDefault: false,
  };
};
