import { ACTIVE_CHAIN, FACTORY_ADDRESS } from "@/const/details";
import "@/styles/globals.css";
import {
  ThirdwebProvider,
  coinbaseWallet,
  localWallet,
  metamaskWallet,
  safeWallet,
  smartWallet,
  walletConnect,
} from "@thirdweb-dev/react";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      clientId={process.env.NEXT_PUBLIC_CLIENT_ID}
      activeChain={ACTIVE_CHAIN}
      supportedChains={[ACTIVE_CHAIN]}
      supportedWallets={[
        metamaskWallet(),
        coinbaseWallet(),
        walletConnect(),
        safeWallet(),
        localWallet(),
        smartWallet({
          factoryAddress: FACTORY_ADDRESS,
          gasless: true,
          personalWallets: [
            metamaskWallet(),
            coinbaseWallet(),
            walletConnect(),
          ],
        }),
      ]}
    >
        <Component {...pageProps} />
    </ThirdwebProvider>
  );
}