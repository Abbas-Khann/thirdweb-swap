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
  const [showMenu, setShowMenu] = useState(false);
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
            "  md:bg-none w-full relative text-white py-4 laptop:px-20 gap-4 flex items-center justify-center text-center px-6"
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
            className=" cursor-pointer md:absolute right-20"
          >
            <Image src={cross} alt="cross" />
          </div>
        </div>
      )}
      <div
        className={clsx(
          router.asPath !== "/" && " md:fixed",
          " w-full  flex items-center justify-between px-8 pt-12 md:px-16 bg-transparent"
        )}
      >
        <Link href={"/"}>
          <Image src={logo} alt="" className=" w-36 md:w-44" />
        </Link>
        <div className=" hidden md:flex md:flex-row  flex-col items-center justify-normal gap-x-8">
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
        <div
          onClick={() => setShowMenu((prev) => !prev)}
          className="cursor-pointer md:hidden"
        >
          <svg
            width="40px"
            height="40px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M4 5C3.44772 5 3 5.44772 3 6C3 6.55228 3.44772 7 4 7H20C20.5523 7 21 6.55228 21 6C21 5.44772 20.5523 5 20 5H4ZM7 12C7 11.4477 7.44772 11 8 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H8C7.44772 13 7 12.5523 7 12ZM13 18C13 17.4477 13.4477 17 14 17H20C20.5523 17 21 17.4477 21 18C21 18.5523 20.5523 19 20 19H14C13.4477 19 13 18.5523 13 18Z"
              fill="#fff"
            />
          </svg>
        </div>
        {!!showMenu && (
          <div className=" fixed top-0 bg-black/50 backdrop-blur-md left-0 h-[100vh] w-full md:hidden ">
            <div className="flex flex-col items-center justify-center h-full gap-y-3">
              <div className="flex items-center justify-between w-full px-8 py-14">
                <Link href={"/"}>
                  <Image src={logo} alt="" className=" w-36 md:w-44" />
                </Link>
                <div
                  onClick={() => setShowMenu((prev) => !prev)}
                  className="cursor-pointer"
                >
                  <svg
                    width="30px"
                    height="30px"
                    viewBox="0 0 25 25"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>cross</title>
                    <desc>Created with Sketch Beta.</desc>
                    <defs></defs>
                    <g
                      id="Page-1"
                      stroke="none"
                      stroke-width="1"
                      fill="none"
                      fill-rule="evenodd"
                    >
                      <g
                        id="Icon-Set-Filled"
                        transform="translate(-469.000000, -1041.000000)"
                        fill="#fff"
                      >
                        <path
                          d="M487.148,1053.48 L492.813,1047.82 C494.376,1046.26 494.376,1043.72 492.813,1042.16 C491.248,1040.59 488.712,1040.59 487.148,1042.16 L481.484,1047.82 L475.82,1042.16 C474.257,1040.59 471.721,1040.59 470.156,1042.16 C468.593,1043.72 468.593,1046.26 470.156,1047.82 L475.82,1053.48 L470.156,1059.15 C468.593,1060.71 468.593,1063.25 470.156,1064.81 C471.721,1066.38 474.257,1066.38 475.82,1064.81 L481.484,1059.15 L487.148,1064.81 C488.712,1066.38 491.248,1066.38 492.813,1064.81 C494.376,1063.25 494.376,1060.71 492.813,1059.15 L487.148,1053.48"
                          id="cross"
                        ></path>
                      </g>
                    </g>
                  </svg>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center my-auto mt-20 gap-y-3">
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
          </div>
        )}
      </div>
    </>
  );
}
