import Navbar from "components/Navbar";
import Container from "components/UI/Container";
import { useGameContext } from "contexts/GameContext";
import Head from "next/head";
import { GameContainer } from "./GameContainer/GameContainer";
import { Header } from "./Header";

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
      <Container>
        <Navbar />
      </Container>
      <Container>
        <Header />
      </Container>

      <GameContainer />
    </>
  );
}
