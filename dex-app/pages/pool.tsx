"use client";
import React, { useState } from "react";

export default function Token() {
  const [newPool, setNewPool] = useState(false);

  return (
    <div className=" min-h-screen  pt-48 flex items-start justify-center text-white">
      <div className="relative overflow-x-auto laptop:w-8/12  mx-auto mt-5">
        <div className=" flex items-center w-full justify-between">
          <h1>Pools</h1>
          <button
            onClick={() => setNewPool((prev) => !prev)}
            className=" border border-gray-700 px-5 rounded-md py-3  active:scale-95 transition-all ease-in-out bg-blue-500 bg-opacity-10 text-white 5mx-auto "
          >
            New Pool +
          </button>
        </div>
        {newPool && (
          <div className=" bg-black bg-opacity-50 backdrop-blur-md my-5 p-5 px-8 border border-gray-500 rounded-xl">
            <div className=" mb-3">Select Pair</div>
            <div className=" flex items-center justify-normal gap-4">
              <select className="w-full text-center py-2 px-5 cursor-pointer border border-gray-400 rounded-md bg-transparent text-white">
                <option>ETH</option>
                <option>MATIC</option>
                <option>DAI</option>
              </select>
              <select className="  w-full text-center py-2 px-5 cursor-pointer border border-gray-400 rounded-md bg-transparent text-white">
                <option>MATIC</option>
                <option>ETH</option>
                <option>DAI</option>
              </select>
            </div>
            <div className=" mt-2  mb-2">Deposit Amounts Pair</div>

            <div className=" flex items-center justify-noraml w-full gap-4">
              <input
                placeholder="0"
                type="number"
                className=" w-full bg-transparent border border-gray-400 px-3 py-2 rounded-md text-white outline-none"
              />
              <input
                placeholder="0"
                type="number"
                className=" w-full bg-transparent border border-gray-400 px-3 py-2 rounded-md text-white outline-none"
              />
            </div>
            <button
              className=" w-full mt-5 border border-gray-700 px-5 rounded-md py-3  active:scale-95 transition-all ease-in-out bg-blue-500 bg-opacity-90 text-white 5mx-auto "
            >
              Add Liquidity
            </button>
          </div>
        )}
        <table className="w-full text-lg text-gray-500 dark:text-gray-400 mt-12">
          <thead className=" text-white ">
            <tr>
              <th scope="col" className="px-6 py-3">
                Token A
              </th>
              <th scope="col" className="px-6 py-3">
                Token B
              </th>
              <th scope="col" className="px-6 py-3">
                Liq. Amount
              </th>

              <th scope="col" className="px-6 py-3">
                Remove Liq.
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className=" text-sm text-center border-b border-gray-600 ">
              <td className="px-6 py-4">Tk1</td>
              <td className="px-6 py-4">Tk2</td>
              <td className="px-6 py-4">0.692323</td>
              <td className="px-6 py-4">
                <button className=" border border-gray-700 px-5 rounded-md py-3  active:scale-95 transition-all ease-in-out bg-red-500 bg-opacity-100 text-white 5mx-auto ">
                  Remove Liquidity
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
