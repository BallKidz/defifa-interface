import { BigNumber, ethers } from "ethers";

export const MINT_PRICE = ethers.utils.parseEther("0.01");
export const TOTAL_REDEMPTION_WEIGHT =
  BigNumber.from(1_000_000_000_000_000).mul(1_000); // 1_000_000_000_000_000_000. Mul, to avoid overflow error
export const BALLKIDZ_MULTISIG_ADDRESS =
  // "0x11834239698c7336EF232C00a2A9926d3375DF9D";
  "0x59733c7Cd78d08dAb90368aD2cc09c8c81f097C0"; // defifa dev kmac
export const IDefifa_DAO_PROTOCOL_FEE = 0.1;
export const FarcasterAppName = "defifa"; // used by farsing to identify the app. Change this to your app name
export const DefaultChannel = "https://defifa.net"; // no trailing slash, all lowercase
// export const DefaultChannel = "chain://eip155:1/erc721:0xa45662638e9f3bbb7a6fecb4b17853b7ba0f3a60";
export const FarcasterHub = "https://galaxy.ditti.xyz:2285";