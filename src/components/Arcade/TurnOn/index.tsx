import { GameRow } from "components/Arcade/GameRow";
import { useAllGames } from "hooks/useAllGames";
import styles from "./TurnOn.module.css";

const AllGames = () => {
  const { isError, isLoading, data: games } = useAllGames();
  // TODO: Fix table headings, add more game stats

  if (!isError && !isLoading && (!games || games.length === 0)) {
    return <div>No games found.</div>;
  }

  return (
    <>
      {isError && <div className={styles.error}>Failed to load games.</div>}
      {isLoading && <div className="text-center">Loading...</div>}
      {!isLoading && !isError && (
        <table className="mx-auto">
          <thead>
            <tr className="font-normal">
              <th className="font-normal text-sm py-3">ID</th>
              <th className="font-normal text-sm py-3">Name</th>
              <th className="font-normal text-sm py-3 hidden md:table-cell">
                Phase
              </th>
              <th className="font-normal text-sm py-3 hidden md:table-cell">
                Pool Size
              </th>
              <th className="font-normal text-sm py-3 hidden md:table-cell">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {games
              ?.sort((a, b) => a.gameId - b.gameId) // Sort the games array by game.id
              .reverse() // Reverse the order of the games array
              .map((game) => (
                <GameRow game={game} key={game.gameId} />
              ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default AllGames;
