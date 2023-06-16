import Container from "components/layout/Container";
import Wallet from "components/layout/Navbar/Wallet";
import { useGameContext } from "contexts/GameContext";
import { useAllGames } from "hooks/useAllGames";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { PlayContent } from "./GameContainer/PlayContent/PlayContent";
import { Header } from "./Header";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

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

      <div className="border-b border-neutral-800 text-sm bg-neutral-950">
        <Container>
          <div className="flex overflow-auto">
            <div className="px-6 py-1 border-r border-neutral-800 shrink-0">
              <Link href="/">All games</Link>
            </div>
            {games?.map((g) => (
              <GameButton key={g.gameId} game={g} />
            ))}
          </div>
        </Container>
      </div>

      <nav className="border-b border-neutral-800 bg-neutral-900 py-2">
        <Container className="flex justify-between">
          <div>
            <Image
              src="/assets/defifa_spinner.gif"
              height={40}
              width={51}
              alt="logo"
            />
          </div>
          <div className="flex gap-6 items-center">
            <Link href="/about">
              <a className="flex items-center gap-2 text-neutral-300">
                <QuestionMarkCircleIcon className="h-4 w-4 inline" /> How it
                works
              </a>
            </Link>
            <Wallet />
          </div>{" "}
        </Container>
      </nav>

      <Container className="mt-2 border-b border-neutral-800 pb-4">
        <Header />
      </Container>
      <PlayContent />
    </>
  );
}
