'use client'

import Footer from "components/layout/Footer";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { TopPlayersContent } from "components/LeaderBoard/TopPlayers/TopPlayers";
import { TopHoldrsContent } from "components/LeaderBoard/TopHodlrs/TopHodlrs";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Button from "components/UI/Button";
import Navbar from "components/layout/Navbar";
import Container from "components/layout/Container";

interface GameTypesData {
  title: string;
  description: string;
  image: string;
}
interface FeatureData {
  title: string;
  description: string;
  image: string;
}
interface CreateGameData {
  title: string;
  description: string;
  image: string;
}
interface SocialProofData {
  avatarSrc: string;
  quote: string;
  author: string;
}
interface CardProps {
  title: string;
  description: string;
  image: string;
  stylePlus?: string;
}
// Card component
const Card: React.FC<CardProps> = ({
  title,
  description,
  image,
  stylePlus,
}) => {
  return (
    <div className={`max-w-sm rounded overflow-hidden shadow-lg ${stylePlus}`}>
      {/* <Image className="w-full" src={image} alt={title} width={300} height={300} /> */}
      <div className="px-6 py-4">
        <div className="font-medium text-xl mb-2">{title}</div>
        <p
          className="text-white text-base"
          dangerouslySetInnerHTML={{ __html: description }}
        ></p>
      </div>
    </div>
  );
};
interface TestimonialProps {
  quote: string;
  author: string;
  avatarSrc: string;
}

const Testimonial: React.FC<TestimonialProps> = ({
  quote,
  author,
  avatarSrc,
}) => {
  return (
    <div className="p-4 relative">
      <div className="mb-4 text-white relative">
        <div className="p-3 rounded-lg inline-block">
          <div className="text-pink-500">
            <span className="text-6xl  absolute top-[-20px] left-[-30px]">
              &ldquo;
            </span>
            {quote}
            <span className="text-6xl  absolute bottom-[-20px] right-[-30px]">
              &rdquo;
            </span>
          </div>
        </div>
        <div className="absolute w-0 h-0 border border-transparent border-white border-bubble top-[-12px] left-[10%]"></div>
      </div>
      <div className="flex items-center">
        <div className="w-30 h-30 rounded-full mr-2 border-2 border-pink-500 overflow-hidden">
          <Image
            className="w-full h-full object-cover"
            src={avatarSrc}
            alt={author}
            width={100}
            height={100}
          />
        </div>
        <div>{author}</div>
      </div>
    </div>
  );
};

// Home page component
const HomePage = () => {
  // Sample data for the gallery
  const gameTypesData: GameTypesData[] = [
    {
      title: "Sports with a Twist",
      description:
        "Forget about conventional rules and fair play. Bring chaos, hilarity, and questionable tactics to the arena. Get ready for a rollercoaster of unpredictable moments!",
      image: "/assets/banny_popcorn.png",
    },
    {
      title: "Fundraise Like a Boss",
      description:
        "Forget bake sales and car washes. Our fundraisers are epic spectacles that blend philanthropy with outrageous entertainment. Get ready to raise funds like a rockstar!",
      image: "/assets/banny_goal.png",
    },
    {
      title: "Predictions aren't hard",
      description:
        "Become the Nostradamus of the onchain world by accurately forecasting the future. Fortune favors the bold! Oh wait. That didn't work out so well for crypto.com.",
      image: "/assets/banny_balls.jpeg",
    },
    {
      title: "Survivor Mode",
      description:
        "Engage in fierce battles against other players and emerge as the ultimate champion. Can you handle the heat?",
      image: "/assets/banny_wow.png",
    },
    // Add more Game objects as needed
  ];
  const featuresData: FeatureData[] = [
    {
      title: "Social Gaming",
      description: "Trash talk your friends and foes in the live chat.",
      image: "/assets/banny_party.png",
    },
    {
      title: "Digital Collectables",
      description: "Collect Cards and show off your skills.",
      image: "/assets/banny_shoes.png",
    },
    {
      title: "Play to Earn",
      description: "Receive governance tokens for creating and playing games.",
      image: "/assets/banny_lfg.png",
    },
    // Add more Feature objects as needed
  ];
  const createGameData: CreateGameData[] = [
    {
      title: "Put Fun back into Fundraising",
      description:
        "Screw boring bake sales! Raise funds for your cause while partying like there's no tomorrow.",
      image: "/assets/banny_party_2.png",
    },
    {
      title: "Increase Community Engagement",
      description:
        "Other fundraisers be like: 'Please donate!' Your money games will have the community buzzing like a beehive on steroids.",
      image: "/assets/banny_love.png",
    },
    {
      title: "Be The Entrepreneur",
      description:
        'Forget the corporate ladder. Climb the ranks of <a href="https://jango.eth.limo/9E01E72C-6028-48B7-AD04-F25393307132/" class="text-lime-500">Retailism</a> with Defifa money games and stack those tokens!',
      image: "/assets/banny_yes.png",
    },
    // Add more Feature objects as needed
  ];
  const socialProofData: SocialProofData[] = [
    {
      quote:
        "Attention all gamers! Banny has discovered a gaming site that will blow your socks off like that last blunt blow my mind. It's time to level up, dominate the leaderboards, and leave your mark in gaming history!",
      author: "Juicebox Banny",
      avatarSrc: "/assets/banny_thumbsup.png",
    },
    /*         {
                quote: "Hold on to your controllers, folks! Banny's found a gaming site that's out of this world. Get ready to unleash your inner gamer and conquer new levels of awesomeness!",
                author: "DAO Banny",
                avatarSrc: '/assets/banny_dao.png',
            }, */
    /*         {
                quote: "Yo gamers, Banny here! This gaming site is off the charts! Prepare for mind-blowing graphics, addictive gameplay, and the ultimate gaming experience. Let's get our game on!",
                author: "Blockchain Banny",
                avatarSrc: '/assets/banny_blockchain.png',
            },
            {
                quote: "Yo gamers, Banny here! This gaming site is off the charts! Prepare for mind-blowing graphics, addictive gameplay, and the ultimate gaming experience. Let's get our game on!",
                author: "Blockchain Banny",
                avatarSrc: '/assets/banny_blockchain.png',
            }, */
    // Add more Game objects as needed
  ];

  return (
    <main>
      <Container>
        <Navbar />
        <div className="pt- pb-52 px-10 text-center">
          <h1 className="text-5xl md:text-7xl font-medium text-center !leading-snug">
            Money Games With Friends
          </h1>
          <p className="text-2xl text-center mt-4 mb-12">
              Players decide the outcome. Winners earn the pot.
          </p>

          <Link href="/arcade">
            <Button size="lg">
              Enter <ArrowRightIcon className="h-4 w-4 ml-2 inline-block" />
            </Button>
          </Link>
        </div>
        <TopPlayersContent />
        <Footer />
      </Container>
    </main>
  );
};

export default HomePage;
