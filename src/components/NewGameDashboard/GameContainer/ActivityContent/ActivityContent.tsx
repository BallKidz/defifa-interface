import Container from "components/UI/Container";
import { useGameActivity } from "./useGameActivity";

function ActivityItem() {
  return <div>asd</div>;
}

export function ActivityContent() {
  const { data: activity } = useGameActivity();
  const mints = activity.contracts?.[0].mintedTokens;

  console.log("activity", mints);
  return (
    <Container>
      {mints?.map((mint: any) => (
        <ActivityItem key={mint.number} />
      ))}
    </Container>
  );
}
