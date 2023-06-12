// useTableData.js

import React, { useState, useEffect } from 'react';

const useScheduleData = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch API data here
    const fetchData = async () => {
      try {
        // Make API request and retrieve data
        const response = await fetch('https://statsapi.mlb.com/api/v1/schedule/games/?sportId=1&startDate=2023-06-12&endDate=2023-06-13');
        const data = await response.json();

        // Update tableData state with fetched data
        setTableData(data.dates[0].games);
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
  console.log(tableData);
  return { tableData, loading, resetTableData };
};

export default useScheduleData;
