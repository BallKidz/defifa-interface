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
        <p>Join a team, load the pot, and win.</p>
      </div>
      <div className="mx-auto max-w-4xl" style={{ textIndent: 50 }}>
        <p className="my-4">
          Defifa allows anyone to create an onchain prediction game for sports,
          elections, world events, or anything else. A game's creator sets up
          teams (representing the sports teams, political candidates, or world
          event outcomes) which anyone can join by minting a team's NFTs.
          Minting NFTs loads a shared reward pot, and the winning teams get more
          of that pot when the game ends.
        </p>
        <p className="my-4">
          Which teams "win" is determined by onchain voting. Once NFT minting
          closes, anyone can score the contest to determine how much of the pot
          goes to each team. At least 50% of teams need to approve a set of
          scores by majority vote – otherwise, the ETH stays in the pot.
        </p>
        <p className="my-4">
          Everything runs onchain, making Defifa games decentralized,
          uncensorable, and unstoppable. No third parties needed.
        </p>
      </div>

      <h2 className="text-4xl md:text-4xl text-center font-medium mt-12 mb-6">
        Game Stages
      </h2>
      <div className="mx-auto max-w-4xl" style={{ textIndent: 50 }}>
        <p className="my-4">A Defifa game happens in five stages:</p>

        <ol>
          <li className="my-2">
            <b>1. Create:</b> Anyone can create a Defifa game. Game creators set
            up teams, set the prices of each team's NFT, and set the game's
            schedule. Game creators can choose to reserve a percentage of the
            pot or a percentage of the NFTs for the recipients of their
            choosing.
          </li>
          <li className="my-2">
            <b>2. Mint:</b> People can join teams by minting their NFTs. One
            person can mint multiple NFTs from multiple teams. After an amount
            of time set by the game's creator, minting closes.
          </li>
          <li className="my-2">
            <b>3. Refunds:</b> A refund window opens if the game's creator set
            one up. During this window, anyone can redeem their NFT to reclaim
            their ETH from the pot. <b>This stage is optional.</b>
          </li>
          <li className="my-2">
            <b>4. Score:</b> Once a game ends, anyone can score the game's
            results to determine how much of the pot will go to each team. At
            least 50% of teams need to approve a set of scores by majority vote
            – otherwise, ETH stays in the pot.
          </li>
          <li className="my-2">
            <b>5. Earn:</b> Once scores are approved, people can burn their NFTs
            to claim a portion of their team's ETH from the pot. They also get a
            portion of any Defifa/Juicebox governance tokens earned by the game.
          </li>
        </ol>
      </div>

      <h2 className="text-4xl md:text-4xl text-center font-medium mt-12 mb-6">
        FAQ
      </h2>
      <div className="mx-auto max-w-4xl mb-16">
        <p className="my-4 font-bold italic text-center text-lg">
          Why do we need to vote?
        </p>
        <p className="my-4" style={{ textIndent: 50 }}>
          Defifa allows anyone to make prediction games without relying on third
          parties. By using onchain voting, Defifa can stay decentralized,
          uncensorable, and permissionless.
        </p>

        <p className="my-4 font-bold italic text-center text-lg">
          How can I prevent voter manipulation?
        </p>
        <p className="my-4" style={{ textIndent: 50 }}>
          Game participants can mitigate voter manipulation risk by delegating
          their votes to trustworthy scorers. Game creators can mitigate voter
          manipulation risk by properly balancing incentives when creating
          games. In general, risk decreases as a game has more trustworthy
          participants, larger teams, and more evenly distributed rewards.
        </p>

        <p className="my-4 font-bold italic text-center text-lg">
          What does Defifa cost?
        </p>
        <p className="my-4" style={{ textIndent: 50 }}>
          When scores are approved, {IDefifa_DAO_PROTOCOL_FEE * 100}% of the pot
          goes into the Defifa treasury, and the game's participants receive
          Defifa's governance token in return. Defifa is managed by a community
          of players, developers, and supporters, and the treasury ensures a
          sustainable ecosystem where players have a say in the governance and
          growth of Defifa. See{" "}
          <Link href="https://juicebox.money/@defifa" passHref>
            <a className="underline hover:font-bold">Defifa's Juicebox</a>
          </Link>{" "}
          to learn more.
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
          transparent, and uncensorable. Nobody can delete or modify your game.
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
