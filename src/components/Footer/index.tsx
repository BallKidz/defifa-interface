import styles from "./Footer.module.css";

const Footer = () => {
  const openDefifaDisclaimer = () => {
    window.open("/disclaimer/disclaimer.pdf", "_blank");
  };
  return (
    <div className={styles.container}>
      <h1 style={{ color: "var(--contentTitle)" }}>
        Defifa is an art market and governance experiment. <br></br>Defifa is
        not intended as a platform for sports gambling nor do we endorse use as
        such.
        <br></br>
        <a onClick={openDefifaDisclaimer}>Review Defifa disclaimer</a>
      </h1>
      <h1>BUILT WITH JUICEBOX, SECURED BY ETHEREUM</h1>
    </div>
  );
};

export default Footer;
