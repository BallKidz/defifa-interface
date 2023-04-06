import { create } from "ipfs-http-client";

const projectId = "2NdpbtprhXeb7h0SvsLPnX19Z00";
const projectSecret = "3477ef4dc95aeb5da2903d62e535d05c";
const authorization = "Basic " + btoa(projectId + ":" + projectSecret);

const ipfs = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: authorization,
  },
});

export async function uploadToIPFS(file: File) {
  if (!file) {
    console.error("No file selected");
    return;
  }

  try {
    const { path } = await ipfs.add(file);
    return path;
  } catch (error) {
    console.error("Error uploading file:", error);
  }
}

export async function uploadJsonToIpfs(jsonData: any) {
  try {
    // Convert the JSON data to a Buffer
    const buffer = Buffer.from(JSON.stringify(jsonData));

    // Add the JSON file to IPFS
    const result = await ipfs.add(buffer);

    // Get the CID of the uploaded JSON file
    const cid = result.path;

    return cid;
  } catch (error) {
    console.error("Error uploading JSON file to IPFS:", error);
  }
}
