import { EXPLORER_URL } from "@/constants";
import { usePrepareWrite } from "@/hooks/usePrepareWrite";
import { Loan } from "@/types/orders";
import { formatAddress, formatBasisPointRate } from "@/utils/format";
import { getTimeAgo } from "@/utils/time";
import Image from "next/image";
import { FC, useEffect, useState } from "react";
import { formatEther } from "viem";
import { useContractWrite } from "wagmi";
import { ClockIcon } from "@heroicons/react/24/outline";

interface Props {
  address: string;
  loans: Loan[];
}

const ActiveLoans: FC<Props> = ({ address, loans }) => {
  const [id, setId] = useState<number>(0)
  const [liquidateId, setLiquidateId] = useState<number>(0)
  const openLink = (url: string) => window.open(url, "_blank");

  const { config: repayConfig } = usePrepareWrite("repay", [id]);
  const { config: liquidateConfig } = usePrepareWrite("liquidateDemo", [liquidateId]);

  const { write, isSuccess } = useContractWrite(repayConfig);
  const { write: writeLiquidate, isSuccess: isLiquidated } = useContractWrite(liquidateConfig);

  const repay = (id: bigint) => {
    setId(Number(id));
  };

  const liquidate = (id: bigint) => {
    setLiquidateId(Number(id))
  }

  useEffect(() => {
    if (id) {
      write?.()
      setId(0)
    }
  }, [id])

  useEffect(() => {
    if (liquidateId) {
      writeLiquidate?.()
      setLiquidateId(0)
    }
  }, [liquidateId])

  return (
    <table className="table-auto w-full">
      <thead className="bg-white bg-opacity-2">
        <tr>
          <th className="py-4 text-left">
            <ClockIcon className="h-6 w-6 text-gray-500" />
          </th>
          <th className="py-4 text-left">Rate</th>
          <th className="py-4 text-left">Amount</th>
          <th className="py-4 text-left">Borrower</th>
          <th className="py-4 text-left">Lender</th>
          <th className="py-4 text-left">Action</th>
        </tr>
      </thead>
      <tbody>
        {loans.map((loan) => {
          return (
            <tr key={Math.random()}>
              <td className="py-2">{getTimeAgo(loan.startDate)}</td>
              <td className="py-2">{formatBasisPointRate(loan.rate)}%</td>
              <td className="py-2">{formatEther(loan.amount)}</td>
              <td
                className="py-2 text-[#0BBBFA] cursor-pointer transition-all duration-500"
                onClick={() => openLink(EXPLORER_URL + loan.borrower)}
              >
                {formatAddress(loan.borrower)}
              </td>
              <td
                className="py-2 text-[#0BBBFA] cursor-pointer transition-all duration-500"
                onClick={() => openLink(EXPLORER_URL + loan.lender)}
              >
                {formatAddress(loan.lender)}
              </td>

              {loan.borrower !== address ? (
                <td className="py-2">
                  <button
                    className="px-2 py-1 bg-white bg-opacity-10 rounded-md"
                    onClick={() => repay(loan.id)}
                  >
                    Repay
                  </button>
                </td>
              ) : (
                <td className="py-2"><td className="py-2">
                <button
                  className="px-2 py-1 bg-white bg-opacity-10 rounded-md"
                  onClick={() => liquidate(loan.id)}
                >
                  Liquidate
                </button>
              </td></td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ActiveLoans;
