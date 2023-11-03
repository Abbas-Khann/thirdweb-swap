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
import tokenImage from "../public/token.png";
import {
  SWAP_ROUTER_ADDRESS,
  TOKEN_ADDRESS,
  WETH_ADDRESS,
} from "@/const/details";
import {
  formatEther,
  formatUnits,
  parseEther,
  parseUnits,
} from "ethers/lib/utils";
import { TokenType, tokens } from "@/const/tokens";
import { Spinner } from "@chakra-ui/react";
import Image from "next/image";
import eth from "../assets/eth.png";
import bg from "../assets/bg.png";

export default function Swap() {
  const sdk = useSDK();
  const address = useAddress();
  const amountOutMin = 0;
  const amountInMax = 0;
  const [selectedToken1, setSelectedToken1] = useState(tokens[0]);
  const [selectedToken2, setSelectedToken2] = useState(tokens[2]);
  const [reserveA, setReserveA] = useState<number>(0);
  const [reserveB, setReserveB] = useState<number>(0);
  // const [amountIn, setAmountIn] = useState<number>(0);
  // const [amountOut, setAmountOut] = useState<number>(0);
  const [amountOne, setAmountOne] = useState<number>(0);
  const [amountTwo, setAmountTwo] = useState<number>(0);
  const [exactAmountIn, setExactAmountIn] = useState<boolean>(false);
  const [exactAmountOut, setExactAmountOut] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // const { contract: tokenContract } = useContract(TOKEN_ADDRESS, "token");
  const { contract: routerContract } = useContract(
    SWAP_ROUTER_ADDRESS,
    "custom"
  );
  const { data: nativeBalance } = useBalance();
  const { data: token1Balance } = useBalance(selectedToken1.address);
  const { data: token2Balance } = useBalance(selectedToken2.address);
  // const { mutateAsync: approveToken } = useContractWrite(
  //   tokenContract,
  //   "approve"
  // );

  // const { data: reserve } = useContractRead(routerContract, "getReserve", [
  //   selectedToken1,
  //   selectedToken2,
  // ]);

  //   const { mutateAsync: swapExactTokensForTokens, isLoading } = useContractWrite(
  //     routerContract,
  //     "swapExactTokensForTokens"
  //   );

  const approveToken = async (token: TokenType, amount: number) => {
    try {
      const contract = await sdk?.getContract(token.address);
      const data = await contract?.call("allowance", [
        address,
        SWAP_ROUTER_ADDRESS,
      ]);
      const approvedAmount = formatUnits(data, token.decimals);

      if (approvedAmount <= amount.toString()) {
        const tx = await contract?.call("approve", [
          SWAP_ROUTER_ADDRESS,
          parseUnits(amount.toString(), token.decimals),
        ]);
        console.log(tx);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getDeadline = () => {
    const _deadline = Math.floor(Date.now() / 1000) + 600;
    console.log(_deadline);
    return _deadline;
  };

  const handleSubmit = () => {
    const path = [selectedToken1.address, selectedToken2.address];
    try {
      if (exactAmountIn) {
        if (selectedToken1.isNative) {
          swapExactETHForTokens(amountOne, amountTwo, path);
        } else if (selectedToken2.isNative) {
          swapExactTokensForETH(amountOne, path, amountTwo);
        } else {
          swapExactTokensForTokens(amountOne, amountTwo, path);
        }
      } else if (exactAmountOut) {
        if (selectedToken1.isNative) {
          swapETHForExactTokens(amountTwo, path, amountOne);
        } else if (selectedToken2.isNative) {
          swapTokensForExactETH(amountTwo, path, amountOne);
        } else {
          swapTokensForExactTokens(amountTwo, amountOne, path);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const swapExactTokensForTokens = async (
    valueIn: number,
    valueOutMin: number,
    path: `0x${string}`[]
  ) => {
    await approveToken(selectedToken1, valueIn);
    const deadline = getDeadline();

    const tx = await routerContract?.call("swapExactTokensForTokens", [
      parseUnits(valueIn.toString(), selectedToken1.decimals),
      parseUnits(valueOutMin.toString(), selectedToken2.decimals),
      path,
      address,
      deadline,
    ]);
    console.log(tx);
  };

  const swapTokensForExactTokens = async (
    valueOut: number,
    valueInMax: number,
    path: `0x${string}`[]
  ) => {
    await approveToken(selectedToken1, valueInMax);
    const deadline = getDeadline();

    const tx = await routerContract?.call("swapTokensForExactTokens", [
      parseUnits(valueOut.toString(), selectedToken2.decimals),
      parseUnits(valueInMax.toString(), selectedToken1.decimals),

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
      [
        parseUnits(valueOut.toString(), selectedToken2.decimals),
        path,
        address,
        deadline,
      ],
      { value: parseEther(valueETH.toString()) }
    );
    console.log(tx);
  };

  const swapExactETHForTokens = async (
    valueIn: number,
    valueOutMin: number,
    path: `0x${string}`[]
  ) => {
    const deadline = getDeadline();

    const tx = await routerContract?.call(
      "swapExactETHForTokens",
      [
        parseUnits(valueOutMin.toString(), selectedToken2.decimals),
        path,
        address,
        deadline,
      ],
      { value: parseEther(valueIn.toString()) }
    );
    console.log(tx);
  };

  const swapExactTokensForETH = async (
    valueIn: number,
    path: `0x${string}`[],
    valueOutMin: number
  ) => {
    await approveToken(selectedToken1, valueIn);
    const deadline = getDeadline();

    const tx = await routerContract?.call("swapExactTokensForETH", [
      parseUnits(valueIn.toString(), selectedToken1.decimals),
      parseUnits(valueOutMin.toString(), selectedToken2.decimals),
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
    await approveToken(selectedToken1, valueIn);
    const deadline = getDeadline();

    const tx = await routerContract?.call("swapTokensForExactETH", [
      parseUnits(valueOut.toString(), selectedToken2.decimals),
      parseUnits(valueIn.toString(), selectedToken1.decimals),
      path,
      address,
      deadline,
    ]);
    console.log(tx);
  };

  const getReserves = async (tokenA: TokenType, tokenB: TokenType) => {
    const response = await routerContract?.call("getReserve", [
      tokenA.address,
      tokenB.address,
    ]);
    console.log(response);
    if (response) {
      setReserveA(Number(formatUnits(response.reserveA, tokenA.decimals)));
      setReserveB(Number(formatUnits(response.reserveB, tokenB.decimals)));
      console.log(
        formatUnits(response.reserveA, tokenA.decimals),
        formatUnits(response.reserveB, tokenB.decimals)
      );
    } // setOutAmount(_getAmount);
  };

  /// Exact Amount in , user give 1st input
  const getAmountOut = async (
    amountA: number,
    reserveA: number,
    reserveB: number
  ) => {
    if (amountA != 0) {
      const amountOut = await routerContract?.call("getAmountOut", [
        parseUnits(amountA.toString(), selectedToken1.decimals),
        parseUnits(reserveA.toString(), selectedToken1.decimals),
        parseUnits(reserveB.toString(), selectedToken2.decimals),
      ]);

      console.log(formatUnits(amountOut, selectedToken2.decimals));
      // setAmountOut(Number(formatEther(amountOut)));
      setAmountTwo(Number(formatUnits(amountOut, selectedToken2.decimals)));
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
        parseUnits(amountB.toString(), selectedToken2.decimals),
        parseUnits(reserveA.toString(), selectedToken1.decimals),
        parseUnits(reserveB.toString(), selectedToken2.decimals),
      ]);
      console.log(formatUnits(amountIn, selectedToken1.decimals));

      // setAmountIn(Number(formatEther(amountIn)));
      setAmountOne(Number(formatUnits(amountIn, selectedToken1.decimals)));
    }
  };

  useEffect(() => {
    if (
      selectedToken1 != undefined &&
      selectedToken2 != undefined &&
      selectedToken1 != selectedToken2
    ) {
      getReserves(selectedToken1, selectedToken2);
    }
  }, [selectedToken1, selectedToken2]);

  return (
    // <div className=" bg-black min-h-screen bg-gradient-to-b from-[#1b1125] to-black">
    <div className="">
      <div className=" relative  flex-col w-full min-h-[80vh] flex items-center justify-center">
        <Image
          src={bg}
          alt="bg"
          className=" absolute top-20 laptop:right-[18vw] desktop:right-[25vw] "
        />
        <div className=" laptop:mt-24 desktop:mt-10 w-[90vw] md:w-auto relative bg-[#212429] backdrop-blur-sm  bg-opacity-30 border border-slate-700 p-10 py-12  rounded-xl flex-col gap-6 flex items-center justify-center">
          <div className=" absolute top-4 left-10  text-gray-200 mr-auto text-2xl font-semibold">
            Swap
          </div>
          <div className=" pt-5 flex items-center flex-col justify-center gap-3">
            <div className=" relative md:w-full flex items-center bg-transparent border border-slate-700  rounded-2xl px-5">
              <Image
                alt=""
                src={selectedToken1.logo || "/token.png"}
                width={100}
                height={100}
                className=" w-7 h-7"
              />
              <input
                type="number"
                value={amountOne}
                onChange={(e) => {
                  setAmountOne(Number(e.target.value));
                  getAmountOut(Number(e.target.value), reserveA, reserveB);
                  setExactAmountIn(true);
                }}
                className=" text-2xl py-7 text-gray-200 font-mono bg-transparent pl-3 md:px-5 outline-none"
                placeholder="0.0"
              />
              {!selectedToken1.isNative ? (
                <button
                  className="absolute right-4 active:scale-95 transition-all ease-in-out bg-gray-200 bg-opacity-10 text-white rounded-md px-3 p-2"
                  onClick={() => {
                    setAmountOne(Number(token1Balance?.displayValue));
                    getAmountOut(
                      Number(token1Balance?.displayValue),
                      reserveA,
                      reserveB
                    );
                    setExactAmountIn(true);
                  }}
                >
                  Max
                </button>
              ) : (
                <button
                  className="absolute right-4 active:scale-95 transition-all ease-in-out bg-gray-200 bg-opacity-10 text-white rounded-md px-3 p-2"
                  onClick={() => {
                    setAmountOne(Number(nativeBalance?.displayValue));
                    getAmountOut(
                      Number(nativeBalance?.displayValue),
                      reserveA,
                      reserveB
                    );
                    setExactAmountIn(true);
                  }}
                >
                  Max
                </button>
              )}
            </div>
            <button
              className=" w-8 px-2 py-0.5 rounded-sm  active:scale-95 transition-all ease-in-out bg-gray-200 bg-opacity-10 text-white mx-auto "
              onClick={() => {
                selectedToken1 === tokens[0]
                  ? setSelectedToken1(tokens[2])
                  : setSelectedToken1(tokens[0]);

                selectedToken2 === tokens[2]
                  ? setSelectedToken2(tokens[0])
                  : setSelectedToken2(tokens[2]);
              }}
            >
              ↓
            </button>

            <div className=" relative md:w-full flex items-center bg-transparent border border-slate-700  rounded-2xl px-5">
              <Image
                alt=""
                src={selectedToken2.logo || tokenImage}
                width={100}
                height={100}
                className=" w-7 h-7"
              />
              <input
                type="number"
                value={amountTwo}
                onChange={(e) => {
                  setAmountTwo(Number(e.target.value));
                  getAmountIn(Number(e.target.value), reserveA, reserveB);
                  setExactAmountOut(true);
                }}
                className=" text-2xl py-7 text-gray-200 font-mono bg-transparent pl-3 md:px-5 outline-none"
                placeholder="0.0"
              />
              {!selectedToken2.isNative ? (
                <button
                  className="absolute right-4 active:scale-95 transition-all ease-in-out bg-gray-200 bg-opacity-10 text-white rounded-md px-3 p-2"
                  onClick={() => {
                    setAmountTwo(Number(token2Balance?.displayValue));
                    getAmountIn(
                      Number(token2Balance?.displayValue),
                      reserveA,
                      reserveB
                    );
                    setExactAmountOut(true);
                  }}
                >
                  Max
                </button>
              ) : (
                <button
                  className="absolute right-4 active:scale-95 transition-all ease-in-out bg-gray-200 bg-opacity-10 text-white rounded-md px-3 p-2"
                  onClick={() => {
                    setAmountTwo(Number(nativeBalance?.displayValue));
                    getAmountIn(
                      Number(nativeBalance?.displayValue),
                      reserveA,
                      reserveB
                    );
                    setExactAmountOut(true);
                  }}
                >
                  Max
                </button>
              )}
            </div>
          </div>

          {address ? (
            <button
              // bg-sky-500 rounded-md active:scale-95 transition-all ease-in-out  bg-gradient-to-r from-[#1b1125] to-black
              className="w-full py-4 px-6 text-2xl text-white font-semibold bg-[#8a4fc5] rounded-lg transition-all ease-in-out active:scale-95"
              onClick={handleSubmit}
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
