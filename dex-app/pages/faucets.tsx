import { useEffect, useState } from "react";
import { formatEther, formatUnits, parseEther } from "ethers/lib/utils";
// import { tokens } from "@/const/tokens";
import {
  useAddress,
  useContract,
  useContractRead,
  useContractWrite,
  useSDK,
} from "@thirdweb-dev/react";
import React from "react";
import { POOL_DATA_PROVIDER_ADDRESS } from "@/const/details";
import { ReserveDataType, loanTokens } from "@/const/tokens";
interface Data {
  token: string;
  price: string;
  change: string;
  tvl: string;
  volume: string;
}
import { Spinner } from "@chakra-ui/react";

export default function TokenList() {
  const [loading, setLoading] = useState<boolean>(false);
  const [assetsInfo, setAssetsInfo] = useState<ReserveDataType[]>();
  const address = useAddress();
  const sdk = useSDK();
  const { contract: poolDataProviderContract } = useContract(
    POOL_DATA_PROVIDER_ADDRESS,
    "custom"
  );

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
      console.log(assetAddress);
      const reserveData = await poolDataProviderContract?.call(
        "getReserveData",
        [assetAddress]
      );
      console.log(reserveData);

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
      console.log(reserveInfo);
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
  return (
    <div className=" min-h-screen  pt-48">
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
            </tr>
          </thead>
          <tbody>
            {assetsInfo ? (
              assetsInfo.map((row, idx) => (
                <tr
                  key={idx}
                  className=" text-sm text-center border-b border-gray-600 "
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
                </tr>
              ))
            ) : (
              <div className="text-sm text-center">No Info </div>
            )}
          </tbody>
        </table>
        {loading && <Spinner />}
      </div>
    </div>
  );
}
