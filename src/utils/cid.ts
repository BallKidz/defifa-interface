const IPFS_URL_REGEX = /ipfs:\/\/(.+)/;

export const cidFromPinataUrl = (url: string) => url.split("/ipfs/").pop();

export const cidFromIpfsUri = (ipfsUri: string) =>
  ipfsUri.match(IPFS_URL_REGEX)?.[1];
