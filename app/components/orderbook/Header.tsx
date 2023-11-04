import { iPeriod } from '@/types'
import Image from 'next/image'
import { FC } from 'react'

interface Props {
  period: iPeriod
  handlePeriod: (period: iPeriod) => void
}

const Header: FC<Props> = ({ period, handlePeriod }) => {
  return (
    <div className="flex items-center justify-between pb-6">
      <div className="flex items-center gap-5">
        <Image src="/tokens/core.svg" alt="core-token" width={48} height={48} />
        <div>
          <p className="text-xl font-bold">CORE</p>
          <p className="text-white opacity-60">$0.3942</p>
        </div>
      </div>

      <div className="flex flex-col items-start gap-2">
        <p>Duration</p>
        <div className="flex items-center gap-2">
          <div
            className={`${
              period === 1 && 'bg-white bg-opacity-20'
            } p-1 px-4 rounded-full cursor-pointer transition-all duration-500`}
            onClick={() => handlePeriod(1)}
          >
            1D
          </div>
          <div
            className={`${
              period === 7 && 'bg-white bg-opacity-20'
            } p-1 px-4 rounded-full cursor-pointer transition-all duration-500`}
            onClick={() => handlePeriod(7)}
          >
            7D
          </div>
          <div
            className={`${
              period === 30 && 'bg-white bg-opacity-20'
            } p-1 px-4 rounded-full cursor-pointer transition-all duration-500`}
            onClick={() => handlePeriod(30)}
          >
            30D
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
