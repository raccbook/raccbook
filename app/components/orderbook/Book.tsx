import { setAsks, setBids } from '@/redux/orders'
import { Ask, Bid } from '@/types/orders'
import { formatEther } from 'viem'
import { formatBasisPointRate } from '@/utils/format'
import { FC, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

interface Props {
  bids: Bid[]
  asks: Ask[]
}

const Book: FC<Props> = ({ bids, asks }) => {
  const dispatch = useDispatch()

  const [sortedBids, setSortedBids] = useState<Bid[]>([])
  const [sortedAsks, setSortedAsks] = useState<Ask[]>([])

  useEffect(() => {
    if (!bids || !asks) return

    const newBids = [...bids]
    const newAsks = [...asks]

    const sortedBids = newBids.sort((a, b) => {
      if (a.rate < b.rate) {
        return 1
      } else if (a.rate > b.rate) {
        return -1
      } else {
        return 0
      }
    })

    const sortedAsks = newAsks.sort((a, b) => {
      if (a.rate > b.rate) {
        return 1
      } else if (a.rate < b.rate) {
        return -1
      } else {
        return 0
      }
    })

    setSortedBids(sortedBids)
    dispatch(setBids(sortedBids))
    setSortedAsks(sortedAsks)
    dispatch(setAsks(sortedAsks))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bids, asks])

  const stripeGradient = (percentage: number, c: 'green' | 'red') => {
    const color =
      c === 'green' ? 'rgba(65, 142, 96, 0.32)' : 'rgba(240, 90, 71, 0.2)'

    const orientation = c === 'green' ? 'left' : 'right'

    return {
      background: `linear-gradient(
      to ${orientation},
      ${color},
      ${color} ${percentage}%,
      transparent ${percentage}%,
      transparent
    )`,
    }
  }

  return (
    <div className="flex overflow-y-scroll" style={{ maxHeight: '60vh' }}>
      {/* BIDS */}
      <div className="w-1/2">
        <>
          {sortedBids &&
            sortedBids.map(({ amount, rate }, index) => {
              return (
                <div
                  className={`flex justify-between pr-6 py-3`}
                  style={{ ...stripeGradient((index + 1) * 4, 'green') }}
                  key={index}
                >
                  <p>{formatEther(amount)}</p>
                  <p className="text-[#44F289]">
                    {formatBasisPointRate(rate)}%
                  </p>
                </div>
              )
            })}
        </>
      </div>
      {/* ASKS */}
      <div className="w-1/2">
        <>
          {sortedAsks &&
            sortedAsks.map(({ amount, rate }, index) => {
              return (
                <div
                  className={`flex justify-between pl-6 py-3`}
                  style={{ ...stripeGradient((index + 1) * 4, 'red') }}
                  key={index}
                >
                  <p className="text-[#F05A47]">
                    {formatBasisPointRate(rate)}%
                  </p>
                  <p>{formatEther(amount)}</p>
                </div>
              )
            })}
        </>
      </div>
    </div>
  )
}

export default Book
