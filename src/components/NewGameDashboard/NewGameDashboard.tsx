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
