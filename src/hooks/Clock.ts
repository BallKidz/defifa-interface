import moment from "moment";
import { useState, useRef, useCallback, useEffect } from "react";

const calculateDuration = (eventTime: number) =>
  moment.duration(
    Math.max(eventTime - Math.floor(Date.now() / 1000), 0),
    "seconds"
  );

export function useCountdown({
  eventTime,
  interval,
}: {
  eventTime: number;
  interval: number;
}) {
  const [duration, setDuration] = useState(calculateDuration(eventTime));
  console.log(duration);
  const timerRef = useRef<any>(0);
  const timerCallback = useCallback(() => {
    setDuration(calculateDuration(eventTime));
  }, [eventTime]);

  useEffect(() => {
    timerRef.current = setInterval(timerCallback, interval);

    return () => {
      clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventTime]);

  return duration;
}
