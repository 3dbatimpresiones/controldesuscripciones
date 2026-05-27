import type { LucideIcon } from 'lucide-react'

interface TarjetaMetricaProps {
  titulo: string
  valor: string
  descripcion?: string
  icono: LucideIcon
  colorIcono?: string
  tendencia?: {
    valor: string
    positiva: boolean
  }
}

export function TarjetaMetrica({ titulo, valor, descripcion, icono: Icono, colorIcono = '#7c6af7', tendencia }: TarjetaMetricaProps) {
  return (
    <div className="p-5 rounded-xl border transition-all duration-200"
      style={{ backgroundColor: '#1a1a1d', borderColor: '#2a2a2f' }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = '#3a3a45'}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = '#2a2a2f'}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${colorIcono}18`, border: `1px solid ${colorIcono}30` }}>
          <Icono size={17} style={{ color: colorIcono }} />
        </div>
        {tendencia && (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{
              color: tendencia.positiva ? '#22c55e' : '#ef4444',
              backgroundColor: tendencia.positiva ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
            }}>
            {tendencia.valor}
          </span>
        )}
      </div>
      <div>
        <p className="text-xs font-medium mb-1" style={{ color: '#8b8b97' }}>{titulo}</p>
        <p className="text-2xl font-semibold tracking-tight" style={{ color: '#e8e8ed' }}>{valor}</p>
        {descripcion && (
          <p className="text-xs mt-1" style={{ color: '#4a4a55' }}>{descripcion}</p>
        )}
      </div>
    </div>
  )
}
