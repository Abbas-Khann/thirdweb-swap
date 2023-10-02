import React from "react";
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
import {
  SWAP_ROUTER_ADDRESS,
  TOKEN_ADDRESS,
  WETH_ADDRESS,
} from "@/const/details";
import { parseEther } from "ethers/lib/utils";

export default function Swap() {
  const address = useAddress();
  const amountOutMin = 1;
  const amountInMax = 1;

  const { contract: tokenContract } = useContract(TOKEN_ADDRESS, "token");
  const { contract: wethContract } = useContract(WETH_ADDRESS, "weth");
  const { contract: routerContract } = useContract(
    SWAP_ROUTER_ADDRESS,
    "custom"
  );
  const { mutateAsync: approveToken } = useContractWrite(
    tokenContract,
    "approve"
  );

  //   const { mutateAsync: swapExactTokensForTokens, isLoading } = useContractWrite(
  //     routerContract,
  //     "swapExactTokensForTokens"
  //   );

  const getDeadline = () => {
    const _deadline = Math.floor(Date.now() / 1000) + 600;
    console.log(_deadline);
    return _deadline;
  };

  const swapExactTokensForTokens = async (
    valueIn: number,
    path: `0x${string}`[]
  ) => {
    const deadline = getDeadline();

    const tx = await routerContract?.call("swapExactTokensForTokens", [
      parseEther(valueIn.toString()),
      amountOutMin,
      path,
      address,
      deadline,
    ]);
    console.log(tx);
  };

  const swapTokensForExactTokens = async (
    valueOut: number,
    path: `0x${string}`[]
  ) => {
    const deadline = getDeadline();

    const tx = await routerContract?.call("swapTokensForExactTokens", [
      parseEther(valueOut.toString()),
      amountInMax,
      path,
      address,
      deadline,
    ]);

    console.log(tx);
  };

  const swapETHForExactTokens = async (
    valueOut: number,
    path: `0x${string}`[],
    valueETH: number
  ) => {
    const deadline = getDeadline();

    const tx = await routerContract?.call(
      "swapETHForExactTokens",
      [parseEther(valueOut.toString()), path, address, deadline],
      { value: parseEther(valueETH.toString()) }
    );
    console.log(tx);
  };

  const swapExactETHForTokens = async (
    valueIn: number,
    path: `0x${string}`[]
  ) => {
    const deadline = getDeadline();

    const tx = await routerContract?.call(
      "swapExactETHForTokens",
      [amountOutMin, path, address, deadline],
      { value: parseEther(valueIn.toString()) }
    );
    console.log(tx);
  };

  const swapExactTokensForETH = async (
    valueIn: number,
    path: `0x${string}`[]
  ) => {
    const deadline = getDeadline();

    const tx = await routerContract?.call("swapExactTokensForETH", [
      parseEther(valueIn.toString()),
      amountOutMin,
      path,
      address,
      deadline,
    ]);
    console.log(tx);
  };

  const swapTokensForExactETH = async (
    valueOut: number,
    path: `0x${string}`[],
    valueIn: number
  ) => {
    // approve tokens to be sent

    const deadline = getDeadline();

    const tx = await routerContract?.call("swapTokensForExactETH", [
      parseEther(valueOut.toString()),
      parseEther(valueIn.toString()),
      path,
      address,
      deadline,
    ]);
    console.log(tx);
  };

  return <div>Swap</div>;
}
