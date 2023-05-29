import Link from "next/link";

const Socials = () => {
  let warcastIntent = "https://warpcast.com";

  if (typeof window !== "undefined") {
    const gameLink = window.location.href;
    warcastIntent = "https://warpcast.com?intent=" + gameLink; // TODO: FC intents on the way soon??
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

      <Link href={warcastIntent} passHref>
        <a className="text-sm hover:underline" target="_blank">
          Farcaster
        </a>
      </Link>
    </div>
  );
};

export default Socials;
