import Container from "components/layout/Container";
import { useCountdown } from "hooks/useCountdown";
import { useGameTimes } from "hooks/read/useGameTimes";

export function CountdownPhaseContent() {
  const { data, isLoading } = useGameTimes();
  const mintStart = data
    ? new Date(
        (data?.start ??
          0 - data?.mintDuration ??
          0 - data?.refundDuration ??
          0) * 1000
      )
    : undefined;

  const { timeRemaining } = useCountdown(mintStart);

  if (!data || isLoading) {
    return <Container className="text-center">...</Container>;
  }

  return (
    <div className="flex justify-center">
      {timeRemaining ? (
        <div className="text-center">
          <div className="mb-1">Minting live in</div>
          <div className="text-4xl" style={{ color: "#EB007B" }}>
            {timeRemaining}
          </div>
        </div>
      ) : (
        <span>Minting starting now, waiting for next block...</span>
      )}
    </div>
  );
}
