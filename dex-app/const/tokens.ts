export interface TokenType {
  name: string;
  symbol: string;
  isNative: boolean;
  address: `0x${string}`;
  logo: string;
}
export const tokens: TokenType[] = [
  {
    name: "Matic",
    symbol: "MATIC",
    isNative: true,
    address: "0xA5A51315b449C7026164111ED142E87cd1C865B7",
    logo: "",
  },
  {
    name: "Token1",
    symbol: "Tk1",
    isNative: false,
    address: "0x1927d7a542826728a25b23acd280b57ac37bb930",
    logo: "",
  },
  {
    name: "Token2",
    symbol: "Tk2",
    isNative: false,
    address: "0xec80ee7f0e65f696f09206859615ffe5626c384c",
    logo: "",
  },
  {
    name: "USDC",
    symbol: "USDC",
    isNative: false,
    address: "0x",
    logo: "",
  },
];

export interface ReserveDataType {
  asset: `0x${string}`;
  totalSupply: number; // total Supply of aToken
  totalStableDebt: number; // total Stable debt
  totalVariableDebt: number; // total variable debt
  borrowRateStable: number; //  variable borrow rate of the reserve
  borrowRateVariable: number; // stable borrow rate of the reserve
  liquidityRate: number; // The liquidity index of the reserve
}

export const loanTokens: TokenType[] = [
  {
    name: "DAI",
    symbol: "DAI",
    isNative: false,
    address: "0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357",
    logo: "",
  },
  {
    name: "USDC",
    symbol: "USDC",
    isNative: false,
    address: "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8s",
    logo: "",
  },
  {
    name: "USDT",
    symbol: "USDT",
    isNative: false,
    address: "0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0s",
    logo: "",
  },
];
