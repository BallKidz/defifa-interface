'use client'

import Container from "components/layout/Container";
import Wallet from "components/layout/Navbar/Wallet";
import { useGameContext } from "contexts/GameContext";
import { useAllGames } from "hooks/useAllGames";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { useFarcasterContext } from "hooks/useFarcasterContext";

import Button from "components/UI/Button";
import { useRouter } from "next/navigation";
import { Header } from "./Header";
import { ActivityContent } from "../GameDashboard/GameContainer/ActivityContent/ActivityContent";
import Chat from "components/Chat/Chat";
import { GamePlayerPowerLevel } from "components/LeaderBoard/GamePivot/GamePlayerPowerLevel";
import { useChainData } from "hooks/useChainData";
import { buildGamePath } from "lib/networks";

function GameButton({ game }: { game: any }) {
  const { chainData } = useChainData();
  const gameRoute = buildGamePath(chainData.chainId, game.gameId);
  
  return (
    <Link href={gameRoute} className="hover:text-neutral-300 px-6 py-1 border-r border-neutral-800 max-w-[200px] overflow-hidden overflow-ellipsis shrink-0 whitespace-nowrap">
      {game.name ?? game.gameId}
    </Link>
  );
}

export function GameHome() {
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
          content="Defifa is an onchain gaming and governance experiment. Make your picks, load the pot and win."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-gradient-to-b from-slate-950 to-black min-h-screen">
        <div className="border-b border-neutral-900 text-sm text-neutral-400">
          <Container>
            <div className="flex overflow-x-auto scrollbar-hide">
              <div className="px-6 py-1 border-r border-neutral-800 whitespace-nowrap">
                <Link href="/arcade">All games</Link>
              </div>
              {games?.map((g) => (
                <GameButton key={g.gameId} game={g} />
              ))}
            </div>
          </Container>
        </div>
        <div className="border-b border-neutral-900 py-2">
          <Container className="flex justify-between items-center">
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
        <Container className="my-16">
          <Header />
        </Container>
        
        <Container className="mb-16">
          <ActivityContent />
        </Container>
      </div>
    </>
  );
}
