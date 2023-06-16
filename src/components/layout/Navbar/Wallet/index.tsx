import { ConnectButton } from "@rainbow-me/rainbowkit";
import Button from "components/UI/Button";

const Wallet = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button onClick={openConnectModal} category="secondary">
                    Connect
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button onClick={openChainModal} category="secondary">
                    Wrong network
                  </Button>
                );
              }

              return (
                <Button
                  onClick={openAccountModal}
                  category="secondary"
                  className="w-full"
                >
                  {account.ensName ?? account.displayName}
                </Button>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default Wallet;
