import Head from "next/head";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import { Spinner, useToast } from "@chakra-ui/react";
import { ACTIVE_CHAIN, DEX_ADDRESS, TOKEN_ADDRESS } from "@/const/details";
import {
  ConnectWallet,
  toEther,
  toWei,
  useAddress,
  useBalance,
  useContract,
  useContractMetadata,
  useContractRead,
  useContractWrite,
  useNetworkMismatch,
  useSDK,
  useSwitchChain,
  useTokenBalance,
} from "@thirdweb-dev/react";
import { useEffect, useState } from "react";
import SwapInput from "@/components/SwapInput";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const toast = useToast();
  const address = useAddress();
  const { contract: tokenContract } = useContract(TOKEN_ADDRESS, "token");
  const { contract: dexContract } = useContract(DEX_ADDRESS, "custom");
  const { data: symbol } = useContractRead(tokenContract, "symbol");
  const { data: tokenMetadata } = useContractMetadata(tokenContract);
  const { data: tokenBalance } = useTokenBalance(tokenContract, address);
  const { data: nativeBalance } = useBalance();
  const { data: contractTokenBalance } = useTokenBalance(
    tokenContract,
    DEX_ADDRESS
  );

  const isMismatched = useNetworkMismatch();
  const switchChain = useSwitchChain();

  const sdk = useSDK();
  const [contractBalance, setContractBalance] = useState<string>("0");

  const [nativeValue, setNativeValue] = useState<string>("0");
  const [tokenValue, setTokenValue] = useState<string>("0");
  const [currentFrom, setCurrentFrom] = useState<string>("native");
  const [loading, setLoading] = useState<boolean>(false);

  const { mutateAsync: swapNativeToToken } = useContractWrite(
    dexContract,
    "swapEthTotoken"
  );
  const { mutateAsync: swapTokenToNative } = useContractWrite(
    dexContract,
    "swapTokenToEth"
  );
  const { mutateAsync: approveTokenSpending } = useContractWrite(
    tokenContract,
    "approve"
  );

  const { data: amountToGet } = useContractRead(
    dexContract,
    "getAmountOfTokens",
    currentFrom === "native"
      ? [
          toWei(nativeValue || "0"),
          toWei(contractBalance || "0"),
          contractTokenBalance?.value,
        ]
      : [
          toWei(tokenValue || "0"),
          contractTokenBalance?.value,
          toWei(contractBalance || "0"),
        ]
  );

  const fetchContractBalance = async () => {
    try {
      const balance = await sdk?.getBalance(DEX_ADDRESS);
      setContractBalance(balance?.displayValue || "0");
    } catch (err) {
      console.error(err);
    }
  };

  const executeSwap = async () => {
    setLoading(true);
    if (isMismatched) {
      switchChain(ACTIVE_CHAIN.chainId);
      setLoading(false);
      return;
    }
    try {
      if (currentFrom === "native") {
        await swapNativeToToken({ overrides: { value: toWei(nativeValue) } });
        toast({
          status: "success",
          title: "Swap Successful",
          description: `You have successfully swapped your ${
            ACTIVE_CHAIN.nativeCurrency.symbol
          } to ${symbol || "tokens"}.`,
        });
      } else {
        // Approve token spending
        await approveTokenSpending({ args: [DEX_ADDRESS, toWei(tokenValue)] });
        // Swap!
        await swapTokenToNative({ args: [toWei(tokenValue)] });
        toast({
          status: "success",
          title: "Swap Successful",
          description: `You have successfully swapped your ${
            symbol || "tokens"
          } to ${ACTIVE_CHAIN.nativeCurrency.symbol}.`,
        });
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast({
        status: "error",
        title: "Swap Failed",
        description:
          "There was an error performing the swap. Please try again.",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContractBalance();
    setInterval(fetchContractBalance, 10000);
  }, []);

  useEffect(() => {
    if (!amountToGet) return;
    if (currentFrom === "native") {
      setTokenValue(toEther(amountToGet));
    } else {
      setNativeValue(toEther(amountToGet));
    }
  }, [amountToGet]);

  return (
    <div className=" bg-black min-h-screen bg-gradient-to-b from-[#1b1125] to-black">
      <Head>
        <title>Decentralised Exchange</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <div className=" flex-col w-full min-h-[80vh] flex items-center justify-center">
        <h1 className="font-bold sm:text-6xl text-gray-300 text-4xl leading-none text-center tracking-tight mb-12 ">
          Welcome to&nbsp;
          <span
            className="!bg-clip-text text-transparent"
            style={{
              background:
                "linear-gradient(73.59deg, #C339AC 42.64%, #CD4CB5 54%, #E173C7 77.46%)",
            }}
          >
            thirdweb Swap
          </span>
        </h1>
        <div className=" relative bg-[#212429] backdrop-blur-md  bg-opacity-30 border border-slate-700 p-10 py-12  rounded-xl flex-col gap-6 flex items-center justify-center">
          <div className=" absolute top-4 left-10  text-gray-200 mr-auto text-2xl font-semibold">Swap</div>
          <div className=" pt-5 flex items-center flex-col justify-center gap-3">
            <SwapInput
              current={currentFrom}
              type="native"
              max={nativeBalance?.displayValue}
              value={nativeValue}
              setValue={setNativeValue}
              tokenImage=""
              // tokenImage={resolveIpfsUri(ACTIVE_CHAIN.icon!.url)}
            />

            <button
              className=" w-8 px-2 py-0.5 rounded-sm  active:scale-95 transition-all ease-in-out bg-gray-200 bg-opacity-10 text-white mx-auto "
              onClick={() =>
                currentFrom === "native"
                  ? setCurrentFrom("token")
                  : setCurrentFrom("native")
              }
            >
              ↓
            </button>

            <SwapInput
              current={currentFrom}
              type="token"
              max={tokenBalance?.displayValue}
              value={tokenValue}
              setValue={setTokenValue}
              tokenImage={tokenMetadata?.image}
            />
          </div>

          {address ? (
            <button
              className="w-full py-4 px-6 text-2xl text-black bg-white font-medium rounded-lg transition-all ease-in-out active:scale-95"
              onClick={executeSwap}
              disabled={loading}
            >
              {loading ? <Spinner /> : "Execute Swap"}
            </button>
          ) : (
            <ConnectWallet
              className=" "
              style={{ padding: "20px 0px", fontSize: "18px", width: "100%" }}
              theme="dark"
            />
          )}
        </div>
      </div>
    </div>
  );
}