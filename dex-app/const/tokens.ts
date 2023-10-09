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
