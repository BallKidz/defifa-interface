import { useState, useEffect } from "react";

export function useCountdown(targetDate: Date): {
  timeRemaining: string | null;
  isOver: boolean;
} {
  // Declare a state variable to store the time remaining
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);
  const [isOver, setIsOver] = useState<boolean>(false);

  // Calculate the time remaining every second
  useEffect(() => {
    const interval = setInterval(() => {
      // Calculate the time remaining
      const currentTime = new Date().getTime();
      const timeDifference = targetDate.getTime() - currentTime;
      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
      // Set the time remaining in the state
      let timeRemainingString = "";
      if (days > 0) {
        timeRemainingString += `${days}d `;
      }
      if (hours > 0) {
        timeRemainingString += `${hours}h `;
      }
      if (minutes > 0) {
        timeRemainingString += `${minutes}m `;
      }
      if (seconds > 0) {
        timeRemainingString += `${seconds}s `;
      }
      if (timeRemainingString === "") {
        setIsOver(true);
      }
      setTimeRemaining(timeRemainingString);
    }, 1000);

    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, [targetDate]);

  return { timeRemaining, isOver };
}
