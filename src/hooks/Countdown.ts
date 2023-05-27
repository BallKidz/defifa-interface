import { useState, useEffect } from "react";

export function useCountdown(targetDate: Date | undefined) {
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);
  const [isOver, setIsOver] = useState(false);

  useEffect(() => {
    if (!targetDate) return;
    const interval = setInterval(() => {
      const currentTime = new Date().getTime();
      const timeDifference = targetDate.getTime() - currentTime;

      if (timeDifference <= 0) {
        setIsOver(true);
        setTimeRemaining("");
      } else {
        let days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        let hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
        let minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
        let seconds = Math.floor((timeDifference / 1000) % 60);

        if (days > 1) {
          setTimeRemaining(`${days} days`);
        } else {
          let timeRemainingString = "";

          if (days === 1) {
            timeRemainingString += `${hours}h ${minutes}m`;
          } else {
            if (hours > 0) {
              timeRemainingString += `${hours}h `;
            }

            if (minutes > 0) {
              timeRemainingString += `${minutes}m`;
            }
            if (seconds > 0) {
              timeRemainingString += ` ${seconds}s`;
            }
          }

          setTimeRemaining(timeRemainingString);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return { timeRemaining, isOver };
}
