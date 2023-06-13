export const etherscanLink = (
  type: "tx" | "address",
  hash: string,
  network: "goerli" | "mainnet" = "goerli"
) => {
  let subdomain = "";
  if (network !== "mainnet") {
    subdomain = network + ".";
  }

  return `https://${subdomain}etherscan.io/${type}/${hash}`;
};
