import Link from "next/link";
import styles from "./Footer.module.css";

const Footer = () => {
  const openDefifaDisclaimer = () => {
    window.open("/disclaimer/disclaimer.pdf", "_blank");
  };
  return (
    <footer className={styles.wrapper}>
      <div className={styles.container}>
        <div>
          <p>
            Defifa is an art market and governance experiment.{" "}
            <strong>
              It is not intended as a platform for sports gambling{" "}
            </strong>{" "}
            nor do we endorse such use.{" "}
            <a onClick={openDefifaDisclaimer}>Review Defifa disclaimer</a>
          </p>

          <p>Build with Juicebox. Secured by Ethereum</p>
        </div>

        <ul>
          <li>
            <Link href="https://wc2022.defifa.net" passHref>
              <a target="_blank">Past tournaments</a>
            </Link>
          </li>
          <li>
            <Link href="https://www.juicebox.money/v2/p/464" passHref>
              <a target="_blank">Juicebox</a>
            </Link>
          </li>
          <li>
            <Link href="https://github.com/ballkidz" passHref>
              <a target="_blank">Code</a>
            </Link>
          </li>
        </ul>

        <ul>
          <li>
            <Link href="https://discord.gg/hrZnvs65Nh" passHref>
              <a target="_blank">Discord</a>
            </Link>
          </li>
          <li>
            <Link
              href="https://opensea.io/collection/defifa-american-football-playoffs-2023"
              passHref
            >
              <a target="_blank">OpenSea</a>
            </Link>
          </li>
          <li>
            <Link href="https://twitter.com/Defifa420" passHref>
              <a target="_blank">Twitter</a>
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
