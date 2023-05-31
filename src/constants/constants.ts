import { ethers } from "ethers";

export const MINT_PRICE = ethers.utils.parseEther("0.01");
export const NEW_GAME_DASHBOARD =
  process.env.NEXT_PUBLIC_NEW_GAME_DASHBOARD === "true";
