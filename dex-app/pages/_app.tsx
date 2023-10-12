import { ACTIVE_CHAIN, FACTORY_ADDRESS } from "@/const/details";
import "@/styles/globals.css";
import {
  ThirdwebProvider,
  ConnectWallet,
  metamaskWallet,
  coinbaseWallet,
  walletConnect,
  safeWallet,
  localWallet,
  magicLink,
  smartWallet,
} from "@thirdweb-dev/react";
import type { AppProps } from "next/app";

const smartWalletOptions = {
  factoryAddress: "0x97EA491FA1D5d3f08C7AECcF2C6b231A8ADd66a0",
  gasless: true,
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      clientId={process.env.NEXT_PUBLIC_CLIENT_ID}
      activeChain={ACTIVE_CHAIN}
      supportedChains={[ACTIVE_CHAIN]}
      supportedWallets={[
        smartWallet(metamaskWallet({ recommended: true }), smartWalletOptions),
        smartWallet(coinbaseWallet(), smartWalletOptions),
        smartWallet(walletConnect(), smartWalletOptions),
        // smartWallet(
        //   safeWallet({
        //     personalWallets: [
        //       metamaskWallet(),
        //       coinbaseWallet(),
        //       walletConnect(),
        //     ],
        //   }),
        //   smartWalletOptions
        // ),
        smartWallet(localWallet(), smartWalletOptions),
        smartWallet(
          magicLink({
            apiKey: "YOUR_MAGIC_API_KEY",
            oauthOptions: {
              providers: ["google", "facebook", "twitter", "apple"],
            },
          }),
          smartWalletOptions
        ),
      ]}
    >
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}
