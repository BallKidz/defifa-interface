// useTableData.js

import React, { useState, useEffect } from 'react';

const useScheduleData = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch API data here
    const fetchData = async () => {
        try {
            // Get the current date
            const currentDate = new Date();
    
            // Increment the current date by 1 day
            const nextDate = new Date(currentDate);
            nextDate.setDate(currentDate.getDate() + 1);
    
            // Format the dates as strings in 'YYYY-MM-DD' format
            const startDate = formatDate(currentDate);
            const endDate = formatDate(nextDate);
            console.log(startDate);
            console.log(endDate);
            // Make API request and retrieve data for the next day
            const response = await fetch(`https://statsapi.mlb.com/api/v1/schedule/games/?sportId=1&startDate=${startDate}&endDate=${endDate}`);
               const data = await response.json();

        // Flatten the array of games from all dates
        const games = data.dates.flatMap(date => date.games);
        const filteredGames = games.filter(game => {
            const gameDate = new Date(game.gameDate);
            return gameDate.getTime() >= currentDate.getTime() + 3600000; // 1 hour in milliseconds
          });
  
          // Update tableData state with filtered games
        setTableData(filteredGames);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching table data:', error);
      }
    };

    fetchData();
  }, []);

  const resetTableData = () => {
    setTableData([]);
    setLoading(true);
  };
  console.log('this is table date ',tableData);
  return { tableData, loading, resetTableData };
};
// Helper function to format date as 'YYYY-MM-DD'
const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
export default useScheduleData;
