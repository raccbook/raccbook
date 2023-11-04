import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import "./scripts/populate";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
};

export default config;
