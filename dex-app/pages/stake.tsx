import React from "react";
import { useEffect, useState } from "react";
import { formatEther, parseEther } from "ethers/lib/utils";
import {
  useAddress,
  useContract,
  useContractRead,
  useContractWrite,
  useSDK,
  useTokenBalance,
} from "@thirdweb-dev/react";
import {
  REWARD_TOKEN,
  STAKING_ADDRESS,
  STAKING_TOKEN,
  WETH_ADDRESS,
} from "@/const/details";
import { Spinner } from "@chakra-ui/react";
import toast from "react-hot-toast";

export default function Stake() {
  //   const [selectedToken, setSelectedToken] = useState(tokens[0]);
  const [inputAmount, setInputAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const address = useAddress();
  const sdk = useSDK();
  const { contract: stakingTokenContract } = useContract(
    STAKING_TOKEN,
    "token"
  );
  const { contract: rewardTokenContract } = useContract(REWARD_TOKEN, "token");
  const { contract: wethContract } = useContract(WETH_ADDRESS, "custom");
  const { contract: stakingContract } = useContract(STAKING_ADDRESS, "custom");
  const { data: stakingTokenBalance } = useTokenBalance(
    stakingTokenContract,
    address
  );

  // this will have both total staked Tokens & rewards earned
  const { data: stakingInfo } = useContractRead(
    stakingContract,
    "getStakeInfo",
    [address]
  );

  const { mutateAsync: approveToken } = useContractWrite(
    stakingTokenContract,
    "approve"
  );

  useEffect(() => {
    if (address) {
      console.log(stakingInfo);
      console.log(stakingTokenBalance);
      if (stakingInfo) {
        console.log(formatEther(stakingInfo._rewards.toString()));
        console.log(formatEther(stakingInfo._tokensStaked.toString()));
      }
    }
  }, [address]);

  const stakeTokens = async () => {
    try {
      setLoading(true);
      toast.loading(`Approving Tokens ....`);
      await approveToken({
        args: [STAKING_ADDRESS, parseEther(inputAmount.toString())],
      });
      toast.dismiss();
      toast.success(`Successfully Approved`);
      toast.loading("Staking Token ...");

      // add the required address
      const _stake = await stakingContract?.call("stake", [
        parseEther(inputAmount.toString()),
      ]);
      toast.dismiss();
      toast.success(`Token Successfully Staked`);
      console.log(_stake);
      setLoading(false);
      // toast.success();
    } catch (err: any) {
      // toast.error("")
      toast.dismiss();

      toast.error(`${err.reason}`);

      console.error(err);
    }
  };

  // call this function in the withdraw button with inputAmount as _amount
  const withdraw = async () => {
    try {
      setLoading(true);

      if (withdrawAmount) {
        toast.loading("Withdrawing Token ...");

        const _withdraw = await stakingContract?.call("withdraw", [
          parseEther(withdrawAmount.toString()),
        ]);

        toast.dismiss();
        toast.success(`Token Successfully wihtdrawn`);
        console.log(_withdraw);
        setLoading(false);
      }
    } catch (err: any) {
      setLoading(false);
      toast.dismiss();

      toast.error(`${err.reason}`);

      console.error(err);
      // toast.error(err);
    }
  };

  const redeemRewards = async () => {
    try {
      setLoading(true);
      toast.loading("Reedeming rewards ...");

      // in the param put in the token that was staked
      const _redeemRewards = await stakingContract?.call("claimRewards");
      toast.dismiss();
      toast.success(`Token Successfully reedemed`);
      console.log(_redeemRewards);
      setLoading(false);
      // toast.success("Redeemed rewards")
    } catch (err: any) {
      setLoading(false);
      toast.error(`${err.reason}`);
      toast.dismiss();

      console.error(err);
      // toast.error(err)
      //   alert(err.message);
    }
  };

  return (
    <div className="px-6 min-h-screen py-20  md:pt-48 flex items-start justify-center">
      <div className="md:w-10/12 grid grid-cols-12 gap-y-6 gap-x-12">
        <div className="col-span-12 items-center w-full mx-auto justify-center flex">
          <select className="md:w-full  w-fit  mx-auto  text-center py-5 px-8 cursor-pointer border border-gray-400 rounded-md bg-transparent text-white">
            <option>Staking ERC20</option>
          </select>
        </div>
        <div className=" w-full mt-2 col-span-12 md:col-span-6 flex flex-col items-center justify-center gap-8 ">
          <div className=" py-6 px-10 md:w-full  w-fit  mx-auto  flex flex-col items-stretch justify-center gap-3 text-white border border-gray-400 rounded-md ">
            <div>
              Available to Stake:{" "}
              {stakingTokenBalance?.displayValue.slice(0, 7)}
            </div>
            <input
              placeholder="0"
              type="number"
              className=" bg-transparent border border-gray-400 px-3 py-2 rounded-md text-white outline-none"
              onChange={(e) => setInputAmount(Number(e.target.value))}
            />
            <button
              onClick={stakeTokens}
              className=" mt-1 w-full border border-gray-700 px-5 rounded-md py-3  active:scale-95 transition-all ease-in-out bg-gray-200 bg-opacity-10 text-white mx-auto "
            >
              Stake
            </button>
          </div>
        </div>
        <div className="col-span-12 md:col-span-6 md:w-full  w-fit mx-auto flex flex-col items-center justify-center gap-8 ">
          <div className=" py-6 px-10 w-full flex flex-col items-stretch justify-center gap-3 text-white border border-gray-400 rounded-md ">
            <div>
              Staked:{" "}
              {stakingInfo
                ? formatEther(stakingInfo._tokensStaked.toString()).slice(0, 7)
                : 0}
            </div>
            <input
              placeholder="0"
              type="number"
              className=" bg-transparent border border-gray-400 px-3 py-2 rounded-md text-white outline-none"
              onChange={(e) => setWithdrawAmount(Number(e.target.value))}
            />
            <button
              onClick={stakeTokens}
              className=" mt-1 w-full border border-gray-700 px-5 rounded-md py-3  active:scale-95 transition-all ease-in-out bg-gray-200 bg-opacity-10 text-white mx-auto "
            >
              Unstake
            </button>
          </div>
        </div>
        <div className="col-span-12 md:w-full  w-fit  mx-auto items-center justify-center flex flex-col  text-white">
          <div>
            Rewards Claimable:{" "}
            {stakingInfo
              ? formatEther(stakingInfo._rewards.toString()).slice(0, 7)
              : 0}
          </div>
          <button
            onClick={redeemRewards}
            className=" laptop:min-w-[300px] mt-3 border border-gray-700 px-5 rounded-md py-3  active:scale-95 transition-all ease-in-out  bg-white text-black font-semibold text-lg mx-auto "
          >
            Claim Rewards
          </button>
        </div>
        {loading ? <a>Processing Txs...</a> : <a>Waiting ...</a>}
      </div>
    </div>
  );
}
