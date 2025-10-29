'use client'

import { ConnectKitProvider } from "connectkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "reactjs-popup/dist/index.css";
import "styles/globals.css";
import { WagmiProvider, createConfig, fallback, http } from "wagmi";
import {
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  mainnet,
  optimism,
  optimismSepolia,
  sepolia,
} from "viem/chains";
import { useEffect, useState } from "react";
import { farcasterMiniApp as miniAppConnector } from "@farcaster/miniapp-wagmi-connector";
import { safe, walletConnect, coinbaseWallet, metaMask, injected } from "wagmi/connectors";

const safeConnector = safe({
  allowedDomains: [/^app\.safe\.global$/],
  debug: true,
  shimDisconnect: true,
});

const chains = [
  mainnet,
  optimism,
  arbitrum,
  base,
  sepolia,
  optimismSepolia,
  baseSepolia,
  arbitrumSepolia,
] as const;

const transports = {
  [sepolia.id]: fallback([
    http("https://eth-sepolia.g.alchemy.com/v2/Y7igjs135LhJTJbYavxq9WlhuAZQVn03"),
    http(`https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID || "0f1ad790aeba4625b4d967858d7c33d0"}`),
  ]),
  [optimismSepolia.id]: fallback([
    http("https://opt-sepolia.g.alchemy.com/v2/Y7igjs135LhJTJbYavxq9WlhuAZQVn03"),
    http(`https://optimism-sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID || "0f1ad790aeba4625b4d967858d7c33d0"}`),
  ]),
  [baseSepolia.id]: fallback([
    http("https://base-sepolia.g.alchemy.com/v2/Y7igjs135LhJTJbYavxq9WlhuAZQVn03"),
    http(
      `https://api.developer.coinbase.com/rpc/v1/base-sepolia/${process.env.NEXT_PUBLIC_BASE_ID || "defifa-temp"}`,
    ),
  ]),
  [arbitrumSepolia.id]: fallback([
    http("https://arb-sepolia.g.alchemy.com/v2/Y7igjs135LhJTJbYavxq9WlhuAZQVn03"),
    http(`https://arbitrum-sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID || "0f1ad790aeba4625b4d967858d7c33d0"}`),
  ]),
  [mainnet.id]: fallback([
    http("https://eth-mainnet.g.alchemy.com/v2/Y7igjs135LhJTJbYavxq9WlhuAZQVn03"),
    http(`https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID || "0f1ad790aeba4625b4d967858d7c33d0"}`),
  ]),
  [optimism.id]: fallback([
    http("https://opt-mainnet.g.alchemy.com/v2/Y7igjs135LhJTJbYavxq9WlhuAZQVn03"),
    http(`https://optimism-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID || "0f1ad790aeba4625b4d967858d7c33d0"}`),
  ]),
  [base.id]: fallback([
    http("https://base-mainnet.g.alchemy.com/v2/Y7igjs135LhJTJbYavxq9WlhuAZQVn03"),
    http(`https://api.developer.coinbase.com/rpc/v1/base/${process.env.NEXT_PUBLIC_BASE_ID || "defifa-temp"}`),
    http(`https://base-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID || "0f1ad790aeba4625b4d967858d7c33d0"}`),
  ]),
  [arbitrum.id]: fallback([
    http("https://arb-mainnet.g.alchemy.com/v2/Y7igjs135LhJTJbYavxq9WlhuAZQVn03"),
    http(`https://arbitrum-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID || "0f1ad790aeba4625b4d967858d7c33d0"}`),
  ]),
};

export const wagmiConfig = createConfig({
  chains,
  connectors: [
    miniAppConnector(), // Farcaster Mini App connector first
    safeConnector,
    metaMask(), // MetaMask connector
    coinbaseWallet({
      appName: "Defifa",
      appLogoUrl: "https://defifa.net/assets/defifa-icon.png",
    }),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "defifa-temp-project-id",
      showQrModal: false, // Enable QR modal for better UX
      metadata: {
        name: "Defifa",
        description: "Money Games with Friends",
        url: "https://defifa.net",
        icons: ["https://defifa.net/assets/defifa-icon.png"],
      },
    }),
    injected(), // Generic injected wallet (covers most browser wallets)
  ],
  transports,
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  // Provide a fallback fillTestData function that only activates when the real one isn't available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Only set the fallback if fillTestData doesn't already exist
      if (!(window as any).fillTestData) {
        (window as any).fillTestData = () => {
          console.log("fillTestData is not available on this route");
          console.log("Navigate to /create to use fillTestData() for testing game creation");
        };
      }
    }
  }, []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          theme="midnight"
          mode="dark"
          customTheme={{
            "--ck-connectbutton-background": "#dc2626",
            "--ck-connectbutton-hover-background": "rgba(220, 38, 38, 0.8)",
            "--ck-connectbutton-active-background": "#b91c1c",
            "--ck-connectbutton-color": "#ffffff",
            "--ck-connectbutton-hover-color": "#ffffff",
            "--ck-connectbutton-active-color": "#ffffff",
            "--ck-connectbutton-border-radius": "8px",
            "--ck-connectbutton-font-weight": "600",
            "--ck-connectbutton-border": "none",
            "--ck-connectbutton-box-shadow": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          }}
          options={{
            initialChainId: 11155111, // Sepolia
            disclaimer: null,
          }}
        >
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
          <div className="text-center p-0.5 bg-yellow-500 text-black text-xs font-medium">
            EXPERIMENTAL GAMES - USE ON SEPOLIA, BASE-SEPOLIA, ARBITRUM-SEPOLIA - REPORT BUGS
          </div> 
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
