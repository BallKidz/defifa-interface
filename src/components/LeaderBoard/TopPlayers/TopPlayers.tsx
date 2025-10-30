import { EthAddress } from "components/UI/EthAddress";
import Container from "components/layout/Container";
import { constants } from "ethers";
import { DEFAULT_NFT_MAX_SUPPLY } from "hooks/useDefifaTiers";
import moment from "moment";
import Image from "next/image";
import { useTopPlayers } from "./useTopPlayers";
import { twMerge } from "tailwind-merge";

interface LeaderBoardMetric {
  uniqueGameIds: number;
  id: string;
  ownedTokens: [
    {
      gameId: string;
    }
  ];
  rowNumber: number;
  index: number;
}

type ActivityEvent = LeaderBoardMetric & {
  id: string;
  ownedTokens: [
    {
      gameId: string;
    }
  ];
  uniqueGameIds: number;
  gamesPlayed: number;
  rowNumber: number;
  count: number;
};

function MintsLeaderBoard({
  LeaderBoardMetric,
  index = 0,
}: {
  LeaderBoardMetric: LeaderBoardMetric;
  index?: number;
}) {
  return (
    <tr className={`border-b border-pink-300/30 ${index % 2 === 0 ? 'bg-transparent' : 'bg-pink-50/10'}`}>
      <td className="px-4 py-2 text-sm font-medium text-white">{LeaderBoardMetric.rowNumber}</td>
      <td className="px-4 py-2">
        <div className="flex items-center gap-3">
          <EthAddress
            address={LeaderBoardMetric.id}
            className="font-medium text-pink-100"
            withEnsAvatar
          />
        </div>
      </td>
      <td className="px-4 py-2 text-center">
        <div className="flex justify-center items-center gap-3">
          <span className="text-pink-100 text-sm">{LeaderBoardMetric.uniqueGameIds}</span>
        </div>
      </td>
    </tr>
  );
}

function ActivityItem({
  LeaderBoardMetric,
}: {
  LeaderBoardMetric: LeaderBoardMetric;
}) {
  return <MintsLeaderBoard LeaderBoardMetric={LeaderBoardMetric} />;
}

export function TopPlayersContent() {
  const { data: owners, isLoading } = useTopPlayers();
  const leaders = (owners as { owners?: any })?.owners;

  if (isLoading) {
    return <Container className="text-center">...</Container>;
  }

  if (!leaders) {
    return <Container className="text-center">No leaders yet.</Container>;
  }

  const reformattedArray: ActivityEvent[] = leaders.map(
    (obj: LeaderBoardMetric, index: number) => {
      const gamesPlayed = obj.ownedTokens.length;
      const uniqueGameIds = [
        ...new Set(obj.ownedTokens.map((token) => token.gameId)),
      ].length;

      const activityEvent = {
        ...obj,
        count: gamesPlayed,
        uniqueGameIds,
        rowNumber: index + 1,
      };

      return activityEvent as ActivityEvent;
    }
  );

  const top10Array = reformattedArray
    .sort((a, b) => b.count - a.count)
    .slice(0, 10) // Limit to the top 10 rows
    .filter(
      (item) =>
        item.count > 0 &&
        item.id !== "0x0000000000000000000000000000000000000000"
    );

  return (
    <div className="border-2 border-pink-700 rounded-lg">
      <div className="bg-pink-700 text-white text-md font-medium px-4 py-2 flex flex-col">
        <span className="order-1">Leaderboard Top Players</span>
      </div>
      <div className="min-height overflow-y-auto p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-transparent border border-pink-300 rounded-lg">
            <thead className="bg-pink-100/20">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-pink-200 uppercase tracking-wider">Rank</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-pink-200 uppercase tracking-wider">Player</th>
                <th className="px-4 py-2 text-center text-xs font-medium text-pink-200 uppercase tracking-wider">Games Played</th>
              </tr>
            </thead>
            <tbody className="bg-transparent divide-y divide-pink-300/30">
              {top10Array.map((LeaderBoardMetric, index) => (
                <MintsLeaderBoard
                  key={LeaderBoardMetric.id}
                  index={index}
                  LeaderBoardMetric={{
                    ...LeaderBoardMetric,
                    rowNumber: index + 1,
                  }}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
