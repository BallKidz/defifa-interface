import { AllGamesContext } from "hooks/gamesContext";
import { useAllGames } from "hooks/useAllGames";
import Game from "components/Game/Game";
import Content from "components/UI/Content";
import styles from "./TurnOn.module.css";

const AllGames = () => {
  const { isError, isLoading, games, error } = useAllGames();
  let game
  // TODO: Fix types, add more game stats remove console.log
  if (!isLoading) {
    console.log("AllGames games ", games)    
  }
  
  return (
    <AllGamesContext.Provider value={games}>
      <Content title="Arcade" open={true} socials={false}>
        {isError && <div className={styles.error}>{error}</div>}
        {isLoading && <div className={styles.loading}>Loading...</div>}
         <div className={styles.teams}>
         <table className={styles.table}>
          <tbody>
         <tr>
            <th>Game ID</th>
            <th>Description</th>
          </tr>
         {games &&
           games
           .sort((a, b) => a[0] - b[0]) // Sort the games array by game.id
            .reverse() // Reverse the order of the games array
             .map((game) => (
               <Game
                 game={game}
                 key={game[0]}
               />
             ))}
          </tbody>
          </table>
         {games?.length === 0 && <div>No games found.</div>}
       </div>
      </Content>
    </AllGamesContext.Provider>
  );
};

export default AllGames;
