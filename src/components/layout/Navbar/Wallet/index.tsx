import { ConnectKitButton } from "connectkit";
import Button from "components/UI/Button";
import { MiniAppWallet } from "./MiniAppWallet";
import { useFarcasterContext } from "hooks/useFarcasterContext";

const Wallet = () => {
  const { isInMiniApp } = useFarcasterContext();

  // If we're in a Mini App, use the Mini App wallet component
  if (isInMiniApp === true) {
    return <MiniAppWallet />;
  }

  // For web users, use ConnectKit's ConnectKitButton with custom styling
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, isConnecting, show, hide, address, ensName, chain }) => {
        const ready = true; // ConnectKit is always ready
        const connected = ready && isConnected && address && chain;

        return (
          <div
            {...(!ready ? {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            } : {})}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button onClick={show} category="secondary">
                    Connect
                  </Button>
                );
              }

              if (chain?.unsupported) {
                return (
                  <Button onClick={show} category="secondary">
                    Wrong network
                  </Button>
                );
              }

              return (
                <Button
                  onClick={show}
                  category="secondary"
                  className="w-full"
                >
                  {ensName ?? `${address?.slice(0, 6)}...${address?.slice(-4)}`}
                </Button>
              );
            })()}
          </div>
        );
      }}
    </ConnectKitButton.Custom>
  );
};

export default Wallet;
