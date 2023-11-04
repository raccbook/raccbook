import { iTypes } from '@/types'
import { FC } from 'react'

interface Props {
  type: iTypes
  inputAmount: number
  rate: number
  setType: (type: iTypes) => void
  handleInputAmount: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleRate: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const InputParams: FC<Props> = ({
  type,
  inputAmount,
  rate,
  setType,
  handleInputAmount,
  handleRate,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <input
          className="w-full rounded-lg bg-white bg-opacity-4 h-14 pr-10 p-4 transition-all duration-500 outline-none"
          type="number"
          placeholder="Input amount"
          value={inputAmount > 0 ? inputAmount : ''}
          onChange={handleInputAmount}
        />
        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-white opacity-60">
          CORE
        </span>
      </div>
      <div
        className={`overflow-hidden transition-all duration-500 ${
          type === 'limit' ? 'h-14' : 'h-0'
        }`}
      >
        <input
          className="w-full rounded-lg bg-white bg-opacity-4 h-14 pr-10 p-4 outline-none"
          type="number"
          placeholder="Enter rate (%)"
          step={0.01}
          value={rate > 0 ? rate : ''}
          onChange={handleRate}
        />
      </div>

      <div className="flex items-center bg-white bg-opacity-4 rounded-lg p-1 gap-2">
        <div
          className={`flex items-center justify-center w-1/2 h-10 ${
            type === 'limit' ? 'bg-white bg-opacity-12' : 'text-opacity-60 text-white'
          } rounded-lg cursor-pointer transition-all duration-500`}
          onClick={() => setType('limit')}
        >
          Limit
        </div>
        <div
          className={`flex items-center justify-center w-1/2 h-10 ${
            type === 'market' ? 'bg-white bg-opacity-12' : 'text-opacity-60 text-white'
          } rounded-lg cursor-pointer transition-all duration-500`}
          onClick={() => setType('market')}
        >
          Market
        </div>
      </div>
    </div>
  )
}

export default InputParams
