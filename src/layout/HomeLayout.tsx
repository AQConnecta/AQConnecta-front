import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import Right from './components/Right'
import Left from './components/Left'

function HomeLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24">
              <Left />
            </div>
          </div>

          <main className="lg:col-span-6">
            <Outlet />
          </main>

          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24">
              <Right />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeLayout
