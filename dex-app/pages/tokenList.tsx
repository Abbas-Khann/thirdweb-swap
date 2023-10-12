import { useEffect, useState } from "react";
import { formatEther, parseEther } from "ethers/lib/utils";
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

const tokenList = () => {
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
    // console.log(allReserveTokens);
    getAllAssetInfo();
  }, [allReserveTokens]);

  /// For all the reserve tokens , or the ones we have in collection, fetch the reserve data

  const getReserveInfo = async (
    assetAddress: `0x${string}`
  ): Promise<ReserveDataType | undefined> => {
    try {
      console.log(assetAddress);
      const reserveData = await poolDataProviderContract?.call(
        "getReserveData",
        [assetAddress]
      );
      console.log(reserveData);
      if (reserveData) {
        const reserveInfo: ReserveDataType = {
          asset: assetAddress,
          totalSupply: formatEther(reserveData.totalAToken.toString()),
          totalStableDebt: formatEther(reserveData.totalStableDebt.toString()),
          totalVariableDebt: formatEther(
            reserveData.totalVariableDebt.toString()
          ),
          borrowRateStable: formatEther(
            reserveData.stableBorrowRate.toString()
          ),
          borrowRateVariable: formatEther(
            reserveData.variableBorrowRate.toString()
          ),
        };
        console.log(reserveInfo);
        // convert the data and set as per the Type defined
        // define as needed for the frontend
        // We can also get more info
        return reserveInfo;
      }

      // https://docs.aave.com/developers/core-contracts/pool#getreservedata
    } catch (error) {
      console.log(error);
    }
  };

  const getAllAssetInfo = async () => {
    let data: ReserveDataType[] = [];
    await loanTokens.forEach(async (loanToken) => {
      const info = await getReserveInfo(loanToken.address);
      if (info) {
        data.push(info);
      }
    });
    console.log(data);
    setAssetsInfo(data);
  };

  return <div>tokenList</div>;
};

export default tokenList;
