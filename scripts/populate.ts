import { task } from "hardhat/config";
import { parseEther } from "viem";

task("populate", "Populate the orderbook")
  .addParam("contract", "Contract Address")
  .addParam("token", "Token Address")
  .setAction(async (args, { viem, network }) => {
    const asks = 20;
    const bids = 20;
    const termOptions = [1, 7, 30];

    const contract = await viem.getContractAt("Orderbook", args.contract);
    const token = await viem.getContractAt("Token", args.token);

    // await token.write.approve([contract.address, parseEther("1000000")]);
    // await contract.write.deposit([args.token, parseEther("100000")]);

    for (let i = 0; i < asks; i++) {
      const amount = parseEther((Math.random() * 901 + 100).toFixed(2));
      const term = BigInt(
        termOptions[Math.floor(Math.random() * termOptions.length)]
      );
      const rate = BigInt(Math.floor(Math.random() * 401 + 800));

      await contract.write.limitAsk([token.address, amount, term, rate]);
    }

    for (let i = 0; i < bids; i++) {
      const amount = parseEther((Math.random() * 901 + 100).toFixed(2));
      const term = BigInt(
        termOptions[Math.floor(Math.random() * termOptions.length)]
      );
      const rate = BigInt(Math.floor(Math.random() * 400 + 400));

      await contract.write.limitBid([token.address, amount, term, rate]);
    }
  });
