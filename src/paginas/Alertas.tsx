import { useMemo } from 'react'
import { Bell, AlertTriangle, Clock, CheckCircle2, XCircle } from 'lucide-react'
import { Encabezado } from '@/componentes/diseno/Encabezado'
import { EstadoBadge, UsoBadge } from '@/componentes/comunes/EstadoBadge'
import { useSuscripciones } from '@/hooks/useSuscripciones'
import { formatearMoneda, formatearFecha, calcularDiasHastaRenovacion, etiquetaDiasRestantes, obtenerCategoria } from '@/utilidades'

interface GrupoAlerta {
  titulo: string
  descripcion: string
  icono: typeof Bell
  colorIcono: string
  colorFondo: string
  suscripciones: ReturnType<typeof useSuscripciones>['suscripciones']
}

export function Alertas() {
  const { suscripciones, cargando } = useSuscripciones({ estados: ['activa'] })

  const grupos = useMemo((): GrupoAlerta[] => {
    const urgentes = suscripciones.filter(s => {
      const dias = calcularDiasHastaRenovacion(s.fecha_renovacion)
      return dias >= 0 && dias <= 3
    })
    const proximas = suscripciones.filter(s => {
      const dias = calcularDiasHastaRenovacion(s.fecha_renovacion)
      return dias > 3 && dias <= 7
    })
    const estaSemana = suscripciones.filter(s => {
      const dias = calcularDiasHastaRenovacion(s.fecha_renovacion)
      return dias > 7 && dias <= 14
    })
    const sinUso = suscripciones.filter(s => s.nivel_uso === 'sin_uso')
    const bajoUso = suscripciones.filter(s => s.nivel_uso === 'bajo')

    return [
      {
        titulo: 'Renovaciones urgentes',
        descripcion: 'Se renuevan en los próximos 3 días',
        icono: AlertTriangle,
        colorIcono: '#ef4444',
        colorFondo: 'rgba(239,68,68,0.08)',
        suscripciones: urgentes,
      },
      {
        titulo: 'Esta semana',
        descripcion: 'Se renuevan en los próximos 7 días',
        icono: Clock,
        colorIcono: '#f59e0b',
        colorFondo: 'rgba(245,158,11,0.08)',
        suscripciones: proximas,
      },
      {
        titulo: 'Próximas 2 semanas',
        descripcion: 'Se renuevan en los próximos 14 días',
        icono: Bell,
        colorIcono: '#3b82f6',
        colorFondo: 'rgba(59,130,246,0.08)',
        suscripciones: estaSemana,
      },
      {
        titulo: 'Servicios sin uso',
        descripcion: 'Considerá cancelarlos para ahorrar',
        icono: XCircle,
        colorIcono: '#ef4444',
        colorFondo: 'rgba(239,68,68,0.05)',
        suscripciones: sinUso,
      },
      {
        titulo: 'Servicios con poco uso',
        descripcion: 'Evaluá si siguen siendo necesarios',
        icono: CheckCircle2,
        colorIcono: '#f97316',
        colorFondo: 'rgba(249,115,22,0.05)',
        suscripciones: bajoUso,
      },
    ].filter(g => g.suscripciones.length > 0)
  }, [suscripciones])

  if (cargando) {
    return (
      <div className="flex flex-col min-h-screen">
        <Encabezado titulo="Alertas" descripcion="Notificaciones sobre tus suscripciones" />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 animar-giro"
            style={{ borderColor: '#7c6af7', borderTopColor: 'transparent' }} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Encabezado
        titulo="Alertas"
        descripcion="Notificaciones y recordatorios sobre tus suscripciones"
      />

      <div className="flex-1 p-8 space-y-6">

        {grupos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ backgroundColor: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)' }}>
              <CheckCircle2 size={28} style={{ color: '#22c55e' }} />
            </div>
            <p className="text-base font-medium mb-1" style={{ color: '#e8e8ed' }}>
              Todo en orden
            </p>
            <p className="text-sm" style={{ color: '#8b8b97' }}>
              No tenés alertas pendientes por el momento
            </p>
          </div>
        ) : (
          grupos.map((grupo, gIdx) => {
            const Icono = grupo.icono
            return (
              <section key={gIdx}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: grupo.colorFondo }}>
                    <Icono size={14} style={{ color: grupo.colorIcono }} />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold" style={{ color: '#e8e8ed' }}>{grupo.titulo}</h2>
                    <p className="text-xs" style={{ color: '#8b8b97' }}>{grupo.descripcion}</p>
                  </div>
                  <span className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: grupo.colorFondo, color: grupo.colorIcono }}>
                    {grupo.suscripciones.length}
                  </span>
                </div>

                <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: '#1a1a1d', borderColor: '#2a2a2f' }}>
                  {grupo.suscripciones.map((s, idx) => {
                    const dias = calcularDiasHastaRenovacion(s.fecha_renovacion)
                    const categoria = obtenerCategoria(s.categoria)
                    return (
                      <div
                        key={s.id}
                        className="flex items-center gap-4 px-5 py-4 transition-colors"
                        style={{ borderBottom: idx < grupo.suscripciones.length - 1 ? '1px solid #222226' : 'none' }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.02)'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
                      >
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold"
                          style={{ backgroundColor: `${categoria.color}20`, color: categoria.color }}>
                          {s.nombre[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium" style={{ color: '#e8e8ed' }}>{s.nombre}</p>
                          <p className="text-xs" style={{ color: '#8b8b97' }}>{categoria.etiqueta}</p>
                        </div>
                        <EstadoBadge estado={s.estado} tamaño="sm" />
                        <UsoBadge nivel={s.nivel_uso} />
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-semibold" style={{ color: '#e8e8ed' }}>
                            {formatearMoneda(s.precio, s.moneda)}
                          </p>
                          {s.estado === 'activa' && (
                            <p className="text-xs" style={{ color: dias <= 3 ? '#ef4444' : dias <= 7 ? '#f59e0b' : '#8b8b97' }}>
                              {etiquetaDiasRestantes(dias)} · {formatearFecha(s.fecha_renovacion)}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            )
          })
        )}

        {/* Info sobre notificaciones futuras */}
        <div className="p-4 rounded-xl border" style={{ borderColor: '#2a2a2f', backgroundColor: 'rgba(124,106,247,0.04)' }}>
          <div className="flex items-start gap-3">
            <Bell size={16} className="flex-shrink-0 mt-0.5" style={{ color: '#7c6af7' }} />
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: '#e8e8ed' }}>Notificaciones por email</p>
              <p className="text-xs" style={{ color: '#8b8b97' }}>
                Las notificaciones automáticas por email estarán disponibles próximamente.
                Por ahora, revisá esta sección regularmente para estar al tanto de tus renovaciones.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
