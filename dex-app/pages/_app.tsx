import Navbar from "@/components/Navbar";
import { ACTIVE_CHAIN, FACTORY_ADDRESS } from "@/const/details";
import "@/styles/globals.css";
import {
  ThirdwebProvider,
  metamaskWallet,
  coinbaseWallet,
  walletConnect,
  safeWallet,
  localWallet,
  embeddedWallet,
  trustWallet,
  zerionWallet,
  rainbowWallet,
  phantomWallet,
  smartWallet,
} from "@thirdweb-dev/react";
import { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";

const smartWalletOptions = {
  factoryAddress: FACTORY_ADDRESS,
  gasless: true,
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      clientId={process.env.NEXT_PUBLIC_CLIENT_ID}
      activeChain={ACTIVE_CHAIN}
      supportedChains={[ACTIVE_CHAIN]}
      // supportedWallets={[
      //   smartWallet(metamaskWallet(), smartWalletOptions),
      //   smartWallet(coinbaseWallet(), smartWalletOptions),
      //   smartWallet(walletConnect(), smartWalletOptions),
      //   safeWallet({
      //     personalWallets: [
      //       smartWallet(metamaskWallet(), smartWalletOptions),
      //       smartWallet(coinbaseWallet(), smartWalletOptions),
      //       smartWallet(walletConnect(), smartWalletOptions),
      //       smartWallet(localWallet(), smartWalletOptions),
      //       smartWallet(embeddedWallet(), smartWalletOptions),
      //       smartWallet(trustWallet(), smartWalletOptions),
      //       smartWallet(zerionWallet(), smartWalletOptions),
      //       smartWallet(rainbowWallet(), smartWalletOptions),
      //       smartWallet(phantomWallet(), smartWalletOptions),
      //     ],
      //   }),
      //   smartWallet(localWallet(), smartWalletOptions),
      //   smartWallet(embeddedWallet(), smartWalletOptions),
      //   smartWallet(trustWallet(), smartWalletOptions),
      //   smartWallet(zerionWallet(), smartWalletOptions),
      //   smartWallet(rainbowWallet(), smartWalletOptions),
      //   smartWallet(phantomWallet(), smartWalletOptions),
      // ]}
    >
      <div className=" relative bg-black min-h-screen bg-gradient-to-b from-[#1b1125] to-black">
        <div className=" z-0  gradient absolute top-0 w-full h-full bg-no-repeat"></div>
        <div className=" relative z-50 ">
          <Navbar />
        </div>
        <Toaster position="bottom-center" reverseOrder={false} />
        <div className=" relative min-h-screen">
          <Component {...pageProps} />
        </div>
      </div>
    </ThirdwebProvider>
  );
}
