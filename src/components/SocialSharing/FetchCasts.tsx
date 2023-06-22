import React, { useEffect, useState } from 'react';
import { getHubRpcClient } from '@farcaster/hub-web';

export function FetchCasts() {
    const [casts, setCasts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCasts = async () => {
            const client = getHubRpcClient('https://testnet1.farcaster.xyz:2285');

            try {
                const castsResult = await client.getCastsByFid({ fid: 1463 });
                //setCasts(castsResult);
            } catch (error) {
                console.error('Failed to fetch casts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCasts();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }
    console.log("casts", casts);
    return (
        <div>
            <h1>Success Fetched Casts - UI TDB</h1>
            {/* 
            {casts.map((casts) =>
                casts.messages.map((cast) => (
                    <div key={cast.id}>{JSON.stringify(cast.data?.castAddBody?.text)}</div>
                ))
            )} */}
        </div>
    );
}
