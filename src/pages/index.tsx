import type { NextPage } from "next";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import Description from "../components/Description";
import Footer from "../components/Footer";
import Mint from "../components/Mint";
import Navbar from "../components/Navbar";
import Info from "../components/Navbar/Info";
import Rules from "../components/Rules";
import SelfRefree from "../components/SelfReferee";
import Divider from "../components/UI/Divider";
import styles from "../styles/Home.module.css";
import "react-toastify/dist/ReactToastify.css";
import MyTeams from "../components/MyTeams";
import Script from "next/script";
const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Defifa</title>
        <meta property="og:image" content="https://i.imgur.com/mL0xrgD.png" />
        <meta
          name="description"
          content="Defifa is a Luxury World Cup Experience built with Juicebox and secured by Ethereum."
        />
        <link rel="icon" href="/favicon.ico" />
        <Script
          src="https://cdn.usefathom.com/script.js"
          data-site="WIPQWWMN"
          defer
        />
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
      <Navbar>
        <Info />
      </Navbar>
      <Description />
      <Rules />
      <Divider />
      <Mint />
      <Divider />
      <MyTeams />
      <Divider />
      <SelfRefree />
      <Divider />
      <Footer />
    </div>
  );
};

export default Home;
