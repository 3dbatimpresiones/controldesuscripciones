import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { LayoutPrincipal } from '@/componentes/diseno/LayoutPrincipal'
import { Dashboard } from '@/paginas/Dashboard'
import { Suscripciones } from '@/paginas/Suscripciones'
import { Calendario } from '@/paginas/Calendario'
import { Alertas } from '@/paginas/Alertas'
import { Reportes } from '@/paginas/Reportes'
import { Configuracion } from '@/paginas/Configuracion'
import { Autenticacion } from '@/paginas/Autenticacion'

function RutaProtegida({ children }: { children: React.ReactNode }) {
  const { autenticado, cargando } = useAuth()

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#141416' }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 animar-giro"
            style={{ borderColor: '#7c6af7', borderTopColor: 'transparent' }} />
          <p className="text-sm" style={{ color: '#8b8b97' }}>Cargando...</p>
        </div>
      </div>
    )
  }

  if (!autenticado) {
    return <Navigate to="/auth" replace />
  }

  return <>{children}</>
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/auth" element={<Autenticacion />} />
        <Route
          path="/"
          element={
            <RutaProtegida>
              <LayoutPrincipal />
            </RutaProtegida>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="suscripciones" element={<Suscripciones />} />
          <Route path="calendario" element={<Calendario />} />
          <Route path="alertas" element={<Alertas />} />
          <Route path="reportes" element={<Reportes />} />
          <Route path="configuracion" element={<Configuracion />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}
