import Container from "components/layout/Container";
import Navbar from "components/layout/Navbar";
import { NextPage } from "next";

const Explanation = () => {
  return (
    <>
      <h1 className="text-5xl md:text-5xl text-center font-medium tracking-tight mb-8 [text-shadow:_0_5px_20px_rgb(250_250_250_/_10%)]">
        How does Defifa work?
      </h1>
      <div className="text-center max-w-2xl mx-auto mb-12 text-lg">
        <p>Defifa is an on-chain gaming and governance experiment.</p>
        <p>Make your picks, load the pot, and win.</p>
      </div>
      <p className="mx-auto max-w-4xl">
        Hello, this is an explanation. Will add more text here.
      </p>
    </>
  );
};

const About: NextPage = () => {
  return (
    <Container>
      <Navbar />

      <Explanation />
    </Container>
  );
};

export default About;
