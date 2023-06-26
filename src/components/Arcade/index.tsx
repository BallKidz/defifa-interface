import Navbar from "../layout/Navbar";
import Info from "../layout/Navbar/Info";
import Container from "components/layout/Container";
import ArcadeLoad from "./TurnOn";
import ArcadeDescription from "./Description";
import Footer from "components/layout/Footer";
import { Header } from "components/Game/GameHome/Header";
import Head from "next/head";
import Link from "next/link";
import { useGameContext } from "contexts/GameContext";
import { useAllGames } from "hooks/useAllGames";
import { useState } from "react";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import Wallet from "components/layout/Navbar/Wallet";
import Image from "next/image";
import { FarcasterSignIn } from "components/SocialSharing/FarcasterSignIn";

function GameButton({ game }: { game: any }) {
  return (
    <Link href={`/game/${game.gameId}`}>
      <a className="px-6 py-1 border-r border-neutral-800 max-w-[130px] overflow-hidden overflow-ellipsis shrink-0 whitespace-nowrap">
        {game.name ?? game.gameId}
      </a>
    </Link>
  );
}
const ArcadeWrapper = () => {
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
          content="Defifa is an onchain gaming and governance experiment. Make your picks, load the pot and win."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-gradient-to-b from-slate-950 to-black">


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
              <Link href="/about">
                <a className="flex items-center gap-2 text-neutral-300 text-sm">
                  <QuestionMarkCircleIcon className="h-4 w-4 inline" /> How it
                  works
                </a>
              </Link>
              {/* <FarcasterSignIn /> */}
              <Wallet />
            </div>
          </Container>
        </div>
        <Container className="mb-8">
        </Container>

        <nav className="border-b border-neutral-900 pb-2">
          <Container>
            <h1>Play Money Games With Friends</h1>
            <ArcadeDescription />
            <ArcadeLoad />
            <Footer />
          </Container>
        </nav>
      </div>
    </>
  );
};

export default ArcadeWrapper;
