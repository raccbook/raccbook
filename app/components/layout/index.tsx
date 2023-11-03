import { FC, ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'
import Header from './Header'

interface Props {
  children: ReactNode
}

const Layout: FC<Props> = ({ children }) => {
  return (
    <div className="h-screen overflow-y-scroll bg-base-200">
      <Toaster position="bottom-right" />
      <Header />
      <div className="mx-auto max-w-8xl">{children}</div>
    </div>
  )
}

export default Layout
