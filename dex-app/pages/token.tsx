import { useRouter } from "next/router";
import React from "react";

interface Data {
  token: string;
  price: string;
  change: string;
  tvl: string;
  volume: string;
}

const data = [
  {
    token: "any",
    price: "$ 1,134",
    change: "-0.90%",
    tvl: "$ 800M",
    volume: "$ 3.4M",
    path: "/token/any",
  },
  {
    token: "any",
    price: "$ 1,134",
    change: "-0.90%",
    tvl: "$ 800M",
    volume: "$ 3.4M",
    path: "/token/any",
  },
  {
    token: "any",
    price: "$ 1,134",
    change: "-0.90%",
    tvl: "$ 800M",
    volume: "$ 3.4M",
    path: "/token/any",
  },
];

export default function Token() {
  const router = useRouter();
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
                Price
              </th>
              <th scope="col" className="px-6 py-3">
                Change
              </th>
              <th scope="col" className="px-6 py-3">
                TVL
              </th>
              <th scope="col" className="px-6 py-3">
                Volume
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr
                onClick={() => router.push(row.path)}
                key={idx}
                className=" cursor-pointer text-sm text-center border-b border-gray-600 "
              >
                <td className="px-6 pl-12 py-4">{row.token}</td>
                <td className="px-6 py-4">{row.price}</td>
                <td className="px-6 py-4">{row.change}</td>
                <td className="px-6 py-4">{row.tvl}</td>
                <td className="px-6 pr-12 py-4">{row.volume}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
