import Container from "components/UI/Container";
import { useCountdown } from "hooks/Countdown";
import { useGameTimes } from "hooks/read/GameTimes";

export function CountdownPhaseContent() {
  const { data, isLoading } = useGameTimes();
  const mintStart = new Date(
    (data?.start ?? 0 - data?.mintDuration ?? 0 - data?.refundDuration ?? 0) *
      1000
  );

  const { timeRemaining } = useCountdown(mintStart);

  if (!data || isLoading) {
    return <Container className="text-center">...</Container>;
  }

  return (
    <div className="flex justify-center">
      {timeRemaining ? (
        <div className="text-center">
          <div className="mb-1">Game starts in</div>
          <div className="text-4xl" style={{ color: "#EB007B" }}>
            {timeRemaining}
          </div>
        </div>
      ) : (
        <span>Game starting now, waiting for next block...</span>
      )}
    </div>
  );
}
