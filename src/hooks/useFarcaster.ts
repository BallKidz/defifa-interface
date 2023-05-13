import { useEffect, useState } from "react";
import { generateKeyPair, toHexString } from "../utils";
import axios from "axios";
import { FarcasterSignerRequest } from "../types/interfaces";

const pollForSigner = async (token: any): Promise<FarcasterSignerRequest> => {
  while (true) {
    // Make sure to poll at a reasonable rate to avoid rate limiting
    // Sleep for 2 seconds
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const signerRequest = await axios
      .get(`https://api.warpcast.com/v2/signer-request`, {
        params: {
          token,
        },
      })
      .then((response) => response.data.result.signerRequest);

    if (signerRequest.base64SignedMessage) {
      console.log("Signer is approved with fid:", signerRequest.fid);
      return signerRequest;
    }
  }
};

export const useFarcaster = () => {
  const [deepLinkUrl, setDeepLinkUrl] = useState("");
  const [fcr, setFcr] = useState<FarcasterSignerRequest | undefined>(undefined);

  useEffect(() => {
    const qrme = async () => {
      try {
        const name = "test";
        const { publicKey, privateKey } = await generateKeyPair();
        const publicKeyHex = toHexString(publicKey);
        const response = await axios.post(
          `https://api.warpcast.com/v2/signer-requests`,
          {
            publicKey: `0x${publicKeyHex}`,
            name,
          }
        );
        const { token, deepLinkUrl } = response.data.result;
        console.log("Token:", token);
        console.log("Deep Link URL:", deepLinkUrl);
        setDeepLinkUrl(response.data.result.deepLinkUrl);

        const fcr = await pollForSigner(token); // Wait for the response from the pollForSigner function
        setFcr(fcr);
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    qrme();
  }, []);

  return { deepLinkUrl, fcr };
};
