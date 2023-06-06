import React from 'react';
import useMLBSchedule  from '../../../hooks/read/useMLBSchedule';
import Link from "next/link";
import { useCreateGame } from "hooks/write/useCreateGame";
import { useEffect, useState } from "react";
import { DefifaLaunchProjectData, DefifaTierParams } from "types/defifa";
import { contractUri, projectMetadataUri } from "uri/contractUri";
import {
  createDefaultLaunchProjectData,
  createDefaultTierData,
} from "../Create/defaultState";
import Button from 'components/UI/Button';

const MLBGamesSchedule = () => {
  const { schedule, isLoading, error } = useMLBSchedule('2023-06-06', '2023-06-06');
  const [showCreateButton, setShowCreateButton] = useState(false); 

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
 
  {/*
  const {
    write: createTournament,
    isLoading,
    isSuccess,
    transactionData,
  } = useCreateGame(); 
  */} 
  // useCreateGame is a custom hook that returns a write function
  // TODO pass in the 'form' data from the game row which has two tiers and fixed rules

  const handleCreateClick = () => {
    // Your logic when the button is clicked launch a new game with info from game row
    console.log('clicked');
  };

  // Custom hook to check if game has already been created
  const useCheckGameCreated = (gameId) => {
    const [isGameCreated, setIsGameCreated] = useState(false);
    // Stub function for checking game creation status
    const checkGameCreation = async (gameId) => {
      // Replace this with your actual logic to check game creation status
      // Might need better tagging and discovery via subgraph
      // For now, let's simulate a delay of 1 second
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsGameCreated(Math.random() < 0.5); // Randomly set as created or not
    };

    useEffect(() => {
      checkGameCreation(gameId);
    }, [gameId]);

    return isGameCreated;
  };
  
  const MLBMoneyGames = ({ schedule }) => {
    return (
      <div>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>First Pitch</th>
              <th>Away Team</th>
              <th>Home Team</th>
            </tr>
          </thead>
          <tbody>
            {schedule.dates[0].games.map((game) => (
                <MLBMoneyGameRow key={game.gamePk} game={game} />
              ))
            } 
          </tbody>
        </table>
      </div>
    );
  };
  

  const MLBMoneyGameRow = ({ game }) => {
    console.log('this is game row ', game);
    const isGameCreated = useCheckGameCreated(game.gameId);
    console.log('this is game created ', isGameCreated);
    return (
      <tr>
        <td className="p-2">
          {isGameCreated ? (
            <Link href={`/game/${900}`}> // TODO replace with gameId need tag and discovery
              <Button size="lg">Play </Button>
            </Link>
          ) : (
            <Button size="lg" onClick={handleCreateClick}>Create</Button>
          )}
        </td>
        <td className="p-2">{new Date(game.gameDate).toLocaleString()}</td>
        <td className="p-2">{game.teams.away.team.name}</td>
        <td className="p-2">{game.teams.home.team.name}</td>
      </tr>
    );
  };
  return (
    <div>
      <h2>MLB Games Schedule</h2>
      <MLBMoneyGames schedule={schedule} />
    </div>
  );
};

export default MLBGamesSchedule;
