export function truncateAddress(
  address: string,
  startLength = 6,
  endLength = 4
) {
  if (!address) return "";
  const truncatedAddress = `${address.substring(
    0,
    startLength + 2
  )}...${address.substring(address.length - endLength)}`;
  return truncatedAddress;
}
