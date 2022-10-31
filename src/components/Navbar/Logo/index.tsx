/* eslint-disable @next/next/no-img-element */
import styles from "./Logo.module.css";

export function Logo({ src }: { src: string }) {
  return (
    <div className={styles.container}>
      <img src={src} alt="Defifa" width={200} />
    </div>
  );
}
