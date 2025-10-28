export const etherscanLink = (
  type: "tx" | "address",
  hash: string,
  network: "sepolia" | "mainnet" = "sepolia"
) => {
  let subdomain = "";
  if (network !== "mainnet") {
    subdomain = network + ".";
  }

  return `https://${subdomain}etherscan.io/${type}/${hash}`;
};
