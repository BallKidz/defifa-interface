import { NextApiRequest, NextApiResponse } from "next";

const handleSignerRequest = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const { publicKey, name } = req.body;

    // Call the Warpcast API to create a signer request
    const response = await fetch(
      "https://api.warpcast.com/v2/signer-requests",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          publicKey,
          name,
        }),
      }
    );

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error creating signer request:", error);
    res.status(500).json({ error: "Failed to create signer request" });
  }
};

export default handleSignerRequest;
