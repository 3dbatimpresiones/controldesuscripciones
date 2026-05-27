import { Bell, Plus } from 'lucide-react'

interface EncabezadoProps {
  titulo: string
  descripcion?: string
  accion?: {
    etiqueta: string
    onClick: () => void
  }
}

export function Encabezado({ titulo, descripcion, accion }: EncabezadoProps) {
  return (
    <header className="flex items-center justify-between px-8 py-5 border-b"
      style={{ borderColor: '#2a2a2f', backgroundColor: '#141416' }}>
      <div>
        <h1 className="text-lg font-semibold" style={{ color: '#e8e8ed' }}>{titulo}</h1>
        {descripcion && (
          <p className="text-sm mt-0.5" style={{ color: '#8b8b97' }}>{descripcion}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-lg transition-colors"
          style={{ color: '#8b8b97' }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.color = '#e8e8ed'
            ;(e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.06)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.color = '#8b8b97'
            ;(e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
          }}
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: '#7c6af7' }} />
        </button>
        {accion && (
          <button
            onClick={accion.onClick}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{ backgroundColor: '#7c6af7', color: '#fff' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = '#6b59e8'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = '#7c6af7'}
          >
            <Plus size={16} />
            {accion.etiqueta}
          </button>
        )}
      </div>
    </header>
  )
}
