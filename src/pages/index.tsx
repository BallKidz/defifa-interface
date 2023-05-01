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
import SelfRefree from "../components/SelfReferee";
import Divider from "../components/UI/Divider";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Defifa: American Basketball Playoffs 2023</title>
        <meta property="og:image" content="https://i.imgur.com/lvkXgnx.png" />
        <meta
          name="description"
          content="Defifa is a Luxury American Basketball Experience built with Juicebox and secured by Ethereum."
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
        <Info />
      </Navbar>
      <Description />
      <Divider />
      <SelfRefree />
      <Divider />
      <MyTeams />
      <Divider />
      <Mint />
      <Divider />

      <Footer />
    </div>
  );
};

export default Home;
