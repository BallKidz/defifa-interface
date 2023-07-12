import { useEffect, useState } from 'react';
import { getHubRpcClient, HubRpcClient, Message } from '@farcaster/hub-web';
//import { FarcasterHub } from '../constants/constants';
export function useFetchCastsUrl(url: string, FarcasterHub: string) {
  const [casts, setCasts] = useState<Message[]>([]); // Provide a type annotation for casts
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCasts = async () => {
      const client: HubRpcClient = getHubRpcClient(FarcasterHub);

      try {
        const castsResult = await client.getCastsByParent({ parentUrl: url });
        
        if (castsResult.isOk()) {
          setCasts(castsResult.value.messages);
          console.log('parentUrl:', url);
          console.log('Casts in hook:', castsResult);
        } else {
          console.error('Failed to fetch casts:', castsResult.isErr());
        }
      } catch (error) {
        console.error('Failed to fetch casts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCasts();
    const intervalId = setInterval(fetchCasts, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [url]);

  return {
    casts,
    loading,
  };
}
