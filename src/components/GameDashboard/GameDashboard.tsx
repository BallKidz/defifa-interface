import Navbar from "components/layout/Navbar";
import Container from "components/layout/Container";
import { useGameContext } from "contexts/GameContext";
import Head from "next/head";
import { GameContainer } from "./GameContainer/GameContainer";
import { Header } from "./Header";
import { PlayContent } from "./GameContainer/PlayContent/PlayContent";
import { RulesContent } from "./GameContainer/RulesContent/RulesContent";

export function GameDashboard() {
  const { metadata } = useGameContext();

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

      <Container className="my-5 py-3 border-b border-gray-800">
        <Header />
      </Container>

      <Container>
        <div className="grid grid-cols-4 gap-6 items-start relative">
          <div className="rounded-lg col-span-3">
            <PlayContent />
          </div>
          <div className="p-5 rounded-lg bg-neutral-900 col-span-1 sticky top-4">
            <span className="mb-2 font-semibold text-sm">How to play</span>
            <div className="text-xs">
              <RulesContent />
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
