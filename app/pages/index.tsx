import Panel from '@/components/panel'
import { FC } from 'react'

const Home: FC = () => {
  return (
    <div className="grid lg:grid-cols-4 grid-cols-1 gap-5 py-5">
    <div className="flex flex-col gap-5">
      <Panel />

    </div>
  </div>

  )
}

export default Home