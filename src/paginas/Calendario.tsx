import { useState, useMemo } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, isSameMonth, addMonths, subMonths } from 'date-fns'
import { es } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { Encabezado } from '@/componentes/diseno/Encabezado'
import { EstadoBadge } from '@/componentes/comunes/EstadoBadge'
import { useSuscripciones } from '@/hooks/useSuscripciones'
import { formatearMoneda, obtenerCategoria } from '@/utilidades'
import { parseISO } from 'date-fns'

export function Calendario() {
  const [mesActual, setMesActual] = useState(new Date())
  const { suscripciones, cargando } = useSuscripciones({ estados: ['activa'] })

  const diasDelMes = useMemo(() => {
    const inicio = startOfMonth(mesActual)
    const fin = endOfMonth(mesActual)
    return eachDayOfInterval({ start: inicio, end: fin })
  }, [mesActual])

  const primerDia = getDay(startOfMonth(mesActual))
  const diasPrevios = primerDia === 0 ? 6 : primerDia - 1

  const renovacionesPorDia = useMemo(() => {
    const mapa = new Map<string, typeof suscripciones>()
    suscripciones.forEach(s => {
      const clave = s.fecha_renovacion
      if (!mapa.has(clave)) mapa.set(clave, [])
      mapa.get(clave)!.push(s)
    })
    return mapa
  }, [suscripciones])

  const [diaSeleccionado, setDiaSeleccionado] = useState<Date | null>(null)

  const suscripcionesDiaSeleccionado = diaSeleccionado
    ? (renovacionesPorDia.get(format(diaSeleccionado, 'yyyy-MM-dd')) ?? [])
    : []

  const DIAS_SEMANA = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
  const hoy = new Date()

  return (
    <div className="flex flex-col min-h-screen">
      <Encabezado
        titulo="Calendario"
        descripcion="Visualizá las renovaciones de tus suscripciones"
      />

      <div className="flex-1 p-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Calendario */}
          <div className="xl:col-span-2">
            <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: '#1a1a1d', borderColor: '#2a2a2f' }}>

              {/* Navegación */}
              <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: '#2a2a2f' }}>
                <button
                  onClick={() => setMesActual(subMonths(mesActual, 1))}
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: '#8b8b97' }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.color = '#e8e8ed'
                    ;(e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.05)'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.color = '#8b8b97'
                    ;(e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
                  }}
                >
                  <ChevronLeft size={18} />
                </button>
                <h2 className="text-base font-semibold capitalize" style={{ color: '#e8e8ed' }}>
                  {format(mesActual, 'MMMM yyyy', { locale: es })}
                </h2>
                <button
                  onClick={() => setMesActual(addMonths(mesActual, 1))}
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: '#8b8b97' }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.color = '#e8e8ed'
                    ;(e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.05)'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.color = '#8b8b97'
                    ;(e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
                  }}
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Grilla */}
              <div className="p-4">
                {/* Días de la semana */}
                <div className="grid grid-cols-7 mb-2">
                  {DIAS_SEMANA.map(dia => (
                    <div key={dia} className="text-center text-xs font-medium py-2" style={{ color: '#4a4a55' }}>
                      {dia}
                    </div>
                  ))}
                </div>

                {/* Días */}
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: diasPrevios }).map((_, i) => (
                    <div key={`prev-${i}`} />
                  ))}

                  {diasDelMes.map(dia => {
                    const clave = format(dia, 'yyyy-MM-dd')
                    const renovaciones = renovacionesPorDia.get(clave) ?? []
                    const esHoy = isSameDay(dia, hoy)
                    const esSeleccionado = diaSeleccionado && isSameDay(dia, diaSeleccionado)
                    const esMismomes = isSameMonth(dia, mesActual)

                    return (
                      <button
                        key={clave}
                        onClick={() => setDiaSeleccionado(esSeleccionado ? null : dia)}
                        className="relative flex flex-col items-center py-2 px-1 rounded-lg transition-all min-h-[52px]"
                        style={{
                          backgroundColor: esSeleccionado
                            ? 'rgba(124,106,247,0.2)'
                            : esHoy
                            ? 'rgba(124,106,247,0.08)'
                            : 'transparent',
                          border: esSeleccionado
                            ? '1px solid rgba(124,106,247,0.5)'
                            : esHoy
                            ? '1px solid rgba(124,106,247,0.2)'
                            : '1px solid transparent',
                          opacity: esMismomes ? 1 : 0.3,
                        }}
                        onMouseEnter={e => {
                          if (!esSeleccionado) (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.04)'
                        }}
                        onMouseLeave={e => {
                          if (!esSeleccionado) (e.currentTarget as HTMLElement).style.backgroundColor = esHoy ? 'rgba(124,106,247,0.08)' : 'transparent'
                        }}
                      >
                        <span className="text-sm font-medium" style={{ color: esHoy || esSeleccionado ? '#7c6af7' : '#e8e8ed' }}>
                          {format(dia, 'd')}
                        </span>
                        {renovaciones.length > 0 && (
                          <div className="flex items-center gap-0.5 mt-1 flex-wrap justify-center">
                            {renovaciones.slice(0, 3).map(s => {
                              const cat = obtenerCategoria(s.categoria)
                              return (
                                <span key={s.id} className="w-1.5 h-1.5 rounded-full"
                                  style={{ backgroundColor: cat.color }} />
                              )
                            })}
                            {renovaciones.length > 3 && (
                              <span className="text-xs" style={{ color: '#4a4a55' }}>+{renovaciones.length - 3}</span>
                            )}
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Leyenda */}
              <div className="flex items-center gap-4 px-6 pb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#7c6af7' }} />
                  <span className="text-xs" style={{ color: '#4a4a55' }}>Hoy</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#22c55e' }} />
                  <span className="text-xs" style={{ color: '#4a4a55' }}>Renovación</span>
                </div>
              </div>
            </div>
          </div>

          {/* Panel lateral */}
          <div className="space-y-4">

            {/* Resumen del mes */}
            <div className="rounded-xl border p-5" style={{ backgroundColor: '#1a1a1d', borderColor: '#2a2a2f' }}>
              <h3 className="text-sm font-semibold mb-3" style={{ color: '#e8e8ed' }}>
                Renovaciones este mes
              </h3>
              {cargando ? (
                <p className="text-sm" style={{ color: '#4a4a55' }}>Cargando...</p>
              ) : (() => {
                const renovacionesMes = suscripciones.filter(s => {
                  const fecha = parseISO(s.fecha_renovacion)
                  return isSameMonth(fecha, mesActual)
                })
                if (renovacionesMes.length === 0) {
                  return (
                    <p className="text-sm" style={{ color: '#8b8b97' }}>Sin renovaciones este mes</p>
                  )
                }
                return (
                  <div className="space-y-2">
                    {renovacionesMes.map(s => {
                      const cat = obtenerCategoria(s.categoria)
                      return (
                        <div key={s.id} className="flex items-center gap-2 py-1.5">
                          <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 text-xs font-bold"
                            style={{ backgroundColor: `${cat.color}20`, color: cat.color }}>
                            {s.nombre[0]?.toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate" style={{ color: '#e8e8ed' }}>{s.nombre}</p>
                            <p className="text-xs" style={{ color: '#4a4a55' }}>
                              {format(parseISO(s.fecha_renovacion), 'dd MMM', { locale: es })}
                            </p>
                          </div>
                          <p className="text-xs font-semibold flex-shrink-0" style={{ color: '#e8e8ed' }}>
                            {formatearMoneda(s.precio, s.moneda)}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                )
              })()}
            </div>

            {/* Detalle del día seleccionado */}
            {diaSeleccionado && (
              <div className="rounded-xl border p-5" style={{ backgroundColor: '#1a1a1d', borderColor: 'rgba(124,106,247,0.3)' }}>
                <h3 className="text-sm font-semibold mb-3 capitalize" style={{ color: '#e8e8ed' }}>
                  {format(diaSeleccionado, "EEEE d 'de' MMMM", { locale: es })}
                </h3>
                {suscripcionesDiaSeleccionado.length === 0 ? (
                  <div className="flex flex-col items-center py-4">
                    <Calendar size={24} className="mb-2" style={{ color: '#4a4a55' }} />
                    <p className="text-xs text-center" style={{ color: '#8b8b97' }}>Sin renovaciones este día</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {suscripcionesDiaSeleccionado.map(s => {
                      const cat = obtenerCategoria(s.categoria)
                      return (
                        <div key={s.id} className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(124,106,247,0.06)' }}>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                              style={{ backgroundColor: `${cat.color}20`, color: cat.color }}>
                              {s.nombre[0]?.toUpperCase()}
                            </div>
                            <p className="text-sm font-medium" style={{ color: '#e8e8ed' }}>{s.nombre}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <EstadoBadge estado={s.estado} tamaño="sm" />
                            <p className="text-sm font-semibold" style={{ color: '#7c6af7' }}>
                              {formatearMoneda(s.precio, s.moneda)}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
