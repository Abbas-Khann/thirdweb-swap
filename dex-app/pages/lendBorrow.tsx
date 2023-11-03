// Lend - Borrow

import React from "react";
import { useEffect, useState } from "react";
import {
  formatEther,
  formatUnits,
  parseEther,
  parseUnits,
} from "ethers/lib/utils";
import {
  useAddress,
  useContract,
  useContractRead,
  useSDK,
} from "@thirdweb-dev/react";
import { POOL_ADDRESS, POOL_DATA_PROVIDER_ADDRESS } from "@/const/details";
import {
  ReserveDataType,
  TokenType,
  UserDataType,
  loanTokenLink,
  loanTokens,
} from "@/const/tokens";
import { Select } from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/react";

export default function LendBorrow() {
  const [selectedToken, setSelectedToken] = useState<TokenType>(loanTokens[0]);
  const [userData, setUserData] = useState<UserDataType>();
  const [tokenInfo, setTokenInfo] = useState<ReserveDataType>();
  const [lendAmount, setLendAmount] = useState(0);
  const [borrowedAmount, setBorrowedAmount] = useState(0);
  const [supplyAmount, setSupplyAmount] = useState<number>(0);
  const [borrowAmount, setBorrowAmount] = useState<number>(0);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(0);
  const [repayAmount, setRepayAmount] = useState<number>(0);
  const [toggleSupply, setToggleSupply] = useState<boolean>(false);
  const [toggleBorrow, setToggleBorrow] = useState<boolean>(false);
  const [toggleWithdraw, setToggleWithdraw] = useState<boolean>(false);
  const [toggleRepay, setToggleRepay] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const address = useAddress();
  const sdk = useSDK();
  const { contract: poolContract } = useContract(POOL_ADDRESS, "custom");
  const { data: userAccountData } = useContractRead(
    poolContract,
    "getUserAccountData",
    [address]
  );
  const { contract: poolDataProviderContract } = useContract(
    POOL_DATA_PROVIDER_ADDRESS,
    "custom"
  );

  const approveToken = async (
    tokenAddress: `0x${string}`,
    amount: number,
    decimals: number
  ) => {
    try {
      setLoading(true);

      const contract = await sdk?.getContract(tokenAddress);
      const tx = await contract?.call("approve", [
        POOL_ADDRESS,
        parseUnits(amount.toString(), decimals),
      ]);
      console.log(tx);
      setLoading(false);
    } catch (error) {
      setLoading(false);

      console.log(error);
    }
  };

  const getUserInfo = async () => {
    try {
      if (!address) {
        console.log("NO ADDRESS FOUND");
        return;
      }
      const userData = await poolContract?.call("getUserAccountData", [
        address,
      ]);

      // https://docs.aave.com/developers/core-contracts/pool#getuseraccountdata
      console.log(userData);
    } catch (error) {
      console.log(error);
    }
  };

  const getUserReserveData = async () => {
    try {
      if (!address) {
        console.log("NO ADDRESS FOUND");
        return;
      }
      const userData = await poolDataProviderContract?.call(
        "getUserReserveData",
        [selectedToken.address, address]
      );

      // https://docs.aave.com/developers/core-contracts/aaveprotocoldataprovider#getuserreservedata
      console.log(userData);
      console.log(userAccountData);

      // get Balance of the Token in the wallet

      const data = await sdk?.wallet.balance(selectedToken.address);
      console.log(data);

      // respective to this token only
      const _totalDebt =
        Number(
          formatUnits(
            userData.currentStableDebt.toString(),
            selectedToken.decimals
          )
        ) +
        Number(
          formatUnits(
            userData.currentVariableDebt.toString(),
            selectedToken.decimals
          )
        );
      const _userData: UserDataType = {
        tokenBalance: Number(data?.displayValue),
        totalBorrowed: _totalDebt,
        totalSupplied: Number(
          formatUnits(
            userData.currentATokenBalance.toString(),
            selectedToken.decimals
          )
        ),
        availableToBorrow: Number(
          formatUnits(userAccountData.availableBorrowsBase.toString(), 8)
        ),
        healthFactor: Number(
          formatEther(userAccountData.healthFactor.toString())
        ),
      };
      console.log(_userData);

      // full account stats together
      // console.log(
      //   "Liquidity Rate",
      //   formatUnits(userData.liquidityRate.toString(), 25)
      // );
      // console.log("ltv", formatUnits(userAccountData.ltv.toString(), 7));
      // console.log(
      //   "Collateral Base",
      //   formatUnits(userAccountData.totalCollateralBase.toString(), 8)
      // );
      // console.log(
      //   "Debt base",
      //   formatUnits(userAccountData.totalDebtBase.toString(), 8)
      // );
    } catch (error) {
      console.log(error);
    }
  };

  const getReserveInfo = async () => {
    try {
      // console.log(assetAddress);
      const reserveData = await poolDataProviderContract?.call(
        "getReserveData",
        [selectedToken.address]
      );
      console.log(reserveData);

      const _totalDebt =
        Number(
          formatUnits(
            reserveData.totalStableDebt.toString(),
            selectedToken.decimals
          )
        ) +
        Number(
          formatUnits(
            reserveData.totalVariableDebt.toString(),
            selectedToken.decimals
          )
        );
      const reserveInfo: ReserveDataType = {
        assetName: selectedToken.name,
        price: "$1",
        asset: selectedToken.address,
        totalSupply: Number(
          formatUnits(
            reserveData.totalAToken.toString(),
            selectedToken.decimals
          )
        ),
        totalDebt: _totalDebt,
        totalLiquidity: Number(
          formatEther(reserveData.liquidityIndex.toString())
        ),
        borrowRateStable: Number(
          formatUnits(reserveData.stableBorrowRate.toString(), 25)
        ),
        borrowRateVariable: Number(
          formatUnits(reserveData.variableBorrowRate.toString(), 25)
        ),
        liquidityRate: Number(
          formatUnits(reserveData.liquidityRate.toString(), 25)
        ),
      };
      console.log(reserveInfo);
      // convert the data and set as per the Type defined
      // define as needed for the frontend
      // We can also get more info
      setTokenInfo(reserveInfo);
      // https://docs.aave.com/developers/core-contracts/pool#getreservedata
    } catch (error) {
      console.log(error);
    }
  };

  const supplyToken = async () => {
    try {
      if (supplyAmount) {
        setLoading(true);

        await approveToken(
          selectedToken.address,
          supplyAmount,
          selectedToken.decimals
        );
        // first param takes address of the token and second one takes amount
        const txn = await poolContract?.call("supply", [
          selectedToken.address,
          parseUnits(supplyAmount.toString(), selectedToken.decimals),
          address,
          0,
        ]);
        console.log(txn);
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);

      console.error(err);
    }
  };

  const withdrawToken = async () => {
    try {
      if (withdrawAmount) {
        setLoading(true);
        // const amountWithdraw = getWithdrawalAmount(_amount);
        // we have to check and calculate the total withdraw Amount
        // type(uint).max  for maximum available withdraw
        const txn = await poolContract?.call("withdraw", [
          selectedToken.address,
          parseUnits(withdrawAmount.toString(), selectedToken.decimals),
          address,
        ]);
        console.log(txn);
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);

      console.error(err);
    }
  };

  const borrowToken = async () => {
    try {
      setLoading(true);

      if (borrowAmount) {
        const txn = await poolContract?.call("borrow", [
          selectedToken.address,
          parseUnits(borrowAmount.toString(), selectedToken.decimals),
          1, // interest rate model
          0,
          address,
        ]);
        console.log(txn);
        setLoading(false);
        // add some toaster i guess
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  const repayToken = async () => {
    try {
      if (repayAmount) {
        setLoading(true);

        // need to find the total repay amount , along with the interest
        // Use uint(-1)  : to pay the entire loan
        await approveToken(
          selectedToken.address,
          repayAmount,
          selectedToken.decimals
        );
        const txn = await poolContract?.call("repay", [
          selectedToken.address,
          parseUnits(repayAmount.toString(), selectedToken.decimals),
          1, // interest rate model
          address,
        ]);
        console.log(txn);

        setLoading(false);
      }
    } catch (err) {
      setLoading(false);

      console.error(err);
    }
  };

  useEffect(() => {
    // console.log(selectedToken);
    if (selectedToken && address) {
      getUserReserveData();
      getReserveInfo();
    }
  }, [selectedToken || address]);

  return (
    <div className=" min-h-screen  pt-48 flex items-start justify-center">
      <div className=" grid grid-cols-12 gap-y-6 gap-x-12">
        <div className="col-span-12 items-center justify-center flex">
          <select
            onChange={(e) => setSelectedToken(loanTokenLink[e.target.value])}
            className=" laptop:min-w-[400px] text-center py-5 px-8 cursor-pointer border border-gray-400 rounded-md bg-transparent text-white"
          >
            {/* <option value="DAI">Select any token to lend</option> */}
            {loanTokens.map((loanToken) => {
              return (
                <option key={loanToken.address} value={loanToken.name}>
                  {loanToken.name}
                </option>
              );
            })}
          </select>
        </div>

        <div className=" mt-2 col-span-6 flex flex-col items-center justify-center gap-8 ">
          <div className=" py-6 px-10 laptop:min-w-[420px] flex flex-col items-stretch justify-center gap-3 text-white border border-gray-400 rounded-md ">
            <div className=" flex items-center justify-between">
              <div>Wallet Balance</div>
              <div>{userData?.tokenBalance}</div>
            </div>
            <div className=" flex items-center justify-between">
              <div>Available to supply</div>
              <div>{userData?.tokenBalance}</div>
            </div>
            <div className=" flex items-center justify-between">
              <div>Available to borrow</div>
              <div>{userData?.availableToBorrow}</div>
            </div>
          </div>
          <div className=" flex items-center justify-center gap-x-6">
            <button
              onClick={() => setToggleSupply(!toggleSupply)}
              className=" border border-gray-700 px-5 rounded-md py-3  active:scale-95 transition-all ease-in-out bg-gray-200 bg-opacity-10 text-white mx-auto "
            >
              Supply
            </button>
            <button
              onClick={() => setToggleBorrow(!toggleBorrow)}
              className=" border border-gray-700 px-5 rounded-md py-3  active:scale-95 transition-all ease-in-out bg-gray-200 bg-opacity-10 text-white mx-auto "
            >
              Borrow
            </button>
          </div>
        </div>

        <div className=" col-span-6 flex flex-col items-center justify-center gap-8 ">
          <div className=" py-6 px-10 laptop:min-w-[420px] flex flex-col items-stretch justify-center gap-3 text-white border border-gray-400 rounded-md ">
            <div className=" flex items-center justify-between">
              <div>Supplied amount</div>
              <div>{userData?.totalSupplied}</div>
            </div>
            <div className=" flex items-center justify-between">
              <div>Borrowed amount</div>
              <div>{userData?.totalBorrowed}</div>
            </div>
            <div className=" flex items-center justify-between">
              <div>Interest</div>
              <div>{tokenInfo?.borrowRateStable}</div>
            </div>
          </div>
          <div className=" flex items-center justify-center gap-x-6">
            <button
              onClick={() => setToggleWithdraw(!toggleWithdraw)}
              className=" border border-gray-700 px-5 rounded-md py-3  active:scale-95 transition-all ease-in-out bg-gray-200 bg-opacity-10 text-white mx-auto "
            >
              Withdraw
            </button>
            <button
              onClick={() => setToggleRepay(!toggleRepay)}
              className=" border border-gray-700 px-5 rounded-md py-3  active:scale-95 transition-all ease-in-out bg-gray-200 bg-opacity-10 text-white mx-auto "
            >
              Re-pay
            </button>
          </div>
        </div>

        <div className=" mt-4 col-span-12 flex flex-col items-center justify-center gap-8">
          <div className={`${toggleWithdraw ? "visible" : "hidden"} `}>
            <input
              type="number"
              id=""
              className={` mt-5 bg-gray-800 text-white border  lg:w-full border-gray-300  text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              placeholder="0"
              required
              onChange={(e) => {
                setWithdrawAmount(Number(e.target.value));
              }}
            />
            <button
              type="button"
              className="text-white w-full  mt-4 bg-[#8a4fc5]  text-md font-fredoka active:bg-[#b49af9]  font-medium rounded-sm px-5 py-2.5 mb-2"
              onClick={() => withdrawToken()}
            >
              Submit WithDraw
            </button>
          </div>
          <div className={`${toggleRepay ? "visible" : "hidden"} `}>
            <input
              type="number"
              id=""
              className={` mt-5 bg-gray-800 text-white border  lg:w-full border-gray-300  text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              placeholder="0"
              required
              onChange={(e) => {
                setRepayAmount(Number(e.target.value));
              }}
            />
            <button
              type="button"
              className="text-white w-full  mt-4 bg-[#8a4fc5]  text-md font-fredoka active:bg-[#b49af9]  font-medium rounded-sm px-5 py-2.5 mb-2"
              onClick={() => repayToken()}
            >
              Submit Repay
            </button>
          </div>

          <div className={`${toggleSupply ? "visible" : "hidden"} `}>
            <input
              type="number"
              id=""
              className={` mt-5 bg-gray-800 text-white border  lg:w-full border-gray-300  text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              placeholder="0"
              required
              onChange={(e) => {
                setSupplyAmount(Number(e.target.value));
              }}
            />
            <button
              type="button"
              className="text-white w-full  mt-4 bg-[#8a4fc5]  text-md font-fredoka active:bg-[#b49af9]  font-medium rounded-sm px-5 py-2.5 mb-2"
              onClick={() => supplyToken()}
            >
              Submit Supply
            </button>
          </div>
          <div className={`${toggleBorrow ? "visible" : "hidden"} `}>
            <input
              type="number"
              id=""
              className={` mt-5 bg-gray-800 text-white border  lg:w-full border-gray-300  text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              placeholder="0"
              required
              onChange={(e) => {
                setBorrowAmount(Number(e.target.value));
              }}
            />
            <button
              type="button"
              className="text-white w-full  mt-4 bg-[#8a4fc5]  text-md font-fredoka active:bg-[#b49af9]  font-medium rounded-sm px-5 py-2.5 mb-2"
              onClick={() => borrowToken()}
            >
              Submit Borrow
            </button>
          </div>
        </div>
        {loading && <Spinner />}
      </div>
    </div>
  );
}
