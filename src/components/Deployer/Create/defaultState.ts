import { getChainData } from "config";
import { ETH_TOKEN_ADDRESS } from "constants/addresses";
import { MINT_PRICE } from "constants/constants";
import { constants } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { DefifaLaunchProjectData } from "types/interfaces";

const DEFAULT_MINT_DURATION_SECONDS = 60 * 60; // 1 hour
const DEFAULT_REFUND_DURATION_SECONDS = 60 * 60; // 1 hour
const GAME_START_BUFFER_SECONDS = 60 * 1; // 1 minute

export const createDefaultLaunchProjectData = (): DefifaLaunchProjectData => {
  const chainData = getChainData();
  const currentUnixTimestamp = Math.floor(Date.now() / 1000);

  return {
    name: "Your game name",
    rules: "Your game rules",
    mintDuration: DEFAULT_MINT_DURATION_SECONDS,
    refundDuration: DEFAULT_REFUND_DURATION_SECONDS,
    start:
      currentUnixTimestamp +
      DEFAULT_MINT_DURATION_SECONDS +
      DEFAULT_REFUND_DURATION_SECONDS +
      GAME_START_BUFFER_SECONDS,
    votingPeriod: 0, // seconds
    votingStartTime: 0,
    tiers: [],
    splits: [],
    token: ETH_TOKEN_ADDRESS,
    ballkidzFeeProjectTokenAccount:
      "0x11834239698c7336EF232C00a2A9926d3375DF9D",
    defaultVotingDelegate: "0x11834239698c7336EF232C00a2A9926d3375DF9D",
    defaultTokenUriResolver: constants.AddressZero,
    contractUri: "",
    baseUri: "ipfs://",
    distributionLimit: 0,
    projectMetadata: {
      content: "",
      domain: 0,
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
