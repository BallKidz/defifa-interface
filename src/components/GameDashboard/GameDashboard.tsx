import Navbar from "components/layout/Navbar";
import Container from "components/layout/Container";
import { useGameContext } from "contexts/GameContext";
import Head from "next/head";
import { GameContainer } from "./GameContainer/GameContainer";
import { Header } from "./Header";
import { PlayContent } from "./GameContainer/PlayContent/PlayContent";
import { useAllGames } from "hooks/useAllGames";
import Link from "next/link";

function GameButton({ game }: { game: any }) {
  return (
    <Link href={`/game/${game.gameId}`}>
      <a className="px-6 py-1 border-r border-neutral-800 max-w-[130px] overflow-hidden overflow-ellipsis shrink-0 whitespace-nowrap">
        {game.name ?? game.gameId}
      </a>
    </Link>
  );
}

export function GameDashboard() {
  const { metadata } = useGameContext();
  const { data: games } = useAllGames();
  const title = metadata?.name
    ? `${metadata.name} | Defifa`
    : "Money Games with Friends | Defifa";

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:image" content="https://i.imgur.com/lvkXgnx.png" />
        <meta
          name="description"
          content="Defifa is an on-chain gaming and governance experiment. Make your picks, load the pot and win."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="border-b border-neutral-800 text-sm">
        <Container className="flex overflow-hidden">
          <div className="px-6 py-1 border-r border-neutral-800 shrink-0">
            <Link href="/">All games</Link>
          </div>
          {games?.map((g) => (
            <GameButton key={g.gameId} game={g} />
          ))}
        </Container>
      </div>

      <Container className="mt-8 mb-6">
        <Header />
      </Container>

      <PlayContent />
    </>
  );
}
