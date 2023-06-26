import { useEffect, useState } from 'react';
import { getHubRpcClient } from '@farcaster/hub-web';
// import { FarcasterDittiHub } from "../../constants/constants";
import { FarcasterHub } from "../../constants/constants";
import { useSigner, useToken } from '@farsign/hooks';

const FarcasterAppName = "Defifa";

export function useFetchCastsUrl(url: string) {
  const [token] = useToken(FarcasterAppName);
  const [signer] = useSigner(FarcasterAppName, token);
  const [casts, setCasts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCasts = async () => {
      const client = getHubRpcClient(FarcasterHub);
      try {
        // "https://defifa.net/" 
        // "chain://eip155:1/erc721:0xa45662638e9f3bbb7a6fecb4b17853b7ba0f3a60" 
        // TODO use url after fixing the bug in creating casts
        console.log('fid signer ',client.getVerificationsByFid({ fid: signer.signerRequest.fid }));
        const castsResult = await client.getCastsByParent({ parentUrl: url });
        console.log('parentUrl ', url);
        console.log('are there casts? ', castsResult);
        setCasts(castsResult?.value.messages); // Update the casts state with the array of messages
      } catch (error) {
        console.error('Failed to fetch casts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCasts();
  }, []);

  return {
    casts,
    loading,
  };
}
