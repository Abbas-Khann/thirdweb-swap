import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import Image from "next/image";
import React from "react";
import token1 from "@/assets/token1.png";
import arrow from "@/assets/arrow.png";
import token2 from "@/assets/token2.png";
import { useRouter } from "next/router";

export default function TokenPage() {
  const address = useAddress();
  const router = useRouter();
  return (
    <div className="px-6 py-20 w-full min-h-screen flex md:flex-row flex-col items-center justify-center">
      <div className=" text-white px-10 ">
        <div className="md:mx-10 mx-4  flex-col h-full flex items-start justify-between w-full  gap-3">
          <div className=" md:mb-24 mb-10">
            <div
              onClick={() => router.push("/token")}
              className=" cursor-pointer text-lg font-semibold text-white flex items-center gap-3 mb-5"
            >
              <Image src={arrow} alt="" />
              <div className=" hover:underline">All Tokens</div>
            </div>
            <div className="text-xl flex items-center gap-3 ">
              <Image src={token2} alt="" />
              <div className=" ">Dai Stablecoin</div>
              <div className="text-[#A0A0A0] ">DAI</div>
            </div>
          </div>
          <div className=" w-full">
            <h1 className="text-gray-200  mb-2 mr-auto text-2xl font-semibold">
              Stats
            </h1>
            <div className=" w-full my-auto relative bg-transparent bg-opacity-30 border border-slate-700 p-10 py-12  rounded-xl flex-col gap-6 flex items-center justify-center">
              <div className=" flex items-center md:flex-row flex-col gap-3 md:gap-0 justify-around w-full">
                <div className=" space-y-2">
                  <div className=" text-[#A0A0A0]">TVL</div>
                  <div className=" text-2xl">$188.7M</div>
                </div>
                <div className=" space-y-2">
                  <div className=" text-[#A0A0A0]">Borrow Rate</div>
                  <div className=" text-2xl">5.05 %</div>
                </div>
                <div className=" space-y-2">
                  <div className=" text-[#A0A0A0]">Supply APY</div>
                  <div className=" text-2xl">0.0299 %</div>
                </div>
                <div className=" space-y-2">
                  <div className=" text-[#A0A0A0]">Interest rate</div>
                  <div className=" text-2xl">90.64%</div>
                </div>
              </div>
            </div>
          </div>

          <div className=" mt-10 mb-10 md:mb-0">
            <h1 className=" text-2xl font-semibold">About</h1>
            <p>
              Lorem ipsum dolor sit amet consectetur. Sed fermentum nunc
              convallis libero libero dignissim. Cras massa mauris quisque
              tincidunt.Sed fermentum nunc convallis libero libero dignissim.
              Cras massa mauris quisque tincidunt.
            </p>
          </div>
        </div>
      </div>
      <div  className=" w-full">
        <div className="  my-auto mx-4 md:mx-10 relative bg-[#212429] bg-opacity-30 border border-slate-700 p-10 py-12  rounded-xl flex-col gap-6 flex items-center justify-center">
          <h1 className="text-gray-200 mr-auto text-2xl font-semibold">Swap</h1>
          <div className=" w-full flex items-center flex-col justify-center gap-3">
            <div className=" space-y-4 w-full flex flex-col items-center">
              <div className=" w-full relative md:w-full flex items-center bg-transparent border border-slate-700  rounded-2xl px-5">
                <Image
                  alt=""
                  src={token2}
                  width={100}
                  height={100}
                  className=" w-7 h-7"
                />
                <input
                  type="number"
                  className=" text-2xl py-7 text-gray-200 font-mono bg-transparent pl-3 md:px-5 outline-none"
                  placeholder="0.0"
                />

                <button className="absolute right-4 active:scale-95 transition-all ease-in-out bg-gray-200 bg-opacity-10 text-white rounded-md px-3 p-2">
                  Max
                </button>
              </div>
              <div className=" w-full relative md:w-full flex items-center bg-transparent border border-slate-700  rounded-2xl px-5">
                <Image
                  alt=""
                  src={token1}
                  width={100}
                  height={100}
                  className=" w-7 h-7"
                />
                <input
                  type="number"
                  className=" text-2xl py-7 text-gray-200 font-mono bg-transparent pl-3 md:px-5 outline-none"
                  placeholder="0.0"
                />

                <button className="absolute right-4 active:scale-95 transition-all ease-in-out bg-gray-200 bg-opacity-10 text-white rounded-md px-3 p-2">
                  Max
                </button>
              </div>

              {address ? (
                <button
                  style={{
                    padding: "20px 0px",
                    fontSize: "18px",
                    width: "100%",
                  }}
                  className=" rounded-lg w-full text-white font-semibold bg-[#8a4fc5]"
                >
                  Swap
                </button>
              ) : (
                <ConnectWallet
                  className=" "
                  style={{
                    padding: "20px 0px",
                    fontSize: "18px",
                    width: "100%",
                  }}
                  theme="dark"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
