import { AllGamesContext } from "hooks/gamesContext";
import { useAllGames } from "hooks/useAllGames";
import Game from "components/Game/Game";
import Content from "components/UI/Content";
import styles from "./TurnOn.module.css";

const AllGames = () => {
  const { isError, isLoading, games, error } = useAllGames();
  // TODO: Fix table headings, add more game stats  
  return (
    <AllGamesContext.Provider value={games}>
      <Content title="Arcade" open={true} socials={false}>
        {isError && <div className={styles.error}>{error}</div>}
        {isLoading && <div className={styles.loading}>Loading...</div>}
         <div className={styles.teams}>
         {games &&
           games
           .sort((a, b) => a.gameId - b.gameId) // Sort the games array by game.id
            .reverse() // Reverse the order of the games array
             .map((game) => (
               <Game
                 game={game}
                 key={game.gameId}
               />
             ))}
         {games?.length === 0 && <div>No games found.</div>}
       </div>
      </Content>
    </AllGamesContext.Provider>
  );
};

export default AllGames;
