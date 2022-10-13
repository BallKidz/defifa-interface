import type { NextPage } from "next";
import Head from "next/head";
import Rules from "../components/Rules";
import Content from "../components/UI/Content";
import Navbar from "../components/Navbar";
import styles from "../styles/Home.module.css";
import Mint from "../components/Mint";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Defifa</title>
        <meta name="description" content="Defifa" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <Rules />
      <Mint />
    </div>
  );
};

export default Home;
