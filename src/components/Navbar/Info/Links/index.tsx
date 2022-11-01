import styles from "./Links.module.css";
import DeployerRoute from "./Routes/Deployer";
import Discord from "./Socials/Discord";

const Links = () => {
  return (
    <div className={styles.container}>
      <Discord />
      <DeployerRoute />
    </div>
  );
};

export default Links;
