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

const MLBGamesSchedule = () => {
  const { schedule, isLoading, error } = useMLBSchedule('2023-06-06', '2023-06-06');
    console.log('this is mbl schedule', schedule);
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>First Pitch</th>
            <th>Away Team</th>
            <th>Home Team</th>
          </tr>
        </thead>
        <tbody>
          {schedule.dates[0].games.map((game) => (
            <tr key={game.gamePk}>
             <td className="p-2">
                <Link href="/create">
                  {new Date(game.gameDate).toLocaleString()}
                </Link>
              </td>
              <td className="p-2">{game.teams.away.team.name}</td>
              <td className="p-2">{game.teams.home.team.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MLBGamesSchedule;
