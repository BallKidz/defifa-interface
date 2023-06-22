import Footer from 'components/layout/Footer';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import { TopPlayersContent } from 'components/LeaderBoard/TopPlayers/TopPlayers';
import { TopHoldrsContent } from 'components/LeaderBoard/TopHodlrs/TopHodlrs';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

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
const Card: React.FC<CardProps> = ({ title, description, image, stylePlus }) => {
  return (
    <div className={`max-w-sm rounded overflow-hidden shadow-lg ${stylePlus}`}>
      <Image className="w-full" src={image} alt={title} width={300} height={300} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{title}</div>
        <p className="text-white text-base">{description}</p>
      </div>
    </div>
  );
};
interface TestimonialProps {
  quote: string;
  author: string;
  avatarSrc: string;
}

const Testimonial: React.FC<TestimonialProps> = ({ quote, author, avatarSrc }) => {
  return (
    <div className="p-4 relative">
      <div className="mb-4 text-white relative">
        <div className="p-3 rounded-lg inline-block">
          <div className="text-pink-500">
            <span className="text-6xl  absolute top-[-20px] left-[-30px]">&ldquo;</span>
            {quote}
            <span className="text-6xl  absolute bottom-[-20px] right-[-30px]">&rdquo;</span>
          </div>
        </div>
        <div className="absolute w-0 h-0 border border-transparent border-white border-bubble top-[-12px] left-[10%]"></div>
      </div>
      <div className="flex items-center">
        <div className="w-30 h-30 rounded-full mr-2 border-2 border-pink-500 overflow-hidden">
          <Image className="w-full h-full object-cover" src={avatarSrc} alt={author} width={100} height={100} />
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
      title: 'Sports with a Twist',
      description: "Forget about conventional rules and fair play. Bring chaos, hilarity, and questionable tactics to the arena. Get ready for a rollercoaster of unpredictable moments!",
      image: '/assets/banny_popcorn.png',
    },
    {
      title: 'Fundraise Like a Boss',
      description: 'Forget bake sales and car washes. Our fundraisers are epic spectacles that blend philanthropy with outrageous entertainment. Get ready to raise funds like a rockstar!',
      image: '/assets/banny_goal.png',
    },
    {
      title: "Predictions aren't hard",
      description: "Become the Nostradamus of the onchain world by accurately forecasting the future. Fortune favors the bold! Oh wait. That didn't work out so well for crypto.com.",
      image: '/assets/banny_balls.jpeg',
    },
    {
      title: 'Survivor Mode',
      description: 'Engage in fierce battles against other players and emerge as the ultimate champion. Can you handle the heat?',
      image: '/assets/banny_wow.png',
    },
    // Add more Game objects as needed
  ];
  const featuresData: FeatureData[] = [
    {
      title: 'Social Gaming',
      description: 'Trash talk your friends and foes in the live chat.',
      image: '/assets/banny_party.png',
    },
    {
      title: 'Digital Collectables',
      description: 'Collect Cards and show off your skills.',
      image: '/assets/banny_shoes.png',
    },
    {
      title: 'Play to Earn',
      description: 'Receive governance tokens for creating and playing games.',
      image: '/assets/banny_lfg.png',
    },
    // Add more Feature objects as needed
  ];
  const createGameData: CreateGameData[] = [
    {
      title: 'Put Fun back into Fundraising',
      description: "Screw boring bake sales! Raise funds for your cause while partying like there's no tomorrow.",
      image: '/assets/banny_party_2.png',
    },
    {
      title: 'Increase Community Engagement',
      description: "Other fundraisers be like: 'Please donate!' Your money games will the community buzzing like a beehive on steroids.",
      image: '/assets/banny_love.png',
    },
    {
      title: 'Be The Entrepreneur',
      description: 'Forget the corporate ladder. Climb the ranks of entrepreneurship with Defifa money games and stack those tokens!',
      image: '/assets/banny_yes.png',
    },
    // Add more Feature objects as needed
  ];
  const socialProofData: SocialProofData[] = [
    {
      quote: "Attention all gamers! Banny has discovered a gaming site that will blow your socks off like that last blunt blow my mind. It's time to level up, dominate the leaderboards, and leave your mark in gaming history!",
      author: "Juicebox Banny",
      avatarSrc: '/assets/banny_thumbsup.png',
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
    <>
      <Head>
        <title>Money Games with Friends | Defifa</title>
        <meta property="og:image" content="https://i.imgur.com/lvkXgnx.png" />
        <meta
          name="description"
          content="Defifa is an onchain gaming and governance experiment. Make your picks, load the pot and win."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <div className="relative">
          {/* Search Affordance */}
          <div className="absolute top-4 right-4">
            <Link href="/arcade">
              <a className="text-sm flex gap-2 items-center font-medium hover:underline">
                Enter arcade <ArrowRightIcon className="h-4 w-4" />
              </a>
            </Link>
          </div>
          {/* TODO use Image */}
          <Image
            className="w-full"
            src="/assets/Defifa_hero1_.png"
            alt="Hero Image"
            layout="responsive"
            width={997}
            height={608}
          />
          <div className="absolute top-4 right-4">
            <Link href="/arcade">
              <a className="text-sm flex gap-2 items-center font-medium hover:underline">
                Enter arcade <ArrowRightIcon className="h-4 w-4" />
              </a>
            </Link>
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-4xl font-bold">
            Money Games With Friends
          </div>
        </div>

        {/* Features Section */}
        <div className="text-center mt-8">
          <Link href="/about">
            <button className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded">
              Learn how to play
            </button>
          </Link>
        </div>
        <div className="container mx-auto">
          {/* <h1 className="text-4xl text-center my-8">Features text</h1> */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-lime-400">
            {featuresData.map((card, index) => (
              <Card key={index} title={card.title} description={card.description} image={card.image} stylePlus={undefined} />
            ))}
          </div>
        </div>

        {/* Game Types Section */}
        <div className="container mx-auto">
          <h1 className="text-4xl text-center my-8">Pick a game, any game.</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-lime-400">
            {gameTypesData.map((card, index) => (
              <Card key={index} title={card.title} description={card.description} image={card.image} stylePlus="border border-pink-500" />
            ))}
          </div>
        </div>
        <div className="text-center mt-8">
          <Link href="/arcade">
            <button className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded">
              Discover new games
            </button>
          </Link>
        </div>

        {/* Leaderboard Section */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-4">
          <TopPlayersContent />
          {/* Social Proof Section */}
          <div className="container mx-auto mt-8">
            {/* <h2 className="text-2xl font-bold mb-4">Social Proof Goes Here</h2> */}
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 gap-4 text-lime-400">
              {socialProofData.map((card, index) => (
                <Testimonial key={index} quote={card.quote} author={card.author} avatarSrc={card.avatarSrc} />
              ))}
            </div>
          </div>
          <TopHoldrsContent />
        </div>


        <div className="text-center mt-8">
          <Link href="/">
            <button className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded">
              Game Creator Zone (soon)
            </button>
          </Link>
        </div>
        <div className="container mx-auto">
          <h1 className="text-4xl text-center my-8"></h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-lime-400">
            {createGameData.map((card, index) => (
              <Card key={index} title={card.title} description={card.description} image={card.image} />
            ))}
          </div>
        </div>
        <div className="text-center mt-8 mb-8">
          <Link href="/">
            <button className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded">
              Create a game (soon)
            </button>
          </Link>
        </div>
      </div>
      <Footer />

    </>
  );
};

export default HomePage;
