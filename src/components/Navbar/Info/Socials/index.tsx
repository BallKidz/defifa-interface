import Link from "next/link";
import styles from "./Socials.module.css";

const Socials = () => {
  return (
    <div className={styles.container}>
      <p>
        <Link
          href="https://discord.com/channels/775859454780244028/1022899568402251837"
          passHref
        >
          <a target="_blank">DISCORD</a>
        </Link>
      </p>
      <p>
        <Link href="https://twitter.com/Defifa420" passHref>
          <a target="_blank">TWITTER</a>
        </Link>
      </p>
    </div>
  );
};

export default Socials;
