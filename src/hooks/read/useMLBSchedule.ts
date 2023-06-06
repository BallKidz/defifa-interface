import { useEffect, useState } from 'react';

const useMLBSchedule = (startDate: any, endDate: any) => {
  const [schedule, setSchedule] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await fetch(
          `http://statsapi.mlb.com/api/v1/schedule/games/?sportId=1&startDate=${startDate}&endDate=${endDate}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch MLB schedule');
        }
        const data = await response.json();
        setSchedule(data);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchSchedule();
  }, [startDate, endDate]);

  return { schedule, isLoading, error };
};

export default useMLBSchedule;
