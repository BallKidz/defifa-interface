/**
 * Return a HTTP URL to the IPFS gateway at the given [hostname] for the given [cid].
 */
const ipfsGatewayUrl = (cid: string | undefined = "", hostname: string) => {
  return `https://${hostname}/ipfs/${cid}`;
};

// get ipfs url when host is localhost or production
export const getIpfsUrl = (cidOrUri: string | undefined): string => {
  if (!cidOrUri) return "";
  
  // Strip ipfs:// prefix if present
  const cid = cidOrUri.startsWith("ipfs://") 
    ? cidOrUri.replace("ipfs://", "") 
    : cidOrUri;
  
  if (window.location.hostname === "localhost") {
    return ipfsGatewayUrl(cid, "ipfs.io");
  } else {
    return ipfsGatewayUrl(cid, "jbm.infura-ipfs.io");
  }
};

const IPFS_URL_REGEX = /ipfs:\/\/(.+)/;

export const cidFromIpfsUri = (ipfsUri: string) =>
  ipfsUri.match(IPFS_URL_REGEX)?.[1];
