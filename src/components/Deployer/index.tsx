import QRCode from "react-qr-code";
import { useFarcaster } from "../../hooks/useFarcaster";
import Navbar from "../Navbar";
import { Logo } from "../Navbar/Logo";
import Wallet from "../Navbar/Wallet";
import MainWrapper from "../UI/MainWrapper";
import DeployerCreate from "./Create";
import styles from "./DeployerWrapper.module.css";
import DeployerDescription from "./Description";
import DeployerInfo from "./Navbar/Info";

const DeployerWrapper = () => {
  const { deepLinkUrl, fcr } = useFarcaster();

  return (
    <MainWrapper>
      <Navbar>
        <div className={styles.container}>
          <Logo src="/assets/banny-visible.svg" />
          <DeployerInfo />
          <div className={styles.buttonContainer}>
            <Wallet />
            <div
              style={{
                justifyContent: "center",
                display: "flex",
                flexDirection: "column",
                margin: "auto",
                gap: "5px",
                padding: "5px",
                border: "1px solid var(--violet)",
              }}
            >
              {fcr ? (
                <>
                  <div>Farcaster ID: {fcr.fid}</div>
                </>
              ) : (
                <>
                  <div>Log in with Farcaster</div>
                  <div
                    style={{
                      background: "white",
                      padding: "5px",
                      display: "flex",
                      margin: "auto",
                    }}
                  >
                    <QRCode value={deepLinkUrl} size={100} />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </Navbar>
      <DeployerDescription />
      <DeployerCreate fcr={fcr} />
    </MainWrapper>
  );
};

export default DeployerWrapper;
