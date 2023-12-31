import { capitalizeFirst } from "@/utils/format";
import { FC, useEffect, useState } from "react";
import InputParams from "./InputParams";
import Mode from "./Mode";
import { usePrepareWrite } from "@/hooks/usePrepareWrite";
import { useReads } from "@/hooks/useReads";
import { useAccount, useContractWrite, useNetwork } from "wagmi";
import { parseEther } from "viem";
import { iModes, iTypes } from "@/types";
import Meta from "./Meta";
import { Bid, Ask } from "@/types/orders";
import { durationState } from "@/redux/meta";
import { useSelector } from "react-redux";
import Modal from "../common/modal";
import Button from "../common/button";
import { generateSuccess, throwNotification } from "@/utils/notification";
import { getContract } from "@/constants";

const Panel: FC = () => {
  const { address } = useAccount();

  const [mode, setMode] = useState<iModes>("borrow");
  const [type, setType] = useState<iTypes>("market");
  const [rate, setRate] = useState<number>(0);
  const [tlidScore, setTlidScore] = useState<number>(0);
  const [creditScore, setCreditScore] = useState<number>(0);
  const [committed, setCommitted] = useState<boolean>(false);
  const [inputAmount, setInputAmount] = useState<number>(0);

  const [available, setAvailable] = useState<number>(0);
  const [userOpenBids, setUserOpenBids] = useState<Bid[]>([]);
  const [userOpenAsks, setUserOpenAsks] = useState<Ask[]>([]);

  const period = useSelector(durationState);

  const handleInputAmount = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInputAmount(Number(e.target.value));

  const handleRate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const r = Number(e.target.value);

    if (r <= 0) return setRate(0);

    if (r > 100)
      return console.error("Enter an interest rate within 0.01% and 100%");

    setRate(Number(r.toFixed(2)));
  };

  const { chain } = useNetwork();
  const chainId = chain?.id;

  const { data } = useReads([
    {
      functionName: "deposits",
      args: [address!, getContract(chainId!).token],
    },
    {
      functionName: "getBids",
      args: [getContract(chainId!).token, period],
    },
    {
      functionName: "getAsks",
      args: [getContract(chainId!).token, period],
    },
    {
      functionName: "creditScore",
      args: [address!],
    },
  ]);

  const { config: limitBidConfig } = usePrepareWrite("limitBid", [
    getContract(chainId!).token,
    parseEther(inputAmount.toString()).toString(),
    period,
    Math.round(rate * 100),
  ]);

  const { write: writeLimitBid, isSuccess: success0 } =
    useContractWrite(limitBidConfig);

  const { config: marketBidConfig } = usePrepareWrite("marketBid", [
    getContract(chainId!).token,
    parseEther(inputAmount.toString()).toString(),
    period,
  ]);

  const { write: writeMarketBid, isSuccess: success1 } =
    useContractWrite(marketBidConfig);

  const { config: limitAskConfig } = usePrepareWrite("limitAsk", [
    getContract(chainId!).token,
    parseEther(inputAmount.toString()).toString(),
    period,
    Math.round(rate * 100),
  ]);

  const { write: writeLimitAsk, isSuccess: success2 } =
    useContractWrite(limitAskConfig);

  const { config: marketAskConfig } = usePrepareWrite("marketAsk", [
    getContract(chainId!).token,
    parseEther(inputAmount.toString()).toString(),
    period,
  ]);

  const { write: writeMarketAsk, isSuccess: success3 } =
    useContractWrite(marketAskConfig);

  const { config: setCreditScoreConfig } = usePrepareWrite("setCreditScore", [
    tlidScore,
  ]);

  const { write: writeSetCreditScore, isSuccess: success4 } =
    useContractWrite(setCreditScoreConfig);

  const transact = () => {
    switch (mode) {
      case "borrow":
        type === "limit" ? writeLimitBid?.() : writeMarketBid?.();
        break;
      case "lend":
        type === "limit" ? writeLimitAsk?.() : writeMarketAsk?.();
        break;
      default:
        console.error("Invalid mode...");
        break;
    }
  };

  useEffect(() => {
    // if (!address) return;
    // const run = async () => {
    //   const query = `
    //   {
    //     users(where: {address: "${address?.toLowerCase()}"}) {
    //       id
    //     }
    //   }
    //   `;

    //   const data = (
    //     await axios.post(
    //       "https://api.thegraph.com/subgraphs/name/talentlayer/talent-layer-mumbai",
    //       { query }
    //     )
    //   ).data;

    //   try {
    //     const id = data.data.users[0].id;
    //     if (!id) return console.error('Invalid id')

    //     const query = `
    //     {
    //       user(id: "${id}") {
    //         numReviews
    //         rating
    //       }
    //     }
    //     `

    //     const idData = (
    //       await axios.post(
    //         "https://api.thegraph.com/subgraphs/name/talentlayer/talent-layer-mumbai",
    //         { query }
    //       )
    //     ).data;

    //     console.log(idData)

    //   } catch (e) {
    //     console.error("Couldnt detect a talent layer id!");
    //   }
    // };

    // run();

    const numReviews = 10;
    const rating = 4.5;

    if (address && !committed)
      setTlidScore(Math.floor(((numReviews * rating) / 100) * 25));
  }, [address]);

  useEffect(() => {
    if (success4) {
      setCommitted(true);
      setTlidScore(0);
    }
  }, [success4]);

  useEffect(() => {
    if (!address) {
      setAvailable(0);
      setUserOpenBids([]);
      setUserOpenAsks([]);
      return;
    }

    const deposits = data?.[0].result as BigInt | undefined;
    const bids = data?.[1].result as Bid[];
    const asks = data?.[2].result as Ask[];
    const cs = data?.[3].result as bigint;

    if (deposits) setAvailable(Number(deposits) / 10 ** 18);
    if (cs) setCreditScore(Number(cs));

    const userOpenBid: Bid[] = [];
    const userOpenAsk: Ask[] = [];

    if (bids)
      bids.forEach((element: Bid) => {
        if (element.borrower === address) {
          userOpenBid.push(element);
        }
      });

    if (asks)
      asks.forEach((element: Ask) => {
        if (element.lender === address) {
          userOpenAsk.push(element);
        }
      });

    setUserOpenBids(userOpenBid);
    setUserOpenAsks(userOpenAsk);
  }, [address, data]);

  useEffect(() => {
    if (success0 || success1 || success2 || success3)
      throwNotification(
        generateSuccess(
          `Successfully sent your ${
            type === "limit" ? "limit" : "market"
          } order!`
        )
      );
  }, [success0, success1, success2, success3]);

  useEffect(() => {
    if (success4)
      throwNotification(
        generateSuccess(`Successfully committed your TalentLayer reputation!`)
      );
  }, [success4]);

  return (
    <div className="col-span-1 flex flex-col gap-3">
      <div className="flex flex-col gap-6 bg-white bg-opacity-5 rounded-2xl p-6">
        <Modal
          title={"TLID Detected"}
          isOpen={!committed}
          closeModal={() => {
            setCommitted(true);
            setTlidScore(0);
          }}
        >
          <div className="flex flex-col gap-4">
            <p className="opacity-80">
              We've detected a valid talent layer id with a combined score of{" "}
              <span className="font-bold">{tlidScore}</span>. Commit it on-chain
              to get a better borrow limit!
            </p>
            <Button
              title={"Commit"}
              isActive
              onClick={() => writeSetCreditScore?.()}
            ></Button>
          </div>
        </Modal>
        <Mode mode={mode} setMode={setMode} />
        <InputParams
          type={type}
          inputAmount={inputAmount}
          rate={rate}
          setType={setType}
          handleInputAmount={handleInputAmount}
          handleRate={handleRate}
        />
        {mode === "lend" && (
          <div className="flex items-center gap-2">
            <input type="checkbox" className="checkbox checkbox-primary" />
            <p className="opacity-80">Opt. in to under-collateralised loans.</p>
          </div>
        )}
        <button
          className={`flex items-center justify-center h-16 text-base-content ${
            mode === "borrow" ? "bg-success" : "bg-error"
          } font-bold rounded-lg transition-all duration-500`}
          onClick={transact}
        >
          {capitalizeFirst(mode)}
        </button>
        <Meta
          available={available}
          userOpenBids={userOpenBids}
          userOpenAsks={userOpenAsks}
          period={period}
          creditScore={creditScore}
        />
      </div>
    </div>
  );
};

export default Panel;
