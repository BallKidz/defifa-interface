'use client'

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
import { QueueNextPhaseBanner } from "./GameContainer/PlayContent/QueueNextPhaseBanner/QueueNextPhaseBanner";
import { useChainData } from "hooks/useChainData";
import { buildGamePath } from "lib/networks";
import { useFarcasterContext } from "hooks/useFarcasterContext";

function GameButton({ game }: { game: any }) {
  const { chainData } = useChainData();
  const gameRoute = buildGamePath(chainData.chainId, game.gameId);
  
  return (
    <Link href={gameRoute} className="hover:text-neutral-300 px-6 py-1 border-r border-neutral-800 max-w-[200px] overflow-hidden overflow-ellipsis shrink-0 whitespace-nowrap">
      {game.name ?? game.gameId}
    </Link>
  );
}

export function GameDashboard() {
  const { metadata } = useGameContext();
  const { data: games } = useAllGames();
  const { isInMiniApp } = useFarcasterContext();
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
          content="Defifa is an onchain gaming and governance experiment. Join a team, load the pot, and win."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="bg-gradient-to-b from-slate-950 to-black">
        <div className="border-b border-neutral-900 text-xs text-neutral-400">
          <Container>
            <div className="flex overflow-x-auto scrollbar-hide">
              <div className="px-6 py-1 border-r border-neutral-800 shrink-0">
                <Link href="/arcade">All games</Link>
              </div>
              {games?.map((g) => (
                <GameButton key={g.gameId} game={g} />
              ))}
            </div>
          </Container>
        </div>

        <div className="border-b border-neutral-900 py-2">
          <Container className="flex justify-between">
            <Link href="/">
              <Image
                src="/assets/defifa_spinner.gif"
                height={26}
                width={45}
                alt="logo"
              />
            </Link>
            <div className="flex gap-6 items-center">
              <Link href="/about" className="flex items-center gap-2 text-neutral-300 text-sm">
                <QuestionMarkCircleIcon className="h-4 w-4 inline" /> How it
                works
              </Link>
              {/* Only show wallet when not in Mini App context */}
              {!isInMiniApp && <Wallet />}
            </div>
          </Container>
        </div>

        <Container className={isInMiniApp ? "mb-4" : "mb-8"}>
          <Header />
        </Container>

        <Container className={isInMiniApp ? "mb-4" : "mb-8"}>
          <QueueNextPhaseBanner />
        </Container>
        <PlayContent />

      </div>
    </>
  );
}
