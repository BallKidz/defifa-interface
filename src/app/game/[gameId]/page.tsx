import { Metadata } from "next";
import { GameHome } from "components/Game/GameHome/GameHome";
import { parseNetworkGameId } from "lib/networks";

const defaultDescription =
  "Defifa is an onchain gaming and governance experiment. Join a team, load the pot, and win.";

const baseUrl =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

const imageUrl = `${baseUrl}/assets/defifa-og.png`;
const iconUrl = `${baseUrl}/assets/defifa-icon.png`;

export async function generateMetadata({
  params,
}: {
  params: { gameId: string };
}): Promise<Metadata> {
  const decodedGameId = decodeURIComponent(params.gameId);
  const parsed = parseNetworkGameId(decodedGameId);
  const networkName = parsed?.network?.name ?? "Defifa";
  const shareUrl = `${baseUrl}/game/${decodedGameId}`;
  const title = parsed
    ? `${networkName} Game #${parsed.gameId} | Defifa`
    : "Defifa Game";

  const framePayload = JSON.stringify({
    version: "1",
    imageUrl,
    button: {
      title: "🎮 Play Game",
      action: {
        type: "launch_frame",
        name: "Defifa",
        url: shareUrl,
        splashImageUrl: iconUrl,
        splashBackgroundColor: "#000000",
      },
    },
  });

  return {
    title,
    description: defaultDescription,
    openGraph: {
      title,
      description: defaultDescription,
      url: shareUrl,
      images: [imageUrl],
    },
    other: {
      "fc:miniapp": framePayload,
      "fc:frame": framePayload,
    },
  };
}

export default function GamePage() {
  return <GameHome />;
}
