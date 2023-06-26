import { useEffect, useState } from 'react';
import { getHubRpcClient } from '@farcaster/hub-web';
import { FarcasterAppName, FarcasterHub } from "../../constants/constants";
import { useSigner, useToken } from '@farsign/hooks';

export function useFetchCastsUrl(url: string) {
  const [token] = useToken(FarcasterAppName);
  const [signer] = useSigner(FarcasterAppName, token);
  const [casts, setCasts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCasts = async () => {
      const client = getHubRpcClient(FarcasterHub);
      try {
        const castsResult = await client.getCastsByParent({ parentUrl: url });
        setCasts(castsResult?.value.messages);
      } catch (error) {
        console.error('Failed to fetch casts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCasts();
    const intervalId = setInterval(fetchCasts, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }, [url]);

  return {
    casts,
    loading,
  };
}