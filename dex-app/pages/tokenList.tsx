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

export default function TokenList() {
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
    decimal: number
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
        asset: assetAddress,
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
    let promises: ReserveDataType[] = [];
    // await loanTokens.map(async (loanToken) => {
    //   const info = await getReserveInfo(loanToken.address);
    //   if (info) {promises.push(info);}
    // });
    const totalTokens = loanTokens.length;
    for (let id = 0; id < totalTokens; id++) {
      const info = await getReserveInfo(
        loanTokens[id].address,
        loanTokens[id].decimals
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
  };

  return <div>tokenList</div>;
}
