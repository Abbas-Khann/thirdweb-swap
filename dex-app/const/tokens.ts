export interface TokenType {
  name: string;
  symbol: string;
  isNative: boolean;
  address: `0x${string}`;
  logo: string;
  decimals: number;
}

export const tokens: TokenType[] = [
  {
    name: "Matic",
    symbol: "MATIC",
    isNative: true,
    address: "0xA5A51315b449C7026164111ED142E87cd1C865B7",
    logo: "",
    decimals: 18,
  },
  {
    name: "Token1",
    symbol: "Tk1",
    isNative: false,
    address: "0x1927d7a542826728a25b23acd280b57ac37bb930",
    logo: "",
    decimals: 18,
  },
  {
    name: "Token2",
    symbol: "Tk2",
    isNative: false,
    address: "0xec80ee7f0e65f696f09206859615ffe5626c384c",
    logo: "",
    decimals: 18,
  },
  {
    name: "USDC",
    symbol: "USDC",
    isNative: false,
    address: "0x",
    logo: "",
    decimals: 18,
  },
];

export interface ReserveDataType {
  asset: `0x${string}`;
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
    address: "0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357",
    logo: "",
    decimals: 18,
  },
  {
    name: "USDC",
    symbol: "USDC",
    isNative: false,
    address: "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8",
    logo: "",
    decimals: 6,
  },
  {
    name: "USDT",
    symbol: "USDT",
    isNative: false,
    address: "0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0",
    logo: "",
    decimals: 6,
  },
];

export interface UserDataType {
  tokenBalance: number;
  totalSupplied: number; // A token balance
  totalBorrowed: number; // Stable + borrow Rate
  healthFactor: number; // healthFactor
  availableToBorrow: number; //availableBorrowBase
}
