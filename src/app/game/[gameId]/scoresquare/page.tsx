"use client";

import { ScoreSquarePage } from "components/Game/ScoreSquare/ScoreSquarePage";
import Container from "components/layout/Container";
import { useParams } from "next/navigation";

function ScoreSquarePageWrapper() {
  const params = useParams();
  const { gameId: networkGameId } = params;
  const decodedGameId = decodeURIComponent(networkGameId as string);

  return (
    <Container>
      <div className="py-4">
        <ScoreSquarePage gameId={decodedGameId} />
      </div>
    </Container>
  );
}

export default function ScoreSquareRoutePage() {
  return <ScoreSquarePageWrapper />;
}

