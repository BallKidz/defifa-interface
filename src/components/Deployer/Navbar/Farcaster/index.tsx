import styles from "./Farcaster.module.css";
import React, { useState, useEffect } from "react";
//import styles from "./DeployerInfo.module.css";
import * as ed from '@noble/ed25519';
import axios from "axios";
import QRCode from "react-qr-code";
import Button from "../../../UI/Button";

const generateKeyPair = async () => {
  const privateKey = ed.utils.randomPrivateKey();
  const publicKey = await ed.getPublicKeyAsync(privateKey);
  return { publicKey, privateKey };
};

const toHexString = (byteArray: Iterable<unknown> | ArrayLike<unknown>) => {
  return Array.from(byteArray, (byte) => {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('');
};

const pollForSigner = async (token: any) => {
  while (true) {
    // Make sure to poll at a reasonable rate to avoid rate limiting
    // Sleep for 2 seconds
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const signerRequest = await axios.get(`https://api.warpcast.com/v2/signer-request`, {
      params: {
        token
      }
    }).then((response) => response.data.result.signerRequest);

    if (signerRequest.base64SignedMessage) {
      console.log("Signer is approved with fid:", signerRequest.fid);
      break;
    }
  }
};

const Farcaster = () => {
  const [deepLinkUrl, setDeepLinkUrl] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoggedInAs, setLoggedInAs] = useState('');
  useEffect(() => {
    const qrme = async () => {
      try {
        const name = 'test';
        const { publicKey, privateKey } = await generateKeyPair();
        const publicKeyHex = toHexString(publicKey);
        const response = await axios.post(
          `https://api.warpcast.com/v2/signer-requests`,
          {
            publicKey: `0x${publicKeyHex}`,
            name
          }
        );
        const { token, deepLinkUrl } = response.data.result;
        console.log('Token:', token);
        console.log('Deep Link URL:', deepLinkUrl);
        setDeepLinkUrl(response.data.result.deepLinkUrl);

        await pollForSigner(token); // Wait for the response from the pollForSigner function

      } catch (error) {
        console.error('An error occurred:', error);
      }
    };

    qrme();
  }, []);

  function handleLogin(deepLinkUrl: { deepLinkUrl: any; }) {
    window.open(deepLinkUrl, "_blank");
    console.log("Login", deepLinkUrl);
  }
  
  const handleClick = () => {
    setIsFlipped((prevState) => !prevState);
  };

  return (
    <div className={styles.container}>
      {deepLinkUrl && (
        <>  
        <Button size="medium" onClick={() => handleLogin?.({deepLinkUrl})}>
          Login with Farcaster
        </Button>
                <DeepLinkQRCode deepLinkUrl={deepLinkUrl} />  
        </>
      )}
    </div>
  );
};

const DeepLinkQRCode = ({ deepLinkUrl }) => {
  return <QRCode value={deepLinkUrl} size={100} />;
};

export default Farcaster;

