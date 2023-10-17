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
  ConnectWallet,
  useAddress,
  useContract,
  useContractRead,
  useContractWrite,
  useSDK,
} from "@thirdweb-dev/react";
import { POOL_ADDRESS, POOL_DATA_PROVIDER_ADDRESS } from "@/const/details";
import { TokenType, loanTokens } from "@/const/tokens";
import { Select } from "@chakra-ui/react";

export default function LendBorrow() {
  const [selectedToken, setSelectedToken] = useState<TokenType>(loanTokens[1]);
  const [userBalance, setUserBalance] = useState(0);
  const [lendAmount, setLendAmount] = useState(0);
  const [borrowedAmount, setBorrowedAmount] = useState(0);

  const [supplyAmount, setSupplyAmount] = useState<number>(0);
  const [borrowAmount, setBorrowAmount] = useState<number>(0);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(0);
  const [repayAmount, setRepayAmount] = useState<number>(0);

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
      const contract = await sdk?.getContract(tokenAddress);
      const tx = await contract?.call("approve", [
        POOL_ADDRESS,
        parseUnits(amount.toString(), decimals),
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
      if (sdk) {
        const data = await sdk.wallet.balance(selectedToken.address);
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const supplyToken = async () => {
    try {
      if (supplyAmount) {
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
          parseUnits(withdrawAmount.toString(), selectedToken.decimals),
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
          parseUnits(borrowAmount.toString(), selectedToken.decimals),
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
        // setLoading(true);
        await txn.wait();
        // setLoading(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (selectedToken && address) {
      getUserReserveData();
      // getUserInfo();
    }
  }, [selectedToken && address]);

  return (
    <div className="flex flex-col justify-center items-center">
      lendBorrow
      <div className="flex flex-col items-center">
        <ConnectWallet
          className=" "
          style={{ padding: "20px 0px", fontSize: "18px", width: "100%" }}
          theme="dark"
        />
        {/* <Select value={selectedToken} onChange={(e)=>setSelectedToken(e.target.value)} placeholder='Select Token'>
          {loanTokens.map((token)=>{
            return (<option value={token.name}>{token.name}</option>)
          })}
        </Select> */}
        {selectedToken && selectedToken.name}
        {/* Display User Data along with the data for this asset */}

        <div>
          <input
            className="text-gray-200 outline-double"
            onChange={(e) => setSupplyAmount(Number(e.target.value))}
          ></input>
          <br />
          <button
            className="text-white font-semibold bg-[#8a4fc5]"
            onClick={supplyToken}
          >
            Supply
          </button>
        </div>
        <br />
        <div>
          <input
            className="text-gray-200 outline-double"
            onChange={(e) => setWithdrawAmount(Number(e.target.value))}
          ></input>
          <br />
          <button
            className="text-white font-semibold bg-[#8a4fc5]"
            onClick={withdrawToken}
          >
            withdraw
          </button>
        </div>
        <br />
        <div>
          <input
            className="text-gray-200 outline-double"
            onChange={(e) => setBorrowAmount(Number(e.target.value))}
          ></input>
          <br />
          <button
            className="text-white font-semibold bg-[#8a4fc5]"
            onClick={borrowToken}
          >
            Borrow
          </button>
        </div>
        <br />

        <div>
          <input
            className="text-gray-200 outline-double"
            onChange={(e) => setRepayAmount(Number(e.target.value))}
          ></input>
          <br />
          <button
            className="text-white font-semibold bg-[#8a4fc5]"
            onClick={repayToken}
          >
            Repay
          </button>
        </div>
      </div>
    </div>
  );
}
