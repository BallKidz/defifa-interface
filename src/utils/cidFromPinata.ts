export const cidFromPinataUrl = (url: string) => url.split("/ipfs/").pop();
