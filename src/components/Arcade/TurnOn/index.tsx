import { GameRow } from "components/Arcade/Game/Game";
import { AllGamesContext } from "hooks/gamesContext";
import { useAllGames } from "hooks/useAllGames";
import styles from "./TurnOn.module.css";

const AllGames = () => {
  const { isError, isLoading, data: games } = useAllGames();
  // TODO: Fix table headings, add more game stats

  if (!isError && !isLoading && (!games || games.length === 0)) {
    return <div>No games found.</div>;
  }

  return (
    <AllGamesContext.Provider value={games}>
      {isError && <div className={styles.error}>Failed to load games.</div>}
      {isLoading && <div className="text-center">Loading...</div>}
      {!isLoading && !isError && (
        <table className="mx-auto">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Phase</th>
              <th>Pool Size</th>
              <th>Actions</th>
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
    </AllGamesContext.Provider>
  );
};

export default AllGames;
