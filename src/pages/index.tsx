import type { NextPage } from "next";
import Head from "next/head";
import Mint from "../components/Mint";
import Navbar from "../components/Navbar";
import Rules from "../components/Rules";
import SelfRefree from "../components/SelfReferee";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Defifa</title>
        <meta name="description" content="Defifa" />
        <link rel="icon" href="/favicon.ico" />
        <script
          src="https://cdn.usefathom.com/script.js"
          data-site="WIPQWWMN"
          defer
        ></script>
      </Head>
      <Navbar />
      <Rules />
      <Mint />
      <SelfRefree />
    </div>
  );
};

export default Home;
