import type { NextPage } from "next";
import Head from "next/head";
import Description from "../components/Description";
import Mint from "../components/Mint";
import Navbar from "../components/Navbar";
import Info from "../components/Navbar/Info";
import Rules from "../components/Rules";
import SelfRefree from "../components/SelfReferee";
import Divider from "../components/UI/Divider";
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
      <Navbar>
        <Info />
      </Navbar>
      <Description />
      <Rules />
      <Divider />
      <Mint />
      <Divider />
      <SelfRefree />
    </div>
  );
};

export default Home;
