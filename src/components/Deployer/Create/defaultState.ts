import { getChainData } from "config";
import { ETH_TOKEN_ADDRESS } from "constants/addresses";
import {
  BALLKIDZ_MULTISIG_ADDRESS,
  MINT_PRICE,
} from "constants/constants";
import { constants } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { DefifaLaunchProjectData } from "types/defifa";

const DEFAULT_MINT_DURATION_SECONDS = 60 * 2; // 2 minutes
const DEFAULT_REFUND_DURATION_SECONDS = 60 * 0; // 0 hour
const GAME_START_BUFFER_SECONDS = 60 * 1; // 1 minute (total: 3 minutes from now)

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
    mintPeriodDuration: DEFAULT_MINT_DURATION_SECONDS,
    refundPeriodDuration: DEFAULT_REFUND_DURATION_SECONDS,
    start: scoringStartTime,
    attestationGracePeriod: 0, // No grace period - fast attestation is part of the game
    attestationStartTime: scoringStartTime, // Start attestation when scoring phase begins
    tiers: [],
    splits: [],
    token: {
      token: ETH_TOKEN_ADDRESS,
      decimals: 18,
      currency: 1, // ETH
    },
    defaultAttestationDelegate: BALLKIDZ_MULTISIG_ADDRESS,
    // Use the deployed DefifaTokenUriResolver instead of AddressZero
    defaultTokenUriResolver: chainData.DefifaTokenUriResolver.address as any,
    contractUri: "",
    baseUri: "ipfs://",
    projectUri: "",
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
