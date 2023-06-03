import {
  darkTheme,
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "reactjs-popup/dist/index.css";
import "styles/globals.css";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { infuraProvider } from "wagmi/providers/infura";

function MyApp({ Component, pageProps }: AppProps) {
  const { chains, provider } = configureChains(
    [chain.goerli],
    [infuraProvider({ apiKey: "0f1ad790aeba4625b4d967858d7c33d0" })]
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
      <RainbowKitProvider
        theme={darkTheme({ accentColor: "#7c3aed" })}
        chains={chains}
      >
        <QueryClientProvider client={queryClient}>
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
          <div className="text-center p-1 bg-yellow-500 text-black text-sm font-medium">
            EXPERIMENTAL GAMES - USE ON GOERLI - REPORT BUGS
          </div>
          <Component {...pageProps} />
        </QueryClientProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
