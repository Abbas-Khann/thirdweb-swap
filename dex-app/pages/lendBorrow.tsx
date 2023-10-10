// Lend - Borrow

import React from "react";
import { useEffect, useState } from "react";
import { formatEther, parseEther } from "ethers/lib/utils";
import {
  useAddress,
  useContract,
  useContractRead,
  useContractWrite,
  useSDK,
} from "@thirdweb-dev/react";
import { POOL_ADDRESS, POOL_DATA_PROVIDER_ADDRESS } from "@/const/details";
import { TokenType, loanTokens } from "@/const/tokens";

export default function lendBorrow() {
  const [selectedToken, setSelectedToken] = useState<TokenType>(loanTokens[0]);
  const [userBalance, setUserBalance] = useState(0);
  const [lendAmount, setLendAmount] = useState(0);
  const [borrowedAmount, setBorrowedAmount] = useState(0);

  const [supplyAmount, setSupplyAmount] = useState(0);
  const [borrowAmount, setBorrowAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [repayAmount, setRepayAmount] = useState(0);

  const address = useAddress();
  const sdk = useSDK();
  const { contract: poolContract } = useContract(POOL_ADDRESS, "custom");
  const { data: stakingTokenBalance } = useContractRead(
    poolContract,
    "getUserAccountData",
    [address]
  );
  const { contract: poolDataProviderContract } = useContract(
    POOL_DATA_PROVIDER_ADDRESS,
    "custom"
  );

  const approveToken = async (tokenAddress: `0x${string}`, amount: number) => {
    try {
      const contract = await sdk?.getContract(tokenAddress);
      const tx = await contract?.call("approve", [
        POOL_ADDRESS,
        parseEther(amount.toString()),
      ]);
      console.log(tx);
    } catch (error) {
      console.log(error);
    }
  };

  const getReserveInfo = async () => {
    try {
      const reserveData = await poolContract?.call("getReserveData", [
        selectedToken.address,
      ]);
      console.log(reserveData);
      // https://docs.aave.com/developers/core-contracts/pool#getreservedata
    } catch (error) {
      console.log(error);
    }
  };

  const getUserInfo = async () => {
    try {
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
      const userData = await poolDataProviderContract?.call(
        "getUserReserveData",
        [selectedToken.address, address]
      );

      // https://docs.aave.com/developers/core-contracts/aaveprotocoldataprovider#getuserreservedata
      console.log(userData);
    } catch (error) {
      console.log(error);
    }
  };

  const supplyToken = async () => {
    try {
      if (supplyAmount) {
        await approveToken(selectedToken.address, supplyAmount);
        // first param takes address of the token and second one takes amount
        const txn = await poolContract?.call("supply", [
          selectedToken.address,
          parseEther(supplyAmount.toString()),
          address,
          0,
        ]);
        // setLoading(true);
        console.log(txn);
        // setLoading(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const withdrawToken = async () => {
    try {
      if (withdrawAmount) {
        // const amountWithdraw = getWithdrawalAmount(_amount);
        // we have to check and calculate the total withdraw Amount
        // type(uint).max  for maximum available withdraw
        const txn = await poolContract?.call("withdraw", [
          selectedToken.address,
          parseEther(withdrawAmount.toString()),
          address,
        ]);
        // setLoading(true);
        console.log(txn);
        // setLoading(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const borrowToken = async () => {
    try {
      if (borrowAmount) {
        const txn = await poolContract?.call("borrow", [
          selectedToken.address,
          parseEther(withdrawAmount.toString()),
          1, // interest rate model
          0,
          address,
        ]);
        // setLoading(true);
        console.log(txn);
        // setLoading(false);
        // add some toaster i guess
      }
    } catch (err) {
      console.error(err);
    }
  };

  const repayToken = async () => {
    try {
      if (repayAmount) {
        // need to find the total repay amount , along with the interest
        // Use uint(-1)  : to pay the entire loan
        await approveToken(selectedToken.address, repayAmount);
        const txn = await poolContract?.call("repay", [
          selectedToken.address,
          parseEther(withdrawAmount.toString()),
          1, // interest rate model
          address,
        ]);
        // setLoading(true);
        await txn.wait();
        // setLoading(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return <div>lendBorrow</div>;
}
