import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  CreditCard,
  Calendar,
  Bell,
  BarChart3,
  Settings,
  Zap,
  LogOut,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/utilidades/formato'

const NAVEGACION = [
  { ruta: '/', icono: LayoutDashboard, etiqueta: 'Dashboard' },
  { ruta: '/suscripciones', icono: CreditCard, etiqueta: 'Suscripciones' },
  { ruta: '/calendario', icono: Calendar, etiqueta: 'Calendario' },
  { ruta: '/alertas', icono: Bell, etiqueta: 'Alertas' },
  { ruta: '/reportes', icono: BarChart3, etiqueta: 'Reportes' },
  { ruta: '/configuracion', icono: Settings, etiqueta: 'Configuración' },
]

export function BarraLateral() {
  const { cerrarSesion, usuario } = useAuth()

  return (
    <aside className="fixed inset-y-0 left-0 w-60 flex flex-col border-r z-30"
      style={{ backgroundColor: '#0f0f10', borderColor: '#2a2a2f' }}>

      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-5 border-b" style={{ borderColor: '#2a2a2f' }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: 'rgba(124, 106, 247, 0.2)', border: '1px solid rgba(124, 106, 247, 0.3)' }}>
          <Zap size={16} style={{ color: '#7c6af7' }} />
        </div>
        <div>
          <span className="font-semibold text-sm" style={{ color: '#e8e8ed' }}>Substrack</span>
          <p className="text-xs" style={{ color: '#8b8b97' }}>Gestor de suscripciones</p>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAVEGACION.map(({ ruta, icono: Icono, etiqueta }) => (
          <NavLink
            key={ruta}
            to={ruta}
            end={ruta === '/'}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
              isActive
                ? 'text-white'
                : 'hover:text-white'
            )}
            style={({ isActive }) => ({
              color: isActive ? '#e8e8ed' : '#8b8b97',
              backgroundColor: isActive ? 'rgba(124, 106, 247, 0.15)' : 'transparent',
            })}
            onMouseEnter={e => {
              if (!(e.currentTarget as HTMLElement).classList.contains('active')) {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.04)'
              }
            }}
            onMouseLeave={e => {
              if (!(e.currentTarget as HTMLElement).querySelector('[aria-current]')) {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
              }
            }}
          >
            <Icono size={17} />
            <span>{etiqueta}</span>
          </NavLink>
        ))}
      </nav>

      {/* Usuario */}
      <div className="p-3 border-t" style={{ borderColor: '#2a2a2f' }}>
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg mb-1"
          style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
            style={{ backgroundColor: 'rgba(124, 106, 247, 0.2)', color: '#7c6af7' }}>
            {usuario?.email?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <span className="text-xs truncate flex-1" style={{ color: '#8b8b97' }}>
            {usuario?.email ?? 'usuario@email.com'}
          </span>
        </div>
        <button
          onClick={cerrarSesion}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors"
          style={{ color: '#8b8b97' }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.color = '#ef4444'
            ;(e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(239,68,68,0.08)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.color = '#8b8b97'
            ;(e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
          }}
        >
          <LogOut size={15} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  )
}
