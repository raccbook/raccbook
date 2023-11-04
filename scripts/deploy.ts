import hre from "hardhat";

async function main() {
  const Token = await hre.viem.deployContract("Token", ["Core", "CORE"]);
  const Orderbook = await hre.viem.deployContract("Orderbook");

  console.log(`Token deployed to ${Token.address}`);
  console.log(`Orderbook deployed to ${Orderbook.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
