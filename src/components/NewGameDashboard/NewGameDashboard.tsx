import Navbar from "components/Navbar";
import Container from "components/UI/Container";
import { GameContainer } from "./GameContainer/GameContainer";
import { Header } from "./Header";
import { useGameContext } from "contexts/GameContext";
import Head from "next/head";

export function NewGameDashboard() {
  const { metadata } = useGameContext();
  const name = metadata?.name;
  return (
    <>
      <Head>
        {name ? <title>{name} | Defifa</title> : <title> Defifa</title>}
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
