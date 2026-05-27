import type { EstadoSuscripcion, NivelUso } from '@/tipos'

const COLORES_ESTADO: Record<EstadoSuscripcion, { bg: string; text: string; dot: string }> = {
  activa: { bg: 'rgba(34,197,94,0.1)', text: '#22c55e', dot: '#22c55e' },
  pausada: { bg: 'rgba(245,158,11,0.1)', text: '#f59e0b', dot: '#f59e0b' },
  cancelada: { bg: 'rgba(107,114,128,0.1)', text: '#6b7280', dot: '#6b7280' },
  vencida: { bg: 'rgba(239,68,68,0.1)', text: '#ef4444', dot: '#ef4444' },
}

const ETIQUETAS_ESTADO: Record<EstadoSuscripcion, string> = {
  activa: 'Activa',
  pausada: 'Pausada',
  cancelada: 'Cancelada',
  vencida: 'Vencida',
}

const COLORES_USO: Record<NivelUso, { bg: string; text: string }> = {
  alto: { bg: 'rgba(34,197,94,0.1)', text: '#22c55e' },
  medio: { bg: 'rgba(245,158,11,0.1)', text: '#f59e0b' },
  bajo: { bg: 'rgba(249,115,22,0.1)', text: '#f97316' },
  sin_uso: { bg: 'rgba(239,68,68,0.1)', text: '#ef4444' },
}

const ETIQUETAS_USO: Record<NivelUso, string> = {
  alto: 'Alto',
  medio: 'Medio',
  bajo: 'Bajo',
  sin_uso: 'Sin uso',
}

interface EstadoBadgeProps {
  estado: EstadoSuscripcion
  tamaño?: 'sm' | 'md'
}

export function EstadoBadge({ estado, tamaño = 'md' }: EstadoBadgeProps) {
  const colores = COLORES_ESTADO[estado]
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full font-medium"
      style={{
        backgroundColor: colores.bg,
        color: colores.text,
        padding: tamaño === 'sm' ? '2px 8px' : '3px 10px',
        fontSize: tamaño === 'sm' ? '11px' : '12px',
      }}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: colores.dot }} />
      {ETIQUETAS_ESTADO[estado]}
    </span>
  )
}

interface UsoBadgeProps {
  nivel: NivelUso
}

export function UsoBadge({ nivel }: UsoBadgeProps) {
  const colores = COLORES_USO[nivel]
  return (
    <span className="inline-flex items-center rounded-full text-xs font-medium"
      style={{ backgroundColor: colores.bg, color: colores.text, padding: '2px 8px' }}>
      {ETIQUETAS_USO[nivel]}
    </span>
  )
}
