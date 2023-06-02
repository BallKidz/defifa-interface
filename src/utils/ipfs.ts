/**
 * Return a HTTP URL to the IPFS gateway at the given [hostname] for the given [cid].
 */
const ipfsGatewayUrl = (cid: string | undefined = "", hostname: string) => {
  return `https://${hostname}/ipfs/${cid}`;
};

// get ipfs url when host is localhost or production
export const getIpfsUrl = (cid: string | undefined): string => {
  if (window.location.hostname === "localhost") {
    return ipfsGatewayUrl(cid, "ipfs.io");
  } else {
    return ipfsGatewayUrl(cid, "jbm.infura-ipfs.io");
  }
};

const IPFS_URL_REGEX = /ipfs:\/\/(.+)/;

export const cidFromIpfsUri = (ipfsUri: string) =>
  ipfsUri.match(IPFS_URL_REGEX)?.[1];
