import Link from "next/link";
import Button from "components/UI/Button";
import { Logo } from "../Logo";
import Wallet from "../Wallet";
import styles from "./Info.module.css";
import Socials from "./Socials";

const Info = ({ withCreateButton }: { withCreateButton?: boolean }) => {
  return (
    <div className={styles.container}>
      <Link href="/">
        <a>
          <Logo src="/assets/defifa.svg" />
        </a>
      </Link>
      <Socials />

      <div className={styles.buttonContainer} style={{ marginLeft: "auto" }}>
        {withCreateButton ? (
          <Link href="/create">
            <div>
              <Button color="var(--gold)">Create game</Button>
            </div>
          </Link>
        ) : null}

        <Wallet />
      </div>
    </div>
  );
};

export default Info;
