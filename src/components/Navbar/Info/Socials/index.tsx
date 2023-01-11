import Link from "next/link";
import styles from "./Socials.module.css";

const Socials = () => {
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
        <Link href="https://www.juicebox.money/v2/p/396" passHref>
          <a target="_blank">Juicebox</a>
        </Link>
      </p>
      <p>
        <Link href="https://github.com/jbx-protocol/juice-defifa" passHref>
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
