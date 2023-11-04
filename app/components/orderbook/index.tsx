import { CONTRACT, TOKEN } from "@/constants";
import { durationState, setDuration } from "@/redux/meta";
import { Ask, Bid } from "@/types/orders";
import { iPeriod } from "@/types";
import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useContractReads } from "wagmi";
import Book from "./Book";
import Header from "./Header";

const Orderbook: FC = () => {
  const dispatch = useDispatch();

  const [period, setPeriod] = useState<iPeriod>(useSelector(durationState));
  const [asks, setAsks] = useState<Ask[]>([]);
  const [bids, setBids] = useState<Bid[]>([]);

  const { data } = useContractReads({
    contracts: [
      {
        ...CONTRACT,
        functionName: "getBids",
        args: [TOKEN, period],
      },
      {
        ...CONTRACT,
        functionName: "getAsks",
        args: [TOKEN, period],
      },
    ],
    watch: true,
  });

  useEffect(() => {
    const bids = data?.[0].result;
    const asks = data?.[1].result;

    if (asks) setAsks(asks as Ask[]);
    if (bids) setBids(bids as Bid[]);
  }, [data]);

  const handlePeriod = (period: iPeriod) => {
    dispatch(setDuration(period));
    setPeriod(period);
  };

  return (
    <div className="lg:col-span-3">
      <div className="flex flex-col bg-white bg-opacity-5 rounded-2xl p-6">
        <Header period={period} handlePeriod={handlePeriod} />
        <div className="flex items-center justify-between py-4 border-custom">
          <p className="text-white opacity-60">Bid Amount</p>
          <p className="text-white opacity-60">Ask Amount</p>
        </div>
        <Book asks={asks} bids={bids} />
      </div>
    </div>
  );
};

export default Orderbook;
