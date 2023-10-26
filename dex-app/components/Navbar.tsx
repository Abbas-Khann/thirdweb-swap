import { ConnectWallet } from "@thirdweb-dev/react";
import React from "react";
import logo from "../assets/logo.webp";
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
    path: "/token",
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
    path: "/lend",
  },
  {
    title: "Stake",
    path: "stake",
  },
];

export default function Navbar() {
  const router = useRouter();
  return (
    <>
      <div className=" fixed w-full  flex items-center justify-between pt-12 px-16 bg-transparent">
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
        </div>
        <ConnectWallet theme="dark" />
      </div>
    </>
  );
}
