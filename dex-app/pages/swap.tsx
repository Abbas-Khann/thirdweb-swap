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
import { formatEther, parseEther } from "ethers/lib/utils";

export default function Swap() {
  const address = useAddress();
  const amountOutMin = 1;
  const amountInMax = 1;
  const [selectedToken1, setSelectedToken1] = useState();
  const [selectedToken2, setSelectedToken2] = useState();
  const [reserveA, setReserveA] = useState<number | undefined>();
  const [reserveB, setReserveB] = useState<number | undefined>();
  const [amountIn, setAmountIn] = useState<number>(0);
  const [amountOut, setAmountOut] = useState<number>(0);
  const [amountOne, setAmountOne] = useState<number>(0);
  const [amountTwo, setAmountTwo] = useState<number>(0);
  const [exactAmountIn, setExactAmountIn] = useState<boolean>(false);
  const [exactAmountOut, setExactAmountOut] = useState<boolean>(false);

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

  // const { data: reserve } = useContractRead(routerContract, "getReserve", [
  //   selectedToken1,
  //   selectedToken2,
  // ]);

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

  const getReserves = async (tokenA: string, tokenB: string) => {
    const response = await routerContract?.call("getReserve", [tokenA, tokenB]);
    setReserveA(Number(formatEther(response.reserveA)));
    setReserveB(Number(formatEther(response.reserveB)));
    console.log(formatEther(response.reserveA), formatEther(response.reserveB));
    // setOutAmount(_getAmount);
  };

  /// Exact Amount in , user give 1st input
  const getAmountOut = async (
    amountA: number,
    reserveA: number,
    reserveB: number
  ) => {
    if (amountA != 0) {
      const amountOut = await routerContract?.call("getAmountOut", [
        parseEther(amountA.toString()),
        parseEther(reserveA.toString()),
        parseEther(reserveB.toString()),
      ]);

      console.log(formatEther(amountOut));
      setAmountOut(Number(formatEther(amountOut)));
      setAmountTwo(Number(formatEther(amountOut)));
    }
  };

  /// Exact Amount out , user give 2nd input
  const getAmountIn = async (
    amountB: number,
    reserveA: number,
    reserveB: number
  ) => {
    if (amountB != 0) {
      const amountIn = await routerContract?.call("getAmountIn", [
        parseEther(amountB.toString()),
        parseEther(reserveA.toString()),
        parseEther(reserveB.toString()),
      ]);

      console.log(formatEther(amountIn));
      setAmountIn(Number(formatEther(amountIn)));
      setAmountOne(Number(formatEther(amountIn)));
    }
  };

  useEffect(() => {
    if (
      selectedToken1 != 0 &&
      selectedToken2 != 0 &&
      selectedToken1 != selectedToken2
    ) {
      getReserves(selectedToken1, selectedToken2);
    }
  }, [selectedToken1, selectedToken2]);

  return <div>Swap</div>;
}
