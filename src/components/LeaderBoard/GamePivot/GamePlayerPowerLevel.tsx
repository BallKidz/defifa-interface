import { DEFAULT_NFT_MAX_SUPPLY } from "hooks/useDefifaTiers";
import { useGameTopHolders } from "../GameTopHolders/useGameTopHolders";
import Container from "components/layout/Container";
import { useGameContext } from "contexts/GameContext";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
interface Contract {
    gameId: string;
    name: string;
    mintedTokens: MintedToken[];
}

interface MintedToken {
    id: string;
    owner: {
        id: string;
        balance: string;
    };
}

interface ResponseData {
    contracts: Contract[];
}

export function GamePlayerPowerLevel() {
    const { gameId, metadata } = useGameContext();
    const { data, isLoading } = useGameTopHolders(gameId.toString()) as {
        data: ResponseData;
        isLoading: boolean;
    };

    if (isLoading) {
        return <Container className="text-center">Loading...</Container>;
    }

    // Filter contracts to only include the current game
    const currentGameContract = data.contracts.find((contract: Contract) => contract.gameId === gameId.toString());
    
    if (!currentGameContract) {
        return <Container className="text-center">No data found for this game.</Container>;
    }

    // Process the data to create a simple table - only for the current game
    const playerData = currentGameContract.mintedTokens.map((token: MintedToken) => ({
        player: `${token.owner.id.slice(0, 4)}...${token.owner.id.slice(-3)}`,
        playerAddress: token.owner.id,
        tokenNumber: parseInt(token.id.split("-")[1]),
        tierId: Math.floor(parseInt(token.id.split("-")[1]) / DEFAULT_NFT_MAX_SUPPLY),
    }));

    // Group by player and sum their data
    const playerStats = playerData.reduce((acc, item) => {
        if (!acc[item.playerAddress]) {
            acc[item.playerAddress] = {
                player: item.player,
                playerAddress: item.playerAddress,
                totalTokens: 0, // Total number of NFTs owned
                totalMints: 0, // Sum of all token numbers (for display purposes)
                gameBalance: 0, // Same as totalTokens - count of tokens in this specific game
            };
        }
        acc[item.playerAddress].totalTokens += 1; // Each token counts as +1
        acc[item.playerAddress].totalMints += item.tokenNumber; // Sum of token numbers
        acc[item.playerAddress].gameBalance += 1; // Count each token as +1 to balance
        return acc;
    }, {} as Record<string, { player: string; playerAddress: string; totalTokens: number; totalMints: number; gameBalance: number }>);

    const sortedPlayers = Object.values(playerStats).sort((a, b) => b.totalTokens - a.totalTokens);

    return (
        <div className="border-2 border-pink-700 rounded-lg">
            <div className="bg-pink-700 text-white text-md font-medium px-4 py-2 flex flex-col">
                <span className="order-1">Player Power</span>
                <span className="order-2">Rules</span>
            </div>
            <div className="min-height overflow-y-auto p-4">
                <p className="text-sm mb-4">{metadata?.description}</p>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-transparent border border-pink-300 rounded-lg">
                        <thead className="bg-pink-100/20">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-pink-200 uppercase tracking-wider">Player</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-pink-200 uppercase tracking-wider">Balance</th>
                            </tr>
                        </thead>
                        <tbody className="bg-transparent divide-y divide-pink-300/30">
                            {sortedPlayers.map((player, index) => (
                                <tr key={player.player} className={index % 2 === 0 ? 'bg-transparent' : 'bg-pink-50/10'}>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-white">
                                        {player.player}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-pink-100">
                                        {player.gameBalance}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <p className="text-lime-300 px-4 py-2 text-sm mt-4">
                    <Link href="/about" className="flex items-start">
                        <ExclamationCircleIcon className="h-8 w-8 inline mt-1 mr-4" />
                        This game is self-reported. You are relying on the honesty
                        of the other players to abide by the rules. The table above
                        depicts which players have the most power in the game.
                        Ask yourself, "Who is the most powerful player and should I trust them?".
                    </Link>
                </p>
            </div>
        </div>
    );
}