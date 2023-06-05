import { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { randomBytes } from "tweetnacl";
import { bytesToHexString, getHubRpcClient, Message } from "@farcaster/hub-web";
import tweetnacl from "tweetnacl";
import {getFnameFromFid, createCast} from "./Fname";
import { create, set } from "lodash";
import useLocalStorage from "hooks/useLocalStorage";


const ConnectWarpcast = () => {
  const [signerRequestToken, setSignerRequestToken] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [isSignerApproved, setIsSignerApproved] = useState(false);
  const [base64SignedMessage, setBase64SignedMessage] = useLocalStorage("base64SignedMessage","");
  const [fnameStored, setFnameStored] = useLocalStorage("fnameStored","");
  const [fidStored, setFidStored] = useLocalStorage("fidStored","");
  const [fids, setFids] = useState([""]);
  const [fname, setFname] = useState("");
  
  const generateKeyPair = () => {
    const privateKey = randomBytes(32);
    const publicKey = tweetnacl.sign.keyPair.fromSeed(privateKey).publicKey;
    return { publicKey, privateKey };
  };

  const handleConnectClick = async () => {
    try {
      const keyPair = generateKeyPair();
      const publicKeyString = bytesToHexString(
        keyPair.publicKey
      )._unsafeUnwrap();
      setPublicKey(publicKeyString);

      // Call the signer request API to initiate the flow
      const response = await fetch("/api/signer-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          publicKey: publicKeyString,
          name: "Defifa",
        }),
      });
      const data = await response.json();
      console.log("Response Data:", data);
      setSignerRequestToken(data.result.token);
    } catch (error) {
      console.error("Error connecting with Warpcast:", error);
    }
  };

  useEffect(() => {
    const pollForSigner = async (token: string) => {
      while (true) {
        // Poll at a reasonable rate to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 5000));

        const response = await fetch(
          `https://api.warpcast.com/v2/signer-request?token=${token}`
        );
        const data = await response.json();
        console.log("Polling response:", data);

        if (data.result && data.result.signerRequest.base64SignedMessage) {
          console.log(
            "Signer is approved with fid:",
            data.result.signerRequest.fid
          );
          setIsSignerApproved(true);
          setBase64SignedMessage("base64SignedMessage",data.result.signerRequest.base64SignedMessage);
          setFids([data.result.signerRequest.fid]);
          // To set the value in localStorage
          setFnameStored('fnameStored',data.result.signerRequest.fid);
          setBase64SignedMessage("base64SignedMessage",data.result.signerRequest.base64SignedMessage);  
          break;
        }
      }
    };

    if (signerRequestToken) {
      pollForSigner(signerRequestToken);
    }
  }, [signerRequestToken]);

  const handleSubmitMessage = async () => {
    try {
      const client = getHubRpcClient("https://galaxy.ditti.xyz:2285");

      const message = Message.decode(
        Buffer.from(base64SignedMessage, "base64")
      );
      client.submitMessage(message);
      console.log("Message submitted to Hub:", message);
      const res = await getFnameFromFid(fidStored, client);
      const myFname = res.value;
      console.log('result getFnameFromFid', myFname);

      //const myFname = await getFnameFromFid(fidStored,client).then((res) => console.log('resulg getFnameFromFid ',res.value));
      //setFname(myFname);
      console.log("Fname after setting:", myFname);
      setFnameStored("fnameStored",myFname);

    } catch (error) {
      console.error("Error submitting message to Hub:", error);
    }
  };

  const handleCreateCast = async () => {
    const client = getHubRpcClient("https://galaxy.ditti.xyz:2285");

    console.log("Creating cast...");
    try {
      const response = await createCast(client);
      console.log("Response from createCast:", response);
    } catch (error) {
      console.error("Error creating cast:", error);
    }
  };

  return (
    <div>
      
      {!publicKey && !base64SignedMessage && !fnameStored && <button onClick={handleConnectClick}>Connect with Farcaster</button>}
      {signerRequestToken && !fnameStored && (
        <>
          <QRCode
            value={`farcaster://signer-add?token=${signerRequestToken}`}
            size={75} 
          />
        </>
      )}
      {isSignerApproved && base64SignedMessage && !fnameStored && (
        <div>
          <p>Signer is approved!</p>
          <button onClick={handleSubmitMessage}>Use Farcaster Name</button>
        </div>
      )}
      {fnameStored !== undefined && base64SignedMessage && (
        <div>
          <p>{fnameStored}</p>
        </div>
      )}
      <button onClick={handleCreateCast}>Cast This Game</button>

    </div>
  );
};

export default ConnectWarpcast;
