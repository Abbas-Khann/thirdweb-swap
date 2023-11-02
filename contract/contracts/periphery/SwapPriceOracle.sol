// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import {SwapLibrary} from "../libraries/SwapLibrary.sol";
import {ISwapPair} from "../interfaces/ISwapPair.sol";

contract SwapPriceOracle {
    address public immutable factory;
    address public immutable WETH;

    constructor(address _factory, address _WETH) {
        factory = _factory;
        WETH = _WETH;
    }

    /// returns the price of A with respect to B
    /// 1 A = price * ( B )
    function getPriceA(
        address tokenA,
        address tokenB
    ) public view returns (uint256 priceA) {
        address pair = SwapLibrary.pairFor(factory, tokenA, tokenB);
        // (uint reserveA, uint reserveB, uint timeStamp) = ISwapPair(pair)
        //     .getReserves();
        priceA = ISwapPair(pair).price0CumulativeLast();
        // priceA = (reserveB / reserveA);
    }

    function getPriceB(
        address tokenA,
        address tokenB
    ) public view returns (uint256 priceB) {
        address pair = SwapLibrary.pairFor(factory, tokenA, tokenB);
        priceB = ISwapPair(pair).price1CumulativeLast();
        // (uint reserveA, uint reserveB, uint timeStamp) = ISwapPair(pair)
        //     .getReserves();
        // priceB = (reserveA / reserveB);
    }
}
