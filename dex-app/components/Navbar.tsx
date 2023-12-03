"use client";

import { ConnectWallet } from "@thirdweb-dev/react";
import React, { useEffect, useState } from "react";
import logo from "../assets/logo.webp";
import cross from "../assets/cross.png";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { useRouter } from "next/router";

interface Path {
  title: string;
  path: string;
}

const paths: Path[] = [
  {
    title: "Token",
    path: "/tokenList",
  },
  {
    title: "Swap",
    path: "/swap",
  },
  {
    title: "Pool",
    path: "/pool",
  },
  {
    title: "Lend",
    path: "/lendBorrow",
  },
  {
    title: "Stake",
    path: "stake",
  },
];

export default function Navbar() {
  const [showWarning, setShowWarning] = useState(true);
  const router = useRouter();

  // useEffect(() => {
  //   if (router.asPath === "/") {
  //     setShowWarning(true);
  //   }
  // }, [showWarning]);

  return (
    <>
      {showWarning && router.asPath === "/" && (
        <div
          className={clsx(
            router.asPath !== "/" && " fixed",
            "  md:bg-none w-full relative text-white py-4 laptop:px-20 gap-4 flex items-center justify-center text-center"
          )}
          style={{
            background:
              " var(--warning-gradient, linear-gradient(92deg, #410AB6 5.07%, #7BDEFE 100%))",
          }}
        >
          <div className="  ">
            ⚠ Warning : This product is to showcase thirdweb's tools and should
            not be used as a defi protocol
          </div>
          <div
            onClick={() => setShowWarning(false)}
            className=" cursor-pointer absolute right-20"
          >
            <Image src={cross} alt="cross" />
          </div>
        </div>
      )}
      <div
        className={clsx(
          router.asPath !== "/" && " fixed",
          " w-full  flex items-center justify-between pt-12 px-16 bg-transparent"
        )}
      >
        <Link href={"/"}>
          <Image src={logo} alt="" className=" w-36 md:w-44" />
        </Link>
        <div className=" flex items-center justify-normal gap-x-8">
          {paths.map(({ title, path }) => (
            <Link
              key={title}
              href={path}
              className={clsx(
                router.asPath === path && " text-white text-opacity-50 ",
                " text-white hover:underline text-lg"
              )}
            >
              {title}
            </Link>
          ))}
          <ConnectWallet theme="dark" />
        </div>
      </div>
    </>
  );
}
