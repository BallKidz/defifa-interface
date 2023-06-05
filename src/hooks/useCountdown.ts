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
          const timeRemainingString = `${hours >= 10 ? hours : `0${hours}`}:${
            minutes >= 10 ? minutes : `0${minutes}`
          }:${seconds >= 10 ? seconds : `0${seconds}`}`;

          setTimeRemaining(timeRemainingString);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return { timeRemaining, isOver };
}
