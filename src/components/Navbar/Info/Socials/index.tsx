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
        <Link href="https://wc2022.defifa.net" passHref>
          <a target="_blank">Past tournaments</a>
        </Link>
      </p>
    </div>
  );
};

export default Socials;
