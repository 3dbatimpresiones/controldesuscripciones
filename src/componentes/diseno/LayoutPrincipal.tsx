import { Outlet } from 'react-router-dom'
import { BarraLateral } from './BarraLateral'

export function LayoutPrincipal() {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#141416' }}>
      <BarraLateral />
      <main className="flex-1 ml-60 flex flex-col min-h-screen overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  )
}
