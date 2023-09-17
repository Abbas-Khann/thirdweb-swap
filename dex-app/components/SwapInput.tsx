import Image from "next/image";
import React from "react";

type Props = {
  type: "native" | "token";
  tokenImage?: string | any;
  current: string;
  setValue: (value: string) => void;
  max?: string;
  value: string;
};

export default function SwapInput({
  type,
  tokenImage,
  setValue,
  value,
  current,
  max,
}: Props) {
  return (
    <div className=" relative md:w-full flex items-center bg-transparent border border-slate-700  rounded-2xl px-5">
      <Image
        alt=""
        src={tokenImage || "/token.png"}
        width={100}
        height={100}
        className=" w-7 h-7"
      />
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className=" text-2xl py-7 text-gray-200 font-mono bg-transparent pl-3 md:px-5 outline-none"
        placeholder="0.0"
      />
      {current === type && (
        <button
          className="absolute right-4 active:scale-95 transition-all ease-in-out bg-gray-200 bg-opacity-10 text-white rounded-md px-3 p-2"
          onClick={() => setValue(max || "0")}
        >
          Max
        </button>
      )}
    </div>
  );
}
