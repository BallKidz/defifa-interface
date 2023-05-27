import { GameDashboard } from "components/GameDashboard";
import GameContextProvider from "contexts/GameContext/GameContextProvider";
import { useChainData } from "hooks/useChainData";
import type { NextPage } from "next";
import Head from "next/head";
import Script from "next/script";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../components/Footer";

const Home: NextPage = () => {
  const { chainData } = useChainData();
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
      <Script
        src="https://cdn.usefathom.com/script.js"
        data-site="WIPQWWMN"
        defer
      />
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

      <GameContextProvider gameId={chainData.homepageProjectId}>
        <GameDashboard />
      </GameContextProvider>

      <Footer />
    </>
  );
};

export default Home;
