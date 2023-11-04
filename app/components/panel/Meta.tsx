import { Ask, Bid } from '@/types/orders'
import { iPeriod } from '@/types'
import { ethers } from 'ethers'
import Image from 'next/image'
import { FC, useMemo, useState } from 'react'

interface Props {
  available: number
  userOpenBids: Bid[]
  userOpenAsks: Ask[]
  period: iPeriod
}

const Meta: FC<Props> = ({ available, userOpenBids, userOpenAsks, period }) => {
  const [totalOpenBids, setTotalOpenBids] = useState(0)
  const [totalOpenAsks, setTotalOpenAsks] = useState(0)

  useMemo(() => {
    let bidTotal = 0
    let askTotal = 0

    userOpenBids.forEach((element) => {
      bidTotal += Number(ethers.utils.formatEther(element.amount))
    })

    userOpenAsks.forEach((element) => {
      askTotal += Number(ethers.utils.formatEther(element.amount))
    })

    setTotalOpenBids(bidTotal)
    setTotalOpenAsks(askTotal)
  }, [userOpenBids, userOpenAsks])

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-white opacity-60">Available</p>
        <div className="flex items-center gap-2">
          <Image
            src="/tokens/core.svg"
            alt="core-token"
            width={20}
            height={20}
          />
          <p>{available ? available.toLocaleString() : '0.00'}</p>
        </div>
      </div>

      {/* TODO: ADD ENTRY FOR YOUR CREDIT SCORE */}

      <div className="flex items-center justify-between">
        <p className="text-white opacity-60">Borrow Limit</p>
        <div className="flex items-center gap-2">
          <Image
            src="/tokens/core.svg"
            alt="core-token"
            width={20}
            height={20}
          />
          {/* TODO: CHANGE LATER WITH CREDIT SCORE */}
          <p>{available ? ((Number(available) * 85) / 100).toLocaleString() : '0.00'}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-white opacity-60">Open Bids ({period}D)</p>
        <div className="flex items-center gap-2">
          <Image
            src="/tokens/core.svg"
            alt="core-token"
            width={20}
            height={20}
          />
          <p>{totalOpenBids ? totalOpenBids.toLocaleString() : '0.00'}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-white opacity-60">Open Asks ({period}D)</p>
        <div className="flex items-center gap-2">
          <Image
            src="/tokens/core.svg"
            alt="core-token"
            width={20}
            height={20}
          />
          <p>{totalOpenAsks ? totalOpenAsks.toLocaleString() : '0.00'}</p>
        </div>
      </div>
    </div>
  )
}

export default Meta
