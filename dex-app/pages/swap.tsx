import React from "react";
import Head from "next/head";
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
import eth from "../assets/eth.png";
import bg from "../assets/bg.png";
import Image from "next/image";

export default function Swap() {
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
    // <div className=" bg-black min-h-screen bg-gradient-to-b from-[#1b1125] to-black">
    <div className="">
      <div className=" relative  flex-col w-full min-h-[80vh] flex items-center justify-center">
        <Image src={bg} alt="bg" className=" absolute top-20 laptop:right-[18vw] desktop:right-[25vw] " />
        <div className=" laptop:mt-24 desktop:mt-10 w-[90vw] md:w-auto relative bg-[#212429] backdrop-blur-sm  bg-opacity-30 border border-slate-700 p-10 py-12  rounded-xl flex-col gap-6 flex items-center justify-center">
          <div className=" absolute top-4 left-10  text-gray-200 mr-auto text-2xl font-semibold">
            Swap
          </div>
          <div className=" pt-5 flex items-center flex-col justify-center gap-3">
            <SwapInput
              current={currentFrom}
              type="native"
              max={nativeBalance?.displayValue}
              value={nativeValue}
              setValue={setNativeValue}
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
              // tokenImage={tokenMetadata?.image}
              tokenImage={eth}
            />
          </div>

          {address ? (
            <button
              // bg-sky-500 rounded-md active:scale-95 transition-all ease-in-out  bg-gradient-to-r from-[#1b1125] to-black
              className="w-full py-4 px-6 text-2xl text-white font-semibold bg-[#8a4fc5] rounded-lg transition-all ease-in-out active:scale-95"
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
