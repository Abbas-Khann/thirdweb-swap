import React from "react";
import { useEffect, useState } from "react";
import { formatEther, parseEther } from "ethers/lib/utils";
// import { tokens } from "@/const/tokens";
import {
  ConnectWallet,
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

  return (
    <div className="flex flex-col justify-center items-center">
      stake
      <div className="flex flex-col items-center">
        <ConnectWallet
          className=" "
          style={{ padding: "20px 0px", fontSize: "18px", width: "100%" }}
          theme="dark"
        />
        <div>
          <input
            className="text-gray-200 outline-double"
            onChange={(e) => setInputAmount(Number(e.target.value))}
          ></input>
          <br />
          <button
            className="text-white font-semibold bg-[#8a4fc5]"
            onClick={stakeTokens}
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
            onClick={withdraw}
          >
            Withdraw
          </button>
        </div>
        <br />
        <div>
          <br />
          <button
            className="text-white font-semibold bg-[#8a4fc5]"
            onClick={redeemRewards}
          >
            Reedem
          </button>
        </div>
      </div>
    </div>
  );
}
import React from "react";

// export default function Stake() {
//   return (
//     <div className=" min-h-screen  pt-48 flex items-start justify-center">
//       <div className=" grid grid-cols-12 gap-y-6 gap-x-12">
//         <div className="col-span-12 items-center justify-center flex">
//           <select className=" laptop:min-w-[400px] text-center py-5 px-8 cursor-pointer border border-gray-400 rounded-md bg-transparent text-white">
//             <option>Select any token to stake</option>
//             <option>ETH</option>
//             <option>MATIC</option>
//             <option>DAI</option>
//           </select>
//         </div>
//         <div className=" mt-2 col-span-6 flex flex-col items-center justify-center gap-8 ">
//           <div className=" py-6 px-10 laptop:min-w-[420px] flex flex-col items-stretch justify-center gap-3 text-white border border-gray-400 rounded-md ">
//             <div>Staked: 0</div>
//             <input
//               placeholder="0"
//               type="number"
//               className=" bg-transparent border border-gray-400 px-3 py-2 rounded-md text-white outline-none"
//             />
//             <button className=" mt-1 w-full border border-gray-700 px-5 rounded-md py-3  active:scale-95 transition-all ease-in-out bg-gray-200 bg-opacity-10 text-white mx-auto ">
//               Unstake
//             </button>
//           </div>
//         </div>
//         <div className=" col-span-6 flex flex-col items-center justify-center gap-8 ">
//           <div className=" py-6 px-10 laptop:min-w-[420px] flex flex-col items-stretch justify-center gap-3 text-white border border-gray-400 rounded-md ">
//             <div>Claimable: 0</div>
//             <input
//               placeholder="0"
//               type="number"
//               className=" bg-transparent border border-gray-400 px-3 py-2 rounded-md text-white outline-none"
//             />
//             <button className=" mt-1 w-full border border-gray-700 px-5 rounded-md py-3  active:scale-95 transition-all ease-in-out bg-gray-200 bg-opacity-10 text-white mx-auto ">
//               Claim
//             </button>
//           </div>
//         </div>
//         <div className="col-span-12 items-center justify-center flex flex-col">
//           <div>
//             <input
//               placeholder="0"
//               type="number"
//               className=" laptop:min-w-[300px] bg-transparent border border-gray-400 px-3 py-2 rounded-md text-white outline-none"
//             />
//           </div>
//           <button className=" laptop:min-w-[300px] mt-3 border border-gray-700 px-5 rounded-md py-3  active:scale-95 transition-all ease-in-out bg-gray-200 bg-opacity-10 text-white mx-auto ">
//             Stake
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
