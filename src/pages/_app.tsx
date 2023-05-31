import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "react-query";
import "reactjs-popup/dist/index.css";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { infuraProvider } from "wagmi/providers/infura";
import "styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  const { chains, provider } = configureChains(
    [chain.goerli],
    [
      // alchemyProvider({ apiKey: "MdEnS2hppeVnx8sqq4FvS6G3sH2HuUu4" }),
      infuraProvider({ apiKey: "738d1c1d7076486184d5d99e244873c6" }),
      // publicProvider(),
    ]
  );

  const { connectors } = getDefaultWallets({
    appName: "Defifa",
    chains,
  });

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
  });

  const queryClient = new QueryClient();

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
        </QueryClientProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
