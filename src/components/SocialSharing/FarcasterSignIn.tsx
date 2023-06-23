import { Token, Signer, useToken, useSigner, useCheckSigner } from "@farsign/hooks";
import Link from "next/link";
import { makeCastAdd, getHubRpcClient, HashScheme, Message, MessageData, SignatureScheme } from '@farcaster/hub-web';

interface CastMessage {
    data: MessageData | undefined;
    hash: Uint8Array;
    hashScheme: HashScheme;
    signature: Uint8Array;
    signatureScheme: SignatureScheme;
    // Add other properties as needed
}

signer: Uint8Array;
export function FarcasterSignIn() {
    const [isConnected] = useCheckSigner("defifa");
    const [token] = useToken("defifa");
    const [signer] = useSigner((token as Token).token, 'defifa');
    console.log("token", token);
    console.log("isConnected", isConnected);

    function handleClick() {
        console.log("handleClick");
        const base64SignedMessage = localStorage.getItem("farsign-base64SignedMessagedefifa");
        const client = getHubRpcClient('https://testnet1.farcaster.xyz:2285');

        if (isConnected === true) {
            try {
                const message = Message.decode(Buffer.from(base64SignedMessage!, 'base64'));
                const castMessage: { data?: CastMessage | undefined } = {
                    data: {
                        data: message.data,
                        hash: message.hash,
                        hashScheme: message.hashScheme,
                        signature: message.signature,
                        signatureScheme: message.signatureScheme,
                        // Add other properties from the 'message' object
                    },
                };
                //client.submitMessage(castMessage);
                console.log("connect sent to hub");
            } catch (error) {
                console.error('Failed to fetch casts:', error);
            }
        }

        console.log("base64SignedMessage", base64SignedMessage);
    }

    return (
        <>
            {(isConnected === false) ? (
                ((token as Token).token === "") ? (
                    <div className="flex gap-6 items-center">
                        Waiting for token
                    </div>
                ) : (
                    ((signer as Signer).isConnected !== true) ? (
                        <a href={(token as Token).deepLink} className="h-4 w-4 inline flex items-center gap-2 text-neutral-300 text-sm">
                            Sign In
                        </a>
                    ) : (
                        <div className="flex gap-6 items-center">
                            <button className="h-4 w-4 inline flex items-center gap-2 text-neutral-300 text-sm" onClick={handleClick}>
                                Send Test Cast
                            </button>
                        </div>
                    )
                )
            ) : (
                <div className="flex gap-6 items-center">
                    Is connected
                </div>
            )}
        </>
    );
}
