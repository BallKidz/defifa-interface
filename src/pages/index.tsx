import type { NextPage } from "next";
import Head from "next/head";
import Script from "next/script";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Description from "../components/Description";
import Footer from "../components/Footer";
import Mint from "../components/Mint";
import MyTeams from "../components/MyTeams";
import Navbar from "../components/Navbar";
import Info from "../components/Navbar/Info";
import Divider from "../components/UI/Divider";
import styles from "../styles/Home.module.css";
import SelfRefree from "../components/SelfReferee";

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
      <Navbar>
        <Info withCreateButton />
      </Navbar>

      <main className={styles.container}>
        <Description />

        <Divider />
        <Mint />

        <Divider />
        <MyTeams />

        <Divider />
        <SelfRefree /> 
      </main>

      <Footer />
    </>
  );
};

export default Home;
