import { StaticImageData } from "next/image";
import eth from "../assets/eth3d.png";
import ftm from "../assets/ftm.png";
import dai from "../assets/dai3d.png";
import usdt from "../assets/usdt3d.png";
import usdc from "../assets/usdc3d.png";
import aave from "../assets/aave3d.png";
import sushi from "../assets/aave3d.png";

export interface TokenType {
  name: string;
  symbol: string;
  isNative: boolean;
  address: `0x${string}`;
  logo: StaticImageData;
  decimals: number;
}

export const tokens: TokenType[] = [
  {
    name: "FTM",
    symbol: "FTM",
    isNative: true,
    address: "0x2Fa2e7a6dEB7bb51B625336DBe1dA23511914a8A",
    logo: ftm,
    decimals: 18,
  },
  {
    name: "DAI",
    symbol: "DAI",
    isNative: false,
    address: "0x77FDe93fEe5fe272dC17d799cb61447431E6Eba2",
    logo: dai,
    decimals: 18,
  },
  {
    name: "USDT",
    symbol: "USDT",
    isNative: false,
    address: "0x9DFf9E93B1e513379cf820504D642c6891d8F7CC",
    logo: usdt,
    decimals: 6,
  },
  {
    name: "USDC",
    symbol: "USDC",
    isNative: false,
    address: "0x66F61903D7FEC18048bEc2e792f272cb8B657733",
    logo: usdt,
    decimals: 6,
  },
  {
    name: "AAVE",
    symbol: "AAVE",
    isNative: false,
    address: "0x52D800ca262522580CeBAD275395ca6e7598C014",
    logo: aave,
    decimals: 18,
  },
  {
    name: "SUSHI",
    symbol: "SUSHI",
    isNative: false,
    address: "0x52D800ca262522580CeBAD275395ca6e7598C014",
    logo: sushi,
    decimals: 18,
  },
];

export const tokenLink: { [id: string]: TokenType } = {
  FTM: tokens[0],
  DAI: tokens[1],
  USDT: tokens[2],
  USDC: tokens[3],
  AAVE: tokens[4],
  SUSHI: tokens[5],
};

export interface ReserveDataType {
  asset: `0x${string}`;
  assetName: string;
  price: string;
  totalSupply: number; // total Supply of aToken
  totalDebt: number; // total Stable debt + variable debt
  totalLiquidity: number; // total variable debt
  borrowRateStable: number; //  variable borrow rate of the reserve
  borrowRateVariable: number; // stable borrow rate of the reserve
  liquidityRate: number; // The liquidity index of the reserve
}

export const loanTokens: TokenType[] = [
  {
    name: "DAI",
    symbol: "DAI",
    isNative: false,
    address: "0x77FDe93fEe5fe272dC17d799cb61447431E6Eba2",
    logo: dai,
    decimals: 18,
  },
  {
    name: "USDT",
    symbol: "USDT",
    isNative: false,
    address: "0x9DFf9E93B1e513379cf820504D642c6891d8F7CC",
    logo: usdt,
    decimals: 6,
  },
  {
    name: "USDC",
    symbol: "USDC",
    isNative: false,
    address: "0x66F61903D7FEC18048bEc2e792f272cb8B657733",
    logo: usdt,
    decimals: 6,
  },
  {
    name: "AAVE",
    symbol: "AAVE",
    isNative: false,
    address: "0x52D800ca262522580CeBAD275395ca6e7598C014",
    logo: aave,
    decimals: 18,
  },
  {
    name: "SUSHI",
    symbol: "SUSHI",
    isNative: false,
    address: "0x1fdE0eCc619726f4cD597887C9F3b4c8740e19e2",
    logo: sushi,
    decimals: 18,
  },
];

export const loanTokenLink: { [id: string]: TokenType } = {
  DAI: loanTokens[0],
  USDC: loanTokens[1],
  USDT: loanTokens[2],
  AAVE: loanTokens[3],
  SUSHI: loanTokens[4],
};

export interface UserDataType {
  tokenBalance: number;
  totalSupplied: number; // A token balance
  totalBorrowed: number; // Stable + borrow Rate
  healthFactor: number; // healthFactor
  availableToBorrow: number; //availableBorrowBase
}
