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

  /// For all the reserve tokens , or the ones we have in collection, fetch the reserve data

  const getReserveInfo = async (
    assetAddress: `0x${string}`
  ): Promise<ReserveDataType | undefined> => {
    try {
      const reserveData = await poolDataProviderContract?.call(
        "getReserveData",
        [assetAddress]
      );
      console.log(reserveData);
      // convert the data and set as per the Type defined
      // We can also get more info
      return reserveData;
      // https://docs.aave.com/developers/core-contracts/pool#getreservedata
    } catch (error) {
      console.log(error);
    }
  };

  const getAllAssetInfo = async () => {
    let promises: ReserveDataType[] = [];
    loanTokens.forEach(async (loanToken) => {
      const info = await getReserveInfo(loanToken.address);
      if (info) {
        promises.push(info);
      }
    });

    setAssetsInfo(await Promise.all(promises));
  };

  return <div>tokenList</div>;
};

export default tokenList;
