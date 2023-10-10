import React from "react";
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
import {
  REWARD_TOKEN,
  STAKING_ADDRESS,
  STAKING_TOKEN,
  WETH_ADDRESS,
} from "@/const/details";

export default function stake() {
  //   const [selectedToken, setSelectedToken] = useState(tokens[0]);
  const [inputAmount, setInputAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  //   const [balance, setBalance] = useState(0);
  //   const [earnedRewards, setEarnedRewards] = useState(0);
  //   const [stakedAmount, setStakedAmount] = useState(0);

  const address = useAddress();
  const sdk = useSDK();
  const { contract: stakingTokenContract } = useContract(
    STAKING_TOKEN,
    "token"
  );
  const { contract: rewardTokenContract } = useContract(REWARD_TOKEN, "token");
  const { contract: wethContract } = useContract(WETH_ADDRESS, "custom");
  const { contract: stakingContract } = useContract(STAKING_ADDRESS, "custom");
  const { data: stakingTokenBalance } = useContractRead(
    stakingTokenContract,
    "balanceOf",
    [address]
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

  //   const approveToken = async (tokenAddress: `0x${string}`, amount: number) => {
  //     try {
  //       const contract = await sdk?.getContract(tokenAddress);
  //       const tx = await contract?.call("approve", [
  //         STAKING_ADDRESS,
  //         parseEther(amount.toString()),
  //       ]);
  //       console.log(tx);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  const stakeTokens = async () => {
    try {
      await approveToken({
        args: [STAKING_ADDRESS, parseEther(inputAmount.toString())],
      });
      // add the required address
      const _stake = await stakingContract?.call("stake", [
        parseEther(inputAmount.toString()),
      ]);
      setLoading(true);
      console.log(_stake);
      setLoading(false);
      // toast.success();
    } catch (err) {
      // toast.error("")
      console.error(err);
    }
  };

  // call this function in the withdraw button with inputAmount as _amount
  const withdraw = async () => {
    try {
      if (withdrawAmount) {
        const _withdraw = await stakingContract?.call("withdraw", [
          parseEther(withdrawAmount.toString()),
        ]);
        setLoading(true);
        console.log(_withdraw);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      // toast.error(err);
    }
  };

  const redeemRewards = async () => {
    try {
      // in the param put in the token that was staked
      const _redeemRewards = await stakingContract?.call("claimRewards");
      setLoading(true);
      console.log(_redeemRewards);
      setLoading(false);
      // toast.success("Redeemed rewards")
    } catch (err) {
      console.error(err);
      // toast.error(err)
      //   alert(err.message);
    }
  };

  return <div>stake</div>;
}
