import { iModes } from '@/types'
import { FC } from 'react'

interface Props {
  mode: iModes
  setMode: (mode: iModes) => void
}

const Mode: FC<Props> = ({ mode, setMode }) => {
  return (
    <div className="flex items-center">
      <div
        className={`flex items-center justify-center w-1/2 h-10 ${
          mode === 'borrow' ? 'bg-success' : 'bg-white bg-opacity-4'
        } rounded-tl-lg rounded-bl-lg cursor-pointer transition-all duration-500`}
        onClick={() => setMode('borrow')}
      >
        Borrow
      </div>
      <div
        className={`flex items-center justify-center w-1/2 h-10 ${
          mode === 'lend' ? 'bg-error' : 'bg-white bg-opacity-4'
        } rounded-tr-lg rounded-br-lg cursor-pointer transition-all duration-500`}
        onClick={() => setMode('lend')}
      >
        Lend
      </div>
    </div>
  )
}

export default Mode
