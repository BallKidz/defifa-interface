import Navbar from "components/Navbar";
import Container from "components/UI/Container";
import { GameContainer } from "./GameContainer/GameContainer";
import { Header } from "./Header";

export function NewGameDashboard() {
  return (
    <Container>
      <Navbar />

      <Header />

      <GameContainer />
    </Container>
  );
}
