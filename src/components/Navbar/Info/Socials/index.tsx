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
          <a target="_blank">Discord</a>
        </Link>
      </p>
      <p>
        <Link href="https://www.juicebox.money/v2/p/303" passHref>
          <a target="_blank">Juicebox</a>
        </Link>
      </p>
      <p>
        <Link href="https://twitter.com/Defifa420" passHref>
          <a target="_blank">Code</a>
        </Link>
      </p>

      <p>
        <Link href="https://twitter.com/Defifa420" passHref>
          <a target="_blank">Twitter</a>
        </Link>
      </p>
    </div>
  );
};

export default Socials;
