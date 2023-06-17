import Container from "components/layout/Container";
import Footer from "components/layout/Footer";
import Navbar from "components/layout/Navbar";
import { NextPage } from "next";
import Link from "next/link";
import { IDefifa_DAO_PROTOCOL_FEE } from "constants/constants";

const Explanation = () => {
  return (
    <>
      <h1 className="text-5xl md:text-5xl text-center font-medium tracking-tight mb-4 [text-shadow:_0_5px_20px_rgb(250_250_250_/_10%)]">
        How does Defifa work?
      </h1>

      <div className="text-center max-w-2xl mx-auto mb-6 text-lg">
        <p>Defifa is an onchain gaming and governance experiment.</p>
        <p>Make your picks, load the pot, and win.</p>
      </div>
      <div className="mx-auto max-w-4xl" style={{ textIndent: 50 }}>
        <p className="my-4">
          Defifa allows anyone to create an onchain prediction game for sports,
          elections, world events, or anything else. A game's creator represents
          different predictions as NFTs – people buy those NFTs to load a shared
          pot, and the people who minted the right NFTs get more of the pot when
          the game is finished.
        </p>
        <p className="my-4">
          Which NFTs are "right" is decided by onchain voting. Once a game
          finishes, anyone can submit scores to determine how much of the pot
          will go to the NFTs for each prediction. At least 50% of the NFTs for
          at least 50% of the predictions have to approve a set of scores –
          otherwise, people can reclaim their ETH from the pot.
        </p>
      </div>

      <h2 className="text-4xl md:text-4xl text-center font-medium mt-12 mb-6">
        Game Stages
      </h2>
      <div className="mx-auto max-w-4xl" style={{ textIndent: 50 }}>
        <p className="my-4">A Defifa game happens in four stages:</p>

        <ol>
          <li className="my-2">
            <b>1. Create:</b> Anyone can create a Defifa game. Game creators
            represent different predictions as NFTs, decide the price of each
            NFT, and set the game's schedule. Game creators also have the option
            to reserve a percentage of the final pot or a percentage of the NFTs
            for their team, for NFT artists, or for someone else.
          </li>
          <li className="my-2">
            <b>2. Mint:</b> People make their predictions by minting NFTs – one
            person can mint multiple NFTs corresponding to multiple predictions.
            After an amount of time set by the game's creator, NFT minting
            closes.
          </li>
          <li className="my-2">
            <b>3. Score:</b> Once a game finishes, anyone can score the game's
            results to determine how much of the pot will go to each
            prediction's NFTs. At least 50% of the NFTs for at least 50% of the
            predictions have to vote for a set of scores – otherwise, people can
            reclaim their ETH from the pot.
          </li>
          <li className="my-2">
            <b>4. Earn:</b> If a set of scores is approved, people will be able
            to burn their NFTs to claim their share of the rewards based on
            their predictions.
          </li>
        </ol>
      </div>

      <h2 className="text-4xl md:text-4xl text-center font-medium mt-12 mb-6">FAQ</h2>
      <div className="mx-auto max-w-4xl mb-16">
        <p className="my-4 font-bold italic text-center text-lg">
          What does Defifa cost?
        </p>
        <p className="my-4" style={{ textIndent: 50 }}>
          Defifa offers a free protocol for creators to bring their games to life.
          When a game's scorecard is ratified, {IDefifa_DAO_PROTOCOL_FEE * 100}% of pot goes into the Defifa treasury,
          which is managed by the community of players, developers, and supporters. This ensures a sustainable
          ecosystem where players have a say in the governance and growth of Defifa.
          Visit the{" "}<Link href="https://juicebox.money/@defifa" passHref>
            <a className="underline hover:font-bold">Defifa DAO Juicebox</a>
          </Link>{" "}for more information.
        </p>

        <p className="my-4 font-bold italic text-center text-lg">
          How decentralized is Defifa?
        </p>
        <p className="my-4" style={{ textIndent: 50 }}>
          Defifa is built by a{" "}
          <Link href="https://discord.gg/hrZnvs65Nh" passHref>
            <a className="underline hover:font-bold">community DAO</a>
          </Link>
          . Defifa games take place onchain, making them independent,
          transparent, and uncensorable. We can't delete or modify your game.
        </p>

        <p className="my-4 font-bold italic text-center text-lg">
          How do I use this website?
        </p>
        <p className="my-4" style={{ textIndent: 50 }}>
          This website interacts with the Ethereum blockchain – to use it,
          you'll need to have a wallet and some ETH (the main currency on
          Ethereum). You can get a wallet on{" "}
          <Link href="https://metamask.io/" passHref>
            <a className="underline hover:font-bold">metamask.io</a>
          </Link>{" "}
          and buy ETH within the wallet using a credit card.
        </p>
      </div>
    </>
  );
};

const About: NextPage = () => {
  return (
    <>
      <Container>
        <Navbar />
        <Explanation />
      </Container>

      <Footer />
    </>
  );
};

export default About;
