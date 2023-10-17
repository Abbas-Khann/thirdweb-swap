import React from "react";
import { useEffect, useState } from "react";
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
import {
  ConnectWallet,
  useAddress,
  useContract,
  useContractWrite,
  useSDK,
} from "@thirdweb-dev/react";
import { PositionType, TokenPairType, tokenpairs } from "@/const/pair";
import { Console } from "console";

export default function Pool() {
  const [selectedToken1, setSelectedToken1] = useState(tokens[0]);
  const [selectedToken2, setSelectedToken2] = useState(tokens[1]);
  const [desiredAmountA, setDesiredAmountA] = useState(0);
  const [desiredAmountB, setDesiredAmountB] = useState(0);

  const [liquidity, setLiquidity] = useState(0);
  const [positions, setPositions] = useState<PositionType[]>();

  const [reserveA, setReserveA] = useState(0);
  const [reserveB, setReserveB] = useState(0);

  const address = useAddress();
  const sdk = useSDK();
  const { contract: tokenContract } = useContract(TOKEN_ADDRESS, "token");
  const { contract: wethContract } = useContract(WETH_ADDRESS, "custom");
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

  const addLiquidity = async (
    valueOne: number,
    valueTwo: number,
    tokenA: TokenType,
    tokenB: TokenType
  ) => {
    try {
      if (tokenA && tokenB && valueOne && valueTwo && address) {
        await approveToken(tokenA, valueOne);
        await approveToken(tokenB, valueTwo);

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
    token: TokenType
  ) => {
    try {
      if (token && valueToken && valueETH && address) {
        await approveToken(token, valueToken);

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
      const liqAmount = formatUnits(_liquidity.toString(), 6);
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
      if (addressTokenA && addressTokenB && liquidityAmount) {
        const _deadline = getDeadline();
        const _removeLiquidity = await routerContract?.call("removeLiquidity", [
          addressTokenA,
          addressTokenB,
          parseUnits(liquidityAmount.toString(), 6),
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
            parseUnits(liquidityAmount.toString(), 6),
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

  const getReserves = async (tokenA: TokenType, tokenB: TokenType) => {
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
    } catch (err) {
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
          parseUnits(reserveB.toString(), selectedToken2.decimals),
          parseUnits(reserveA.toString(), selectedToken1.decimals),
        ]);
        console.log(formatUnits(_fetchQuote, selectedToken1.decimals));
        // setQuote(_fetchQuote);
        setDesiredAmountA(
          Number(formatUnits(_fetchQuote, selectedToken1.decimals))
        );
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
    <div className="flex flex-col justify-center items-center">
      pool
      <div className="flex flex-col items-center">
        <ConnectWallet
          className=" "
          style={{ padding: "20px 0px", fontSize: "18px", width: "100%" }}
          theme="dark"
        />
        <div>
          {selectedToken1 && selectedToken1.name}
          <br />
          <input
            type="number"
            value={desiredAmountA}
            className="text-gray-200 outline-double"
            onChange={(e) => {
              setDesiredAmountA(Number(e.target.value));
              quoteB(Number(e.target.value), reserveA, reserveB);
            }}
          ></input>
          <br />
        </div>
        <br />
        <div>
          {selectedToken2 && selectedToken2.name}
          <br />
          <input
            type="number"
            value={desiredAmountB}
            className="text-gray-200 outline-double"
            onChange={(e) => {
              setDesiredAmountB(Number(e.target.value));
              quoteA(Number(e.target.value), reserveA, reserveB);
            }}
          ></input>
          <br />
        </div>
        <div>
          <button
            className="text-white font-semibold bg-[#8a4fc5]"
            onClick={handleAddLiquidity}
          >
            Add Liquidity & create Pair
          </button>
        </div>
      </div>
      <div className="flex flex-col items-center">
        {positions?.map((position) => {
          return (
            <>
              <div>
                {position && position.token1.name} -{" "}
                {position && position.token2.name} : {position.liquidtyAmount}
                <br />
              </div>
              <br />
              <div>
                <input
                  type="number"
                  className="text-gray-200 outline-double"
                  onChange={(e) => {
                    setLiquidity(Number(e.target.value));
                  }}
                ></input>
                <button
                  className="text-white font-semibold bg-[#8a4fc5]"
                  onClick={() =>
                    handleRemoveLiquidity(position.token1, position.token2)
                  }
                >
                  Remove Liquidity
                </button>
              </div>
            </>
          );
        })}
      </div>
    </div>
  );
}
