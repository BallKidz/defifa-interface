import { Token, Signer, useToken, useSigner, useCheckSigner } from "@farsign/hooks";
import Link from "next/link";
import { getHubRpcClient, Message } from '@farcaster/hub-web';

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
                client.submitMessage(message);
                console.log("connect sent to hub");
            }
            catch (error) {
                console.error('Failed to fetch casts:', error);
            }
        }
        console.log("base64SignedMessage", base64SignedMessage);
    }

    return (<>
        {(isConnected === false) ? ((token as Token).token == "") ? <div className="flex gap-6 items-center">
            "Waiting for token"</div> :
            ((signer as Signer).isConnected != true) ?
                <a href={(token as Token).deepLink} className="h-4 w-4 inline flex items-center gap-2 text-neutral-300 text-sm" >Sign In </a> :
                "Is connected" : <div className="flex gap-6 items-center"> <button className="h-4 w-4 inline flex items-center gap-2 text-neutral-300 text-sm" onClick={handleClick}> Send Test Cast  </button></div>}
    </>);
}


