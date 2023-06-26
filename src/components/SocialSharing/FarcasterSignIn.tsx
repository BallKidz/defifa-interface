import { useCheckSigner, useToken, useSigner, useEncryptedSigner } from "@farsign/hooks";
import Link from "next/link";
import { makeCastAdd, getHubRpcClient, NobleEd25519Signer, Message, FarcasterNetwork } from '@farcaster/hub-web';
import { Dispatch, SetStateAction } from "react";
import SocialMediaFeed from "./CastStreamWidget";
import { useGameContext } from "contexts/GameContext";
import QRCode from "react-qr-code";
import { useEffect } from 'react';


const FarcasterAppName = "Defifa";

export function FarcasterSignIn() {
    const [isConnected, setIsConnected] = useCheckSigner(FarcasterAppName);
    const [token] = useToken(FarcasterAppName);
    const [signer] = useSigner(FarcasterAppName, token);

    console.log("FC Deeplink", token);
    console.log("isConnected", isConnected);

    useEffect(() => {
        if (signer.isConnected === true) {
            setIsConnected(true); // if Typescript is naughty with you, you can write this: (setIsConnected as Dispatch<SetStateAction<boolean>>)(true);
        }
    }, [signer])


    return (
        <>
            {(isConnected === false) ?
                <>
                    <QRCode value={token.deepLink} />
                    <p>Sign-in with Farcaster</p>
                </>
                : (
                    <>
                        <div className="flex gap-6 items-center">
                            {/* <SocialMediaFeed channel={currentFundingCycle?.metadata.dataSource} /> 
                            // TODO add prop encryptedSigner to SocialMediaFeed or just grab it
                            */}

                            <SocialMediaFeed channel={""} />

                        </div>

                    </>
                )
            }
        </>
    );
}
