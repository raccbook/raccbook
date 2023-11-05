import { useRead } from '@/hooks/useRead'
import { useReads } from '@/hooks/useReads'
import { Loan } from '@/types/orders'
import { FC, useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import ActiveLoans from './ActiveLoans'

const Trades: FC = () => {
  const { address } = useAccount()

  const [loanIds, setLoanIds] = useState<BigInt[]>([])
  const [loans, setLoans] = useState<Loan[]>([])

  const { data: ids } = useRead('getLoanIds', [address])

  const { data: allLoans } = useReads(
    loanIds.map((id) => ({
      functionName: 'loans',
      args: [address, id],
    }))
  )

  useEffect(() => {
    if (ids) setLoanIds(ids as BigInt[])
    else setLoanIds([])
  }, [ids])

  useEffect(() => {
    const loans: Loan[] = []

    allLoans?.forEach((loan: any) => {
      if (
        loan.result.lender !== '0x0000000000000000000000000000000000000000' &&
        loan.result.borrower !== '0x0000000000000000000000000000000000000000'
      )
        loans.push({
          id: loan.result[0],
          lender: loan.result[1],
          borrower: loan.result[2],
          token: loan.result[3],
          term: loan.result[4],
          amount: loan.result[5],
          rate: loan.result[6],
          startDate: loan.result[7],
          endDate: loan.result[8],
          repaymentAmount: loan.result[9],
        })
    })
    setLoans(loans)
  }, [allLoans])

  return (
    <div className="col-span-1 flex flex-col gap-5">
      <div
        className="flex flex-col bg-white bg-opacity-5 rounded-2xl overflow-y-scroll"
        style={{ maxHeight: '40vh' }}
      >
        <h1 className="text-xl font-bold p-6">Active Loans</h1>
        {loans && address && loans.length > 0 ? (
          <ActiveLoans address={address} loans={loans} />
        ) : (
          <div className="flex flex-col items-center justify-center gap-6 p-6">
            <p className='opacity-80'>You currently have no active loans.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Trades
