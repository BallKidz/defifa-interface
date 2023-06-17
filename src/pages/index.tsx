import AllGames from "components/Arcade/TurnOn";
import Navbar from "components/layout/Navbar";
import Container from "components/layout/Container";
import type { NextPage } from "next";
import Head from "next/head";
import Footer from "../components/layout/Footer";
import Description from "../components/Arcade/Description";
const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Money Games with Friends | Defifa</title>
        <meta property="og:image" content="https://i.imgur.com/lvkXgnx.png" />
        <meta
          name="description"
          content="Defifa is an onchain gaming and governance experiment. Make your picks, load the pot and win."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container className="mb-12">
        <Navbar />

        <main className="pt-16">
          <h1 className="text-5xl md:text-7xl text-center font-medium tracking-tight mb-8 [text-shadow:_0_5px_20px_rgb(250_250_250_/_10%)]">
            Money Games with Friends
          </h1>
          <div className="text-center max-w-2xl mx-auto mb-12 text-lg">
            <p>Defifa is an onchain gaming and governance experiment.</p>
            <p>Make your picks, load the pot, and win.</p>
          </div>

          <div className="mx-auto min-h-screen">
            <Description />
            <AllGames />
          </div>
        </main>
      </Container>

      <Footer />
    </>
  );
};

export default Home;
