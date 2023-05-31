import AllGames from "components/Arcade/TurnOn";
import Navbar from "components/Navbar";
import Info from "components/Navbar/Info";
import Container from "components/UI/Container";
import type { NextPage } from "next";
import Head from "next/head";
import Script from "next/script";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../components/Footer";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Defifa: Money games</title>
        <meta property="og:image" content="https://i.imgur.com/lvkXgnx.png" />
        <meta
          name="description"
          content="Defifa is a protocol for launching money games built with Juicebox, secured by Ethereum."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <Container>
        <Navbar />

        <main className="pt-8">
          <h1 className="text-5xl md:text-7xl text-center font-medium tracking-tight mb-8">
            Money Games with Friends
          </h1>
          <div className="text-center max-w-2xl mx-auto mb-24 text-lg">
            <p>Defifa is an on-chain gaming and governance experiment.</p>
            <p> Make your picks, load the pot and win.</p>
          </div>

          <div className="mx-auto">
            <AllGames />
          </div>
        </main>
      </Container>

      <Footer />
    </>
  );
};

export default Home;
