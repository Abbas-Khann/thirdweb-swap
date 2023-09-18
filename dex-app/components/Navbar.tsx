import { ConnectWallet } from "@thirdweb-dev/react";
import React from "react";
import logo from "../assets/logo.webp";
import Image from "next/image";

export default function Navbar() {
  return (
    <>
      <div className=" flex items-center justify-around pt-4 ">
        <Image src={logo} alt="" className=" w-36 md:w-44" />
        <ConnectWallet theme="light" />
      </div>
    </>
  );
}
