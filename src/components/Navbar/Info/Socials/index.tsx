import Link from "next/link";

const Socials = () => {
  let warcastIntent = "https://warpcast.com";

  if (typeof window !== "undefined") {
    const gameLink = window.location.href;
    // warcastIntent = "https://warpcast.com?intent=" + gameLink; // TODO: FC intents on the way soon??
    warcastIntent = "https://warpcast.com";
  } else {
    warcastIntent = "https://warpcast.com";
  }

  return (
    <div className="flex gap-8">
      <Link href="https://discord.gg/hrZnvs65Nh" passHref>
        <a className="text-sm hover:underline" target="_blank">
          Discord
        </a>
      </Link>
    EXPERIMENTAL GAMES - USE ON GOERLI - REPORT BUGS
     {/*  <Link href={warcastIntent} passHref>
        <a className="text-sm hover:underline" target="_blank">
          Farcaster
        </a>
      </Link> */}
    </div>
  );
};

export default Socials;
