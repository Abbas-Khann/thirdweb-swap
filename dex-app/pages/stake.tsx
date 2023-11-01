import React from "react";

export default function Stake() {
  return (
    <div className=" min-h-screen  pt-48 flex items-start justify-center">
      <div className=" grid grid-cols-12 gap-y-6 gap-x-12">
        <div className="col-span-12 items-center justify-center flex">
          <select className=" laptop:min-w-[400px] text-center py-5 px-8 cursor-pointer border border-gray-400 rounded-md bg-transparent text-white">
            <option>Select any token to stake</option>
            <option>ETH</option>
            <option>MATIC</option>
            <option>DAI</option>
          </select>
        </div>
        <div className=" mt-2 col-span-6 flex flex-col items-center justify-center gap-8 ">
          <div className=" py-6 px-10 laptop:min-w-[420px] flex flex-col items-stretch justify-center gap-3 text-white border border-gray-400 rounded-md ">
            <div>Staked: 0</div>
            <input
              placeholder="0"
              type="number"
              className=" bg-transparent border border-gray-400 px-3 py-2 rounded-md text-white outline-none"
            />
            <button className=" mt-1 w-full border border-gray-700 px-5 rounded-md py-3  active:scale-95 transition-all ease-in-out bg-gray-200 bg-opacity-10 text-white mx-auto ">
              Unstake
            </button>
          </div>
        </div>
        <div className=" col-span-6 flex flex-col items-center justify-center gap-8 ">
          <div className=" py-6 px-10 laptop:min-w-[420px] flex flex-col items-stretch justify-center gap-3 text-white border border-gray-400 rounded-md ">
            <div>Claimable: 0</div>
            <input
              placeholder="0"
              type="number"
              className=" bg-transparent border border-gray-400 px-3 py-2 rounded-md text-white outline-none"
            />
            <button className=" mt-1 w-full border border-gray-700 px-5 rounded-md py-3  active:scale-95 transition-all ease-in-out bg-gray-200 bg-opacity-10 text-white mx-auto ">
              Claim
            </button>
          </div>
        </div>
        <div className="col-span-12 items-center justify-center flex flex-col">
          <div>
            <input
              placeholder="0"
              type="number"
              className=" laptop:min-w-[300px] bg-transparent border border-gray-400 px-3 py-2 rounded-md text-white outline-none"
            />
          </div>
          <button className=" laptop:min-w-[300px] mt-3 border border-gray-700 px-5 rounded-md py-3  active:scale-95 transition-all ease-in-out bg-gray-200 bg-opacity-10 text-white mx-auto ">
            Stake
          </button>
        </div>
      </div>
    </div>
  );
}
