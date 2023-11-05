import Orderbook from '@/components/orderbook'
import Panel from '@/components/panel'
import Trades from '@/components/trades'
import { FC } from 'react'

const Home: FC = () => {
  return (
    <div className="grid lg:grid-cols-4 grid-cols-1 gap-5 py-5">
    <div className="flex flex-col gap-5">
      <Panel />
      <Trades />
    </div>
    <Orderbook />

  </div>

  )
}

export default Home