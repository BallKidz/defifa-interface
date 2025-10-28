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

    // Process the data to create a simple table
    const playerData = (data.contracts as Contract[]).flatMap((contract: Contract) =>
        contract.mintedTokens.map((token: MintedToken) => ({
            player: `${token.owner.id.slice(0, 4)}...${token.owner.id.slice(-3)}`,
            mints: parseInt(token.id.split("-")[1]),
            picks: Math.floor(parseInt(token.id.split("-")[1]) / DEFAULT_NFT_MAX_SUPPLY),
            balance: token.owner.balance,
        }))
    );

    // Group by player and sum their data
    const playerStats = playerData.reduce((acc, item) => {
        if (!acc[item.player]) {
            acc[item.player] = {
                player: item.player,
                totalMints: 0,
                totalPicks: 0,
                balance: item.balance,
            };
        }
        acc[item.player].totalMints += item.mints;
        acc[item.player].totalPicks += item.picks;
        return acc;
    }, {} as Record<string, { player: string; totalMints: number; totalPicks: number; balance: string }>);

    const sortedPlayers = Object.values(playerStats).sort((a, b) => b.totalMints - a.totalMints);

    return (
        <div className="border-2 border-pink-700 rounded-lg">
            <div className="bg-pink-700 text-white text-md font-medium px-4 py-2 flex flex-col">
                <span className="order-1">Player Power</span>
                <span className="order-2">Rules</span>
            </div>
            <div className="min-height overflow-y-auto p-4">
                <p className="text-sm mb-4">{metadata?.description}</p>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Mints</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Picks</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sortedPlayers.map((player, index) => (
                                <tr key={player.player} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {player.player}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                        {player.totalMints}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                        {player.totalPicks}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                        {player.balance}
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