// Use Juicebox's IPFS proxy API instead of direct Infura access
// This avoids needing to manage IPFS credentials
const JUICEBOX_IPFS_API = "https://api.juicebox.money/api/ipfs/file";

export type InfuraPinResponse = {
  Hash: string;
};

const pinFile = async (file: File | Blob | string): Promise<InfuraPinResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(JUICEBOX_IPFS_API, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  const data: InfuraPinResponse = await res.json();
  return data;
};

export async function uploadToIPFS(file: File) {
  if (!file) {
    console.error("No file selected");
    return;
  }

  try {
    const result = await pinFile(file);
    return result.Hash;
  } catch (error) {
    console.error("Error uploading file:", error);
  }
}

export async function uploadJsonToIpfs(jsonData: { [k: string]: unknown }) {
  try {
    // Convert JSON to Blob
    const jsonString = JSON.stringify(jsonData);
    const blob = new Blob([jsonString], { type: "application/json" });

    // Upload to IPFS via Juicebox API
    const result = await pinFile(blob);

    // Return the CID
    return result.Hash;
  } catch (error) {
    console.error("Error uploading JSON file to IPFS:", error);
  }
}
