import Link from "next/link";
import styles from "./Socials.module.css";

const Socials = () => {    
  let warcastIntent = "https://warpcast.com";

  if (typeof window !== "undefined") {
    const gameLink = window.location.href;
    warcastIntent = "https://warpcast.com?intent="+gameLink; // TODO: FC intents on the way soon??
  } else {
    warcastIntent = "https://warpcast.com";
  }

  return (
    <div className={styles.container}>
      <p>
        <Link href="https://discord.gg/hrZnvs65Nh" passHref>
          <a target="_blank">Discord</a>
        </Link>
      </p>
      <p>
        <Link
          href="https://opensea.io/collection/defifa-american-football-playoffs-2023"
          passHref
        >
          <a target="_blank">OpenSea</a>
        </Link>
      </p>

      <p>
        <Link href={warcastIntent} passHref>
          <a target="_blank">Farcaster</a>
        </Link>
      </p>
    </div>
  );
};

export default Socials;
