/* eslint-disable react-hooks/exhaustive-deps */
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
  const [formatted, setFormatted] = useState("");
  const timerRef = useRef<any>(0);
  const timerCallback = useCallback(() => {
    const duration = calculateDuration(eventTime);

    if (!duration.isValid) {
      setFormatted(`Nov 21, 2022`);
      return;
    }

    if (!duration.days() && duration.hours()) {
      setFormatted(
        `In ${duration.hours()}h ${duration.minutes()}m ${duration.seconds()}s`
      );
    } else if (!duration.hours() && !duration.days() && duration.minutes()) {
      setFormatted(`In ${duration.minutes()}m ${duration.seconds()}s`);
    } else if (
      !duration.hours() &&
      !duration.days() &&
      !duration.minutes() &&
      duration.seconds()
    ) {
      setFormatted(`In ${duration.seconds()}seconds`);
    } else {
      setFormatted(
        `In ${duration.days()}d ${duration.hours()}h ${duration.minutes()}m ${duration.seconds()}s`
      );
    }
  }, [eventTime]);

  useEffect(() => {
    timerRef.current = setInterval(timerCallback, interval);

    return () => {
      clearInterval(timerRef.current);
    };
  }, [eventTime]);

  return formatted;
}