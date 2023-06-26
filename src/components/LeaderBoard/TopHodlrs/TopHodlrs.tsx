import { EthAddress } from "components/UI/EthAddress";
import Container from "components/layout/Container";
import { constants } from "ethers";
import { DEFAULT_NFT_MAX_SUPPLY } from "hooks/useDefifaTiers";
import moment from "moment";
import Image from "next/image";
import { useTopHodlrs } from "./useTopHodlrs";
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
};

function HodlrsLeaderBoard({
  LeaderBoardMetric,
}: {
  LeaderBoardMetric: LeaderBoardMetric;
}) {
  return (
    <tr>
      <td>{LeaderBoardMetric.rowNumber}</td>
      <td>
        <div className="flex items-center gap-3">
          <EthAddress
            address={LeaderBoardMetric.id}
            className="font-medium"
            withEnsAvatar
          />
        </div>
      </td>
      <td>
        <div className="flex justify-center items-center gap-3">
          {" "}
          {/* Center the content */}
          {LeaderBoardMetric.ownedTokens.length}
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
  return <HodlrsLeaderBoard LeaderBoardMetric={LeaderBoardMetric} />;
}

export function TopHoldrsContent() {
  const { data: owners, isLoading } = useTopHodlrs();
  const leaders = (owners as { owners?: any })?.owners;

  if (isLoading) {
    return <Container className="text-center">...</Container>;
  }

  if (!leaders) {
    return <Container className="text-center">No leaders yet.</Container>;
  }

  const reformattedArray: ActivityEvent[] = leaders.map(
    (obj: LeaderBoardMetric, index: number) => {
      const leaderId = obj.id;
      const gamesPlayed = obj.ownedTokens.length;
      const uniqueGameIds = [
        ...new Set(obj.ownedTokens.map((token) => token.gameId)),
      ].length;

      const activityEvent = {
        ...obj,
        gamesPlayed,
        id: leaderId,
        uniqueGameIds,
        rowNumber: index + 1,
      };

      return activityEvent as ActivityEvent;
    }
  );
  const top10Array = reformattedArray
    .sort((a, b) => b.ownedTokens.length - a.ownedTokens.length)
    .slice(0, 10) // Limit to the top 10 rows
    .filter(
      (item) =>
        item.ownedTokens.length > 0 &&
        item.id !== "0x0000000000000000000000000000000000000000"
    ); // Filter out rows where games played is 0

  return (
    <div className="p-4">
      <div className="relative border border-neutral-800 rounded-xl max-w-[500px] mx-auto overflow-hidden hover:-translate-y-[1px] transition-transform">
        <div className="border-2 border-pink-500 rounded-lg shadow-md p-6">
          <h2 className="text-2xl mb-4 text-center">Top Hodlrs</h2>
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>{""}</th>
                <th>Prize Claims</th>
              </tr>
            </thead>
            <tbody>
              {top10Array.map((LeaderBoardMetric, index) => (
                <HodlrsLeaderBoard
                  key={LeaderBoardMetric.id}
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
