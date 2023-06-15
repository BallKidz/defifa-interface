import React, { useState, useEffect } from 'react';
import { useCreateGame } from 'hooks/write/useCreateGame';
import { DefifaLaunchProjectData, DefifaTierParams } from 'types/defifa';
import { contractUri, projectMetadataUri } from 'uri/contractUri';
import { createDefaultLaunchProjectData, createDefaultTierData } from './defaultState';
import { constants } from 'ethers';
import useScheduleData from '../../../hooks/read/AllMlbGames';

const MlbCreate = () => {
    const [project, setProject] = useState<DefifaLaunchProjectData>(createDefaultLaunchProjectData());
    const { tableData, loading, resetTableData } = useScheduleData();
    const [tier, setTier] = useState<DefifaTierParams>(createDefaultTierData());

    console.log('project', project);

    const { write: createTournament, isLoading, isSuccess, transactionData } = useCreateGame(project);

    function addSpacesToWords(str) {
        const words = str.split(' ');
        let result = '';
        let count = 0;

        for (let i = 0; i < words.length; i++) {
            if (count + words[i].length > 10) {
                result += ' ';
                count = 0;
            }
            result += words[i] + ' ';
            count += words[i].length + 1;
        }

        return result.trim();
    }


    const handleCheckboxClick = (event: React.ChangeEvent<HTMLInputElement>, game: any, index: number) => {
        const checked = event.target.checked;
        console.log('Checkbox clicked on row:', index, 'checked:', checked);

        const awayTeam = addSpacesToWords(game?.teams?.away.team.name) || '';
        const homeTeam = addSpacesToWords(game?.teams?.home.team.name) || '';
        console.log('awayTeam', awayTeam);
        console.log('homeTeam', homeTeam);

        const startTime = Math.floor(new Date(game.gameDate).getTime() / 1000); // Convert to Unix epoch time
        const now = Math.floor(Date.now() / 1000); // Current Unix epoch time
        const oneMinute = 60; // One minute in seconds
        const mintDuration = startTime - (now + oneMinute);
        const refundDuration = 3600; // 1 hour in seconds
        if (now >= startTime - refundDuration) {
            console.log('Refund time has passed');
        }
        const updatedTiers = [
            {
                ...tier,
                name: awayTeam,
            },
            {
                ...tier,
                name: homeTeam,
            },
        ];

        const updatedProject: DefifaLaunchProjectData = {
            ...project,
            name: `${awayTeam} @ ${homeTeam} on ${game?.gameDate}`,
            start: startTime,
            mintDuration: mintDuration,
            refundDuration: refundDuration,
            tiers: updatedTiers,
        };

        setProject(updatedProject);

        try {
            createTournament(); // Call createTournament function to trigger game creation
        } catch (error) {
            console.error('Failed to create game:', error);
        }
    };

    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table className="border-collapse w-full">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 py-2 px-4 ">Create</th>
                            <th className="border border-gray-300 py-2 px-4 ">First Pitch</th>
                            <th className="border border-gray-300 py-2 px-4 ">Away</th>
                            <th className="border border-gray-300 py-2 px-4 ">Home</th>
                            {/* Add more table header columns as needed */}
                        </tr>
                    </thead>
                    <tbody>
                        {tableData?.map((games, index) => (
                            <tr key={index}>
                                <td className="border border-gray-300 py-2 px-4">
                                    <input
                                        type="checkbox"
                                        onChange={(event) => handleCheckboxClick(event, games, index)}
                                    />
                                </td>
                                <td className="border border-gray-300 py-2 px-4">
                                    {new Date(games.gameDate).toLocaleString()}
                                </td>
                                <td className="border border-gray-300 py-2 px-4">
                                    {games.teams?.away.team.name}
                                </td>
                                <td className="border border-gray-300 py-2 px-4">
                                    {games.teams?.home.team.name}
                                </td>
                                {/* Render additional table cells based on your API response */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default MlbCreate;