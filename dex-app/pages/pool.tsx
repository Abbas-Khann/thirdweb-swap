import React from "react";
import { useEffect, useState } from "react";
import { SWAP_ROUTER_ADDRESS } from "@/const/details";
import {
  formatEther,
  formatUnits,
  parseEther,
  parseUnits,
} from "ethers/lib/utils";
import { TokenType, tokenLink, tokens } from "@/const/tokens";
import { useAddress, useContract, useSDK } from "@thirdweb-dev/react";
import { PositionType, TokenPairType, tokenpairs } from "@/const/pair";
import { Spinner } from "@chakra-ui/react";
import toast from "react-hot-toast";

export default function Pool() {
  const [selectedToken1, setSelectedToken1] = useState(tokens[0]);
  const [selectedToken2, setSelectedToken2] = useState(tokens[2]);
  const [desiredAmountA, setDesiredAmountA] = useState(0);
  const [desiredAmountB, setDesiredAmountB] = useState(0);
  const [newPool, setNewPool] = useState(false);
  const [liquidity, setLiquidity] = useState(0);
  const [positions, setPositions] = useState<PositionType[]>();
  const [loading, setLoading] = useState<boolean>(false);

  const [reserveA, setReserveA] = useState(0);
  const [reserveB, setReserveB] = useState(0);

  const address = useAddress();
  const sdk = useSDK();
  const { contract: routerContract } = useContract(
    SWAP_ROUTER_ADDRESS,
    "custom"
  );
  //   const { mutateAsync: approveToken } = useContractWrite(
  //     tokenContract,
  //     "approve"
  //   );

  const handleAddLiquidity = () => {
    if (selectedToken1 != selectedToken2 && selectedToken1 && selectedToken2) {
      if (selectedToken1.isNative) {
        addLiquidityETH(desiredAmountB, desiredAmountA, selectedToken2);
      } else if (selectedToken2.isNative) {
        addLiquidityETH(desiredAmountA, desiredAmountB, selectedToken1);
      } else {
        addLiquidity(
          desiredAmountA,
          desiredAmountB,
          selectedToken1,
          selectedToken2
        );
      }
    }
  };

  const getDeadline = () => {
    const _deadline = Math.floor(Date.now() / 1000) + 900;
    console.log(_deadline);
    return _deadline;
  };

  const approveToken = async (token: TokenType, amount: number) => {
    try {
      setLoading(true);
      toast.loading(`Approving Tokens ....`);
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
      toast.dismiss();
      toast.success(`Successfully Approved`);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      toast.error(`${error.reason}`);

      console.log(error);
    }
  };

  const addLiquidity = async (
    valueOne: number,
    valueTwo: number,
    tokenA: TokenType,
    tokenB: TokenType
  ) => {
    try {
      setLoading(true);

      if (tokenA && tokenB && valueOne && valueTwo && address) {
        await approveToken(tokenA, valueOne);
        await approveToken(tokenB, valueTwo);
        toast.loading("Adding Token Liquidity ....");

        const _deadline = getDeadline();
        const _addLiquidity = await routerContract?.call("addLiquidity", [
          tokenA.address,
          tokenB.address,
          parseUnits(valueOne.toString(), tokenA.decimals),
          parseUnits(valueTwo.toString(), tokenB.decimals),
          1,
          1,
          address,
          _deadline, // current time + 10 mins
        ]);
        // setLoading(true);
        console.log(_addLiquidity);
        toast.dismiss();
        toast.success(`Liquidity Successfully added`);
        // setLoading(false);
      } else {
      }
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      toast.error(`${err.reason}`);
      // alert shall be changed to toast.error(err.reason) once kushagra adds it
      //   alert(err.reason);
      console.error(err);
    }
  };

  const addLiquidityETH = async (
    valueToken: number,
    valueETH: number,
    token: TokenType
  ) => {
    try {
      setLoading(true);

      if (token && valueToken && valueETH && address) {
        await approveToken(token, valueToken);
        toast.loading("Adding Token Liquidity ....");

        const _deadline = getDeadline();
        const _addLiquidity = await routerContract?.call(
          "addLiquidityETH",
          [
            token.address,
            parseUnits(valueToken.toString(), token.decimals),
            1,
            1,
            address,
            _deadline,
          ],
          { value: parseEther(valueETH.toString()) }
        );
        toast.dismiss();
        toast.success(`Liquidity Successfully added`);
        // setLoading(true);
        console.log(_addLiquidity);
        setLoading(false);
      } else {
      }
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      toast.error(`${err.reason}`);

      //   alert(err.reason);
      console.error(err);
    }
  };

  const getPositions = async () => {
    try {
      let promises: PositionType[] = [];
      const totalTokensPairs = tokenpairs.length;
      for (let i = 0; i < totalTokensPairs; i++) {
        const balance = await getLiquidity(
          tokenpairs[i].token1,
          tokenpairs[i].token2
        );
        promises.push({ ...tokenpairs[i], liquidtyAmount: Number(balance) });
      }
      const _positions = await Promise.all(promises);
      console.log(_positions);
      setPositions(_positions);
    } catch (err) {
      console.log(err);
    }
  };

  const getLiquidity = async (tokenA: TokenType, tokenB: TokenType) => {
    try {
      console.log(address, tokenA.address, tokenB.address);
      const _liquidity = await routerContract?.call("getLiquidityAmount", [
        address,
        tokenA.address,
        tokenB.address,
      ]);
      const liqAmount = formatUnits(_liquidity.toString(), 18);
      console.log(liqAmount);
      return liqAmount;
    } catch (error) {}
  };

  const handleRemoveLiquidity = (
    selectedToken1: TokenType,
    selectedToken2: TokenType
  ) => {
    if (selectedToken1 != selectedToken2 && selectedToken1 && selectedToken2) {
      if (selectedToken1.isNative) {
        removeLiquidityETH(liquidity, selectedToken2.address);
      } else if (selectedToken2.isNative) {
        removeLiquidityETH(liquidity, selectedToken1.address);
      } else {
        removeLiquidity(
          selectedToken1.address,
          selectedToken2.address,
          liquidity
        );
      }
    }
  };

  const removeLiquidity = async (
    addressTokenA: `0x${string}`,
    addressTokenB: `0x${string}`,
    liquidityAmount: number
  ) => {
    try {
      setLoading(true);

      if (addressTokenA && addressTokenB && liquidityAmount) {
        const _deadline = getDeadline();
        toast.loading("Removing Token Liquidity ....");

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
        toast.dismiss();
        toast.success(`Liquidity Successfully removed`);
        // setLoading(false);
      } else {
      }
    } catch (err: any) {
      setLoading(false);
      toast.error(`${err.reason}`);

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
      setLoading(true);

      if (addressTokenA && liquidityAmount) {
        const _deadline = getDeadline();
        toast.loading("Removing Token Liquidity ....");

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
        toast.dismiss();
        toast.success(`Liquidity Successfully removed`);
        setLoading(false);
      } else {
      }
    } catch (err: any) {
      //   alert(err.reason);
      setLoading(false);
      toast.error(`${err.reason}`);

      console.error(err);
    }
  };

  const getReserves = async (tokenA: TokenType, tokenB: TokenType) => {
    try {
      const response = await routerContract?.call("getReserve", [
        tokenA.address,
        tokenB.address,
      ]);
      if (response) {
        setReserveA(Number(formatUnits(response.reserveA, tokenA.decimals)));
        setReserveB(Number(formatUnits(response.reserveB, tokenB.decimals)));
        console.log(
          formatUnits(response.reserveA, tokenA.decimals),
          formatUnits(response.reserveB, tokenB.decimals)
        );
      }
    } catch (err) {
      console.error(err);
    }
    // setOutAmount(_getAmount);
  };

  // 3 params on this one
  const quoteB = async (
    amountA: number,
    reserveA: number,
    reserveB: number
  ) => {
    try {
      if (amountA) {
        const _fetchQuote = await routerContract?.call("quote", [
          parseUnits(amountA.toString(), selectedToken1.decimals),
          parseUnits(reserveA.toString(), selectedToken1.decimals),
          parseUnits(reserveB.toString(), selectedToken2.decimals),
        ]);
        console.log(formatUnits(_fetchQuote, selectedToken2.decimals));
        // setQuote(_fetchQuote);
        setDesiredAmountB(
          Number(formatUnits(_fetchQuote, selectedToken2.decimals))
        );
      }
    } catch (err: any) {
      // toast.error(err.reason);
      console.error(err);
    }
  };

  const quoteA = async (
    amountB: number,
    reserveA: number,
    reserveB: number
  ) => {
    try {
      if (amountB) {
        const _fetchQuote = await routerContract?.call("quote", [
          parseUnits(amountB.toString(), selectedToken2.decimals),
          parseUnits(reserveA.toString(), selectedToken1.decimals),
          parseUnits(reserveB.toString(), selectedToken2.decimals),
        ]);
        console.log(formatUnits(_fetchQuote, selectedToken1.decimals));
        // setQuote(_fetchQuote);
        setDesiredAmountA(
          Number(formatUnits(_fetchQuote, selectedToken1.decimals))
        );
      }
    } catch (err: any) {
      // toast.error(err.reason);
      console.error(err);
    }
  };

  useEffect(() => {
    if (
      selectedToken1 != undefined &&
      selectedToken2 != undefined &&
      selectedToken1 != selectedToken2 &&
      address
    ) {
      if (!reserveA && !reserveB) {
        getReserves(selectedToken1, selectedToken2);
      }
    }
  }, [selectedToken1, selectedToken2]);

  useEffect(() => {
    if (address) {
      getPositions();
    }
  }, [address]);

  return (
    <div className=" min-h-screen  pt-48 flex items-start justify-center text-white">
      <div className="relative overflow-x-auto laptop:w-8/12  mx-auto mt-5">
        <div className=" flex items-center w-full justify-between">
          <h1>Pools</h1>
          <button
            onClick={() => setNewPool((prev) => !prev)}
            className=" border border-gray-700 px-5 rounded-md py-3  active:scale-95 transition-all ease-in-out bg-blue-500 bg-opacity-10 text-white 5mx-auto "
          >
            New LP +
          </button>
        </div>
        {newPool && (
          <div className=" bg-black bg-opacity-50 backdrop-blur-md my-5 p-5 px-8 border border-gray-500 rounded-xl">
            <div className=" mb-3">Select Pair</div>
            <div className=" flex items-center justify-normal gap-4">
              <select
                onChange={(e) => setSelectedToken1(tokenLink[e.target.value])}
                className="w-full text-center py-2 px-5 cursor-pointer border border-gray-400 rounded-md bg-transparent text-white"
              >
                {tokens.map((token) => {
                  return (
                    <option key={token.address} value={token.name}>
                      {token.name}
                    </option>
                  );
                })}
              </select>
              <select
                onChange={(e) => setSelectedToken2(tokenLink[e.target.value])}
                className="  w-full text-center py-2 px-5 cursor-pointer border border-gray-400 rounded-md bg-transparent text-white"
              >
                {tokens.map((token) => {
                  return (
                    <option key={token.address} value={token.name}>
                      {token.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className=" mt-2  mb-2">Deposit Amounts Pair</div>

            <div className=" flex items-center justify-noraml w-full gap-4">
              <input
                placeholder="0"
                type="number"
                value={desiredAmountA}
                onChange={(e) => {
                  setDesiredAmountA(Number(e.target.value));
                  quoteB(Number(e.target.value), reserveA, reserveB);
                }}
                className=" w-full bg-transparent border border-gray-400 px-3 py-2 rounded-md text-white outline-none"
              />
              <input
                placeholder="0"
                type="number"
                value={desiredAmountB}
                onChange={(e) => {
                  setDesiredAmountB(Number(e.target.value));
                  quoteA(Number(e.target.value), reserveA, reserveB);
                }}
                className=" w-full bg-transparent border border-gray-400 px-3 py-2 rounded-md text-white outline-none"
              />
            </div>
            <button
              onClick={handleAddLiquidity}
              className=" w-full mt-5 border border-gray-700 px-5 rounded-md py-3  active:scale-95 transition-all ease-in-out bg-blue-500 bg-opacity-90 text-white 5mx-auto "
            >
              Add Liquidity
            </button>
          </div>
        )}
        <table className="w-full text-lg text-gray-500 dark:text-gray-400 mt-12">
          <thead className=" text-white ">
            <tr>
              <th scope="col" className="px-6 py-3">
                Token A
              </th>
              <th scope="col" className="px-6 py-3">
                Token B
              </th>
              <th scope="col" className="px-6 py-3">
                Liq. Amount
              </th>

              <th scope="col" className="px-6 py-3">
                Remove Liq.
              </th>
            </tr>
          </thead>
          <tbody>
            {positions?.map((position) => {
              return (
                <tr className=" text-sm text-center border-b border-gray-600 ">
                  <td className="px-6 py-4">{position?.token1.name}</td>
                  <td className="px-6 py-4">{position?.token2.name}</td>
                  <td className="px-6 py-4">
                    {position?.liquidtyAmount.toFixed(7)}
                  </td>
                  <td className="px-6 py-4 space-x-3">
                    <input
                      placeholder="0"
                      type="number"
                      value={liquidity}
                      onChange={(e) => {
                        setLiquidity(Number(e.target.value));
                      }}
                      className="w-1/5 bg-transparent border border-gray-400 px-3 py-2 rounded-md text-white outline-none"
                    />
                    <button
                      onClick={() =>
                        handleRemoveLiquidity(position.token1, position.token2)
                      }
                      className=" border border-gray-700 px-5 rounded-md py-3  active:scale-95 transition-all ease-in-out bg-red-500 bg-opacity-100 text-white 5mx-auto "
                    >
                      Remove Liquidity
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {loading && <Spinner />}
      </div>
    </div>
  );
}
