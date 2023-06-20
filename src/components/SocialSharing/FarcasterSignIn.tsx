import { Token, Signer, useToken, useSigner } from "@farsign/hooks";

export function FarcasterSignIn() {
    const [token] = useToken("defifa");
    const [signer] = useSigner((token as Token).token);
    console.log("token", token);
    return (<>
        {((token as Token).token == "") ? "Waiting for token" :
            ((signer as Signer).isConnected != true) ?
                <a href={(token as Token).deepLink}>Sign In </a> :
                "Is connected"
        }
    </>);
}
