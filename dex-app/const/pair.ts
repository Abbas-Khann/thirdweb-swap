import { TokenType, tokens } from "./tokens";

export interface TokenPairType {
  token1: TokenType;
  token2: TokenType;
}

export const tokenpairs: TokenPairType[] = [
  {
    token1: tokens[0],
    token2: tokens[1],
  },
  {
    token1: tokens[0],
    token2: tokens[2],
  },
  {
    token1: tokens[1],
    token2: tokens[2],
  },
];
