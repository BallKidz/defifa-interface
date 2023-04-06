import type { NextPage } from "next";
import Head from "next/head";
import Script from "next/script";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeployerWrapper from "../components/Deployer";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Defifa: American Football Playoffs 2023</title>
        <meta property="og:image" content="https://i.imgur.com/lvkXgnx.png" />
        <meta name="description" content="Create your own tournament." />
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
      <DeployerWrapper />
    </div>
  );
};

export default Home;
