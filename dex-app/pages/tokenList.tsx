import { useEffect, useState } from "react";
import { formatEther, formatUnits, parseEther } from "ethers/lib/utils";
// import { tokens } from "@/const/tokens";
import {
  toWei,
  useActiveClaimConditionForWallet,
  useAddress,
  useClaimerProofs,
  useContract,
  useContractRead,
  useContractWrite,
  useSDK,
  useTokenSupply,
} from "@thirdweb-dev/react";
import React from "react";
import { POOL_DATA_PROVIDER_ADDRESS, STAKING_TOKEN } from "@/const/details";
import { ReserveDataType, loanTokens } from "@/const/tokens";
interface Data {
  token: string;
  price: string;
  change: string;
  tvl: string;
  volume: string;
}
import { Spinner } from "@chakra-ui/react";
import toast from "react-hot-toast";
import { ethers } from "ethers";
import { useRouter } from "next/router";

export default function TokenList() {
  const [loading, setLoading] = useState<boolean>(false);
  const [assetsInfo, setAssetsInfo] = useState<ReserveDataType[]>();
  const address = useAddress();
  const sdk = useSDK();
  const { contract: poolDataProviderContract } = useContract(
    POOL_DATA_PROVIDER_ADDRESS,
    "custom"
  );
  const { contract: stakingTokenContract } = useContract(
    STAKING_TOKEN,
    "token-drop"
  );

  const { data: claimConditions } = useActiveClaimConditionForWallet(
    stakingTokenContract,
    address
  );
  // const { data: claimerProofs } = useClaimerProofs(
  //   stakingTokenContract,
  //   address
  // );

  const { mutateAsync: claim } = useContractWrite(
    stakingTokenContract,
    "claim"
  );

  const {
    data: stakingTokenSupply,
    isLoading,
    error,
  } = useTokenSupply(stakingTokenContract);

  const { data: allReserveTokens } = useContractRead(
    poolDataProviderContract,
    "getAllReservesTokens"
  );

  useEffect(() => {
    if (!assetsInfo?.length) {
      getAllAssetInfo();
    }
  }, [allReserveTokens]);

  /// For all the reserve tokens , or the ones we have in collection, fetch the reserve data

  const getReserveInfo = async (
    assetAddress: `0x${string}`,
    decimal: number,
    assetName: string
  ): Promise<ReserveDataType | undefined> => {
    try {
      // console.log(assetAddress);
      const reserveData = await poolDataProviderContract?.call(
        "getReserveData",
        [assetAddress]
      );
      // console.log(reserveData);

      const _totalDebt =
        Number(formatUnits(reserveData.totalStableDebt.toString(), decimal)) +
        Number(formatUnits(reserveData.totalVariableDebt.toString(), decimal));
      const reserveInfo: ReserveDataType = {
        assetName: assetName,
        asset: assetAddress,
        price: "$ 1",
        totalSupply: Number(
          formatUnits(reserveData.totalAToken.toString(), decimal)
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
      // console.log(reserveInfo);
      // convert the data and set as per the Type defined
      // define as needed for the frontend
      // We can also get more info
      return reserveInfo;
      // https://docs.aave.com/developers/core-contracts/pool#getreservedata
    } catch (error) {
      console.log(error);
    }
  };

  const getAllAssetInfo = async () => {
    try {
      setLoading(true);

      let promises: ReserveDataType[] = [];
      // await loanTokens.map(async (loanToken) => {
      //   const info = await getReserveInfo(loanToken.address);
      //   if (info) {promises.push(info);}
      // });
      const totalTokens = loanTokens.length;
      for (let id = 0; id < totalTokens; id++) {
        const info = await getReserveInfo(
          loanTokens[id].address,
          loanTokens[id].decimals,
          loanTokens[id].name
        );
        if (info) {
          promises.push(info);
        }
      }

      console.log(promises);
      if (promises) {
        const finalInfo = await Promise.all(promises);
        console.log(finalInfo);
        setAssetsInfo(finalInfo);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);

      console.log(error);
    }
  };

  const mintStakingERC20 = async () => {
    try {
      const _quantity = toWei(1000);
      console.log(claimConditions);
      // console.log(claimerProofs);
      const _proof = ethers.utils.hexZeroPad("0x", 32);
      toast.loading(`Minting 1000 Staking Tokens ....`);
      const data = await claim({
        args: [
          address,
          _quantity,
          claimConditions?.currencyAddress,
          "0",
          {
            proof: [_proof],
            quantityLimitPerWallet: "0",
            pricePerToken: "0",
            currency: claimConditions?.currencyAddress,
          },
          "0x",
        ],
      });
      console.log(data);
      toast.dismiss();
      toast.success(`Successfully Minted`);
    } catch (err: any) {
      console.error("contract call failure", err);
      toast.dismiss();
      toast.error(`${err.reason}`);
    }
  };

  const router = useRouter();

  return (
    <div className="px-6 min-h-screen py-20 md:pt-48">
      <h1 className="font-bold sm:text-4xl text-gray-300 text-4xl leading-none text-center tracking-tight mb-12 ">
        Top Tokens on&nbsp;
        <span
          className="!bg-clip-text text-transparent"
          style={{
            background:
              "linear-gradient(73.59deg, #C339AC 42.64%, #CD4CB5 54%, #E173C7 77.46%)",
          }}
        >
          thirdweb
        </span>
      </h1>

      <div className="relative overflow-x-auto max-w-3xl mx-auto mt-20">
        <table className="w-full text-lg text-gray-500 dark:text-gray-400">
          <thead className=" text-white ">
            <tr>
              <th scope="col" className="px-6 py-3">
                Token
              </th>
              <th scope="col" className="px-6 py-3">
                Total Supplied (TVL)
              </th>
              <th scope="col" className="px-6 py-3">
                Supply APY
              </th>
              <th scope="col" className="px-6 py-3">
                Borrow Rate Stable
              </th>
              <th scope="col" className="px-6 py-3">
                Borrow Rate Variable
              </th>
              <th scope="col" className="px-6 py-3">
                Faucets
              </th>
            </tr>
          </thead>
          <tbody>
            {assetsInfo &&
              assetsInfo.map((row, idx) => (
                <tr
                  onClick={() => router.push(`/token/${row.assetName}`)}
                  key={idx}
                  className=" cursor-pointer text-sm text-center border-b border-gray-600 "
                >
                  <td className="px-6 pl-12 py-4">{row.assetName}</td>
                  <td className="px-6 py-4">{row.totalSupply.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    {row.liquidityRate.toFixed(4)} %
                  </td>
                  <td className="px-6 py-4">
                    {row.borrowRateStable.toFixed(2)} %
                  </td>
                  <td className="px-6 pr-12 py-4">
                    {row.borrowRateVariable.toFixed(2)} %
                  </td>
                  <td className="px-6 pr-12 py-4">
                    <a href="https://app.aave.com/faucet/" target="_blank">
                      <button className="bg-[#8a4fc5] rounded-lg font-semibold w-full text-white">
                        Get ↗
                      </button>
                    </a>
                  </td>
                </tr>
              ))}
            <tr
              onClick={() => router.push("/token/staked-ERC20")}
              className=" cursor-pointer text-sm text-center border-b border-gray-600 "
            >
              <td className="px-6 pl-12 py-4">Staked ERC20</td>
              <td className="px-6 py-4">
                {Number(stakingTokenSupply?.displayValue).toFixed(2)}
              </td>
              <td className="px-6 py-4">N/A</td>
              <td className="px-6 py-4">N/A</td>
              <td className="px-6 pr-12 py-4">N/A</td>
              <td className="px-6 pr-12 py-4">
                <button
                  onClick={mintStakingERC20}
                  className="bg-[#8a4fc5] rounded-lg font-semibold w-full text-white"
                >
                  Get
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        {loading && <Spinner />}
      </div>
    </div>
  );
}
