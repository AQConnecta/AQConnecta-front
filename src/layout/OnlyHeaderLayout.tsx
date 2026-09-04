import { Outlet } from 'react-router-dom'
import Header from './components/Header'

function OnlyHeaderLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
        <Outlet />
      </main>
    </div>
  )
}

export default OnlyHeaderLayout
