import Container from "components/UI/Container";
import { useCountdown } from "hooks/Countdown";
import { useGameTimes } from "hooks/read/GameTimes";

export function CountdownPhaseContent() {
  const { data, isLoading } = useGameTimes();
  const mintStart = new Date(
    (data?.start - data?.mintDuration - data?.refundDuration) * 1000
  );

  const { timeRemaining } = useCountdown(mintStart);

  if (!data || !isLoading)
    return <Container className="text-center">...</Container>;

  return (
    <div className="flex justify-center">
      {timeRemaining ? (
        <span>Game starting in {timeRemaining}...</span>
      ) : (
        <span>Game starting, waiting for next block...</span>
      )}
    </div>
  );
}
