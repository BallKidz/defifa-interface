import { Bytes, dataSource, json, log } from "@graphprotocol/graph-ts";

import { TokenMetadata } from "../generated/schema";

export function handleMetadata(content: Bytes): void {
  const tokenId = dataSource
    .context()
    .getBigInt("tokenId")
    .toString();
  let tokenMetadata = new TokenMetadata(tokenId);
  const value = json.fromBytes(content).toObject();
  if (value) {
    const image = value.get("image");
    const name = value.get("name");
    const description = value.get("description");
    const identifier = value.get("identifier");
    const tags = value.get("tags");

    if (name && image && description && identifier && tags) {
      tokenMetadata.name = name.toString();
      tokenMetadata.image = image.toString();
      tokenMetadata.description = description.toString();
      tokenMetadata.identifier = identifier.toBigInt();
      tokenMetadata.tags = tags.toArray().map<string>((tag) => tag.toString());
    }

    tokenMetadata.token = tokenId;

    tokenMetadata.save();
  }
}
