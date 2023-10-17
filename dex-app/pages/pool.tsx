import React from "react";
import { useEffect, useState } from "react";
import {
  SWAP_ROUTER_ADDRESS,
  TOKEN_ADDRESS,
  WETH_ADDRESS,
} from "@/const/details";
import { formatEther, parseEther } from "ethers/lib/utils";
import { tokens } from "@/const/tokens";
import {
  useAddress,
  useContract,
  useContractWrite,
  useSDK,
} from "@thirdweb-dev/react";
import { TokenPairType } from "@/const/pair";

export default function Pool() {
  const [selectedToken1, setSelectedToken1] = useState(tokens[0]);
  const [selectedToken2, setSelectedToken2] = useState(tokens[0]);
  const [desiredAmountA, setDesiredAmountA] = useState(0);
  const [desiredAmountB, setDesiredAmountB] = useState(0);

  const [liquidity, setLiquidity] = useState();
  const [positions, setPositions] = useState();

  const [reserveA, setReserveA] = useState(0);
  const [reserveB, setReserveB] = useState(0);

  const address = useAddress();
  const sdk = useSDK();
  const { contract: tokenContract } = useContract(TOKEN_ADDRESS, "token");
  const { contract: wethContract } = useContract(WETH_ADDRESS, "weth");
  const { contract: routerContract } = useContract(
    SWAP_ROUTER_ADDRESS,
    "custom"
  );
  //   const { mutateAsync: approveToken } = useContractWrite(
  //     tokenContract,
  //     "approve"
  //   );

  const handleLiquidity = () => {};

  const getDeadline = () => {
    const _deadline = Math.floor(Date.now() / 1000) + 900;
    console.log(_deadline);
    return _deadline;
  };

  const approveToken = async (tokenAddress: `0x${string}`, amount: number) => {
    try {
      const contract = await sdk?.getContract(tokenAddress);
      const tx = await contract?.call("approve", [
        SWAP_ROUTER_ADDRESS,
        parseEther(amount.toString()),
      ]);
      console.log(tx);
    } catch (error) {
      console.log(error);
    }
  };

  const addLiquidity = async (
    valueOne: number,
    valueTwo: number,
    addressTokenA: `0x${string}`,
    addressTokenB: `0x${string}`
  ) => {
    try {
      if (addressTokenA && addressTokenB && valueOne && valueTwo && address) {
        await approveToken(addressTokenA, valueOne);
        await approveToken(addressTokenB, valueTwo);

        const _deadline = getDeadline();
        const _addLiquidity = await routerContract?.call("addLiquidity", [
          addressTokenA,
          addressTokenB,
          parseEther(valueOne.toString()),
          parseEther(valueTwo.toString()),
          1,
          1,
          address,
          _deadline, // current time + 10 mins
        ]);
        // setLoading(true);
        console.log(_addLiquidity);

        // setLoading(false);
      } else {
      }
    } catch (err) {
      // alert shall be changed to toast.error(err.reason) once kushagra adds it
      //   alert(err.reason);
      console.error(err);
    }
  };

  const addLiquidityETH = async (
    valueToken: number,
    valueETH: number,
    addressToken: `0x${string}`
  ) => {
    try {
      if (addressToken && valueToken && valueETH && address) {
        await approveToken(addressToken, valueToken);

        const _deadline = getDeadline();
        const _addLiquidity = await routerContract?.call(
          "addLiquidity",
          [
            addressToken,
            parseEther(valueToken.toString()),
            1,
            1,
            address,
            _deadline,
          ],
          { value: parseEther(valueETH.toString()) }
        );
        // setLoading(true);
        console.log(_addLiquidity);
        // setLoading(false);
      } else {
      }
    } catch (err) {
      //   alert(err.reason);
      console.error(err);
    }
  };

  //   const getPositions = async () => {
  //     try {
  //       const promises = [];

  //       for (let i = 0; i < 3; i++) {

  //         const tokenPair: TokenPairType = {
  //             token1: selectedToken1,
  //             token2:selectedToken2,
  //             pair: "0x1904C6Ff3DE8Cfb37488ED904C0577d0a3E7A515",
  //             balance: 0
  //           }

  //         const balance = getLiquidity(
  //           tokenpairs[i].token1,
  //           tokenpairs[i].token2
  //         );
  //         promises.push({ ...tokenpairs[i], balance });
  //       }

  //       const _positions = await Promise.all(promises);
  //       console.log(_positions);
  //       setPositions(_positions);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };

  const getLiquidity = async (
    addressTokenA: `0x${string}`,
    addressTokenB: `0x${string}`
  ) => {
    const _liquidity = await routerContract?.call("getLiquidityAmount", [
      address,
      addressTokenA,
      addressTokenB,
    ]);
    const liqAmount = formatEther(_liquidity.toString());
    console.log(liqAmount);
    return liqAmount;
  };

  const removeLiquidity = async (
    addressTokenA: `0x${string}`,
    addressTokenB: `0x${string}`,
    liquidityAmount: number
  ) => {
    try {
      if (addressTokenA && addressTokenB && liquidityAmount) {
        const _deadline = getDeadline();
        const _removeLiquidity = await routerContract?.call("removeLiquidity", [
          addressTokenA,
          addressTokenB,
          parseEther(liquidityAmount.toString()),
          1,
          1,
          address,
          _deadline, // current time + 10 mins
        ]);
        // setLoading(true);
        console.log(_removeLiquidity);
        // setLoading(false);
      } else {
      }
    } catch (err) {
      // alert shall be changed to toast.error(err.reason) once kushagra adds it
      //   alert(err.reason);
      console.error(err);
    }
  };

  const removeLiquidityETH = async (
    liquidityAmount: number,
    addressTokenA: `0x${string}`
  ) => {
    try {
      if (addressTokenA && liquidityAmount) {
        const _deadline = getDeadline();
        const _removeLiquidity = await routerContract?.call(
          "removeLiquidityETH",
          [
            addressTokenA,
            parseEther(liquidityAmount.toString()),
            1,
            1,
            address,
            _deadline,
          ]
        );
        // setLoading(true);
        console.log(_removeLiquidity);
        // setLoading(false);
      } else {
      }
    } catch (err) {
      //   alert(err.reason);
      console.error(err);
    }
  };

  const getReserves = async (tokenA: `0x${string}`, tokenB: `0x${string}`) => {
    const response = await routerContract?.call("getReserve", [tokenA, tokenB]);
    setReserveA(Number(formatEther(response.reserveA)));
    setReserveB(Number(formatEther(response.reserveB)));
    console.log(formatEther(response.reserveA), formatEther(response.reserveB));
    // setOutAmount(_getAmount);
  };

  // 3 params on this one
  const quoteB = async (
    amountA: number,
    reserveA: `0x${string}`,
    reserveB: `0x${string}`
  ) => {
    try {
      if (amountA) {
        const _fetchQuote = await routerContract?.call("quote", [
          parseEther(amountA.toString()),
          parseEther(reserveA.toString()),
          parseEther(reserveB.toString()),
        ]);
        console.log(formatEther(_fetchQuote));
        // setQuote(_fetchQuote);
        setDesiredAmountB(Number(formatEther(_fetchQuote)));
      }
    } catch (err) {
      // toast.error(err.reason);
      console.error(err);
    }
  };

  const quoteA = async (
    amountB: number,
    reserveA: `0x${string}`,
    reserveB: `0x${string}`
  ) => {
    try {
      if (amountB) {
        const _fetchQuote = await routerContract?.call("quote", [
          parseEther(amountB.toString()),
          parseEther(reserveB.toString()),
          parseEther(reserveA.toString()),
        ]);
        console.log(formatEther(_fetchQuote));
        // setQuote(_fetchQuote);
        setDesiredAmountA(Number(formatEther(_fetchQuote)));
      }
    } catch (err) {
      // toast.error(err.reason);
      console.error(err);
    }
  };

  useEffect(() => {
    if (
      selectedToken1 != undefined &&
      selectedToken2 != undefined &&
      selectedToken1 != selectedToken2
    ) {
      getReserves(selectedToken1.address, selectedToken2.address);
    }
  }, [selectedToken1, selectedToken2]);

  return <div>pool</div>;
}
