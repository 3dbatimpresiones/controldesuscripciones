import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  DollarSign,
  TrendingDown,
  CreditCard,
  AlertTriangle,
  Calendar,
  ArrowRight,
  Clock,
} from 'lucide-react'
import { Encabezado } from '@/componentes/diseno/Encabezado'
import { TarjetaMetrica } from '@/componentes/comunes/TarjetaMetrica'
import { EstadoBadge } from '@/componentes/comunes/EstadoBadge'
import { EsqueletoTarjeta, EsqueletoFila } from '@/componentes/comunes/CargandoEsqueleto'
import { useSuscripciones, useProximasRenovaciones } from '@/hooks/useSuscripciones'
import { formatearMoneda, formatearFecha, etiquetaDiasRestantes, calcularDiasHastaRenovacion, obtenerCategoria } from '@/utilidades'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

export function Dashboard() {
  const navigate = useNavigate()
  const { suscripciones, resumen, cargando } = useSuscripciones()
  const { renovaciones, cargando: cargandoRenovaciones } = useProximasRenovaciones(14)

  const datosGrafico = useMemo(() => {
    if (!resumen) return []
    return Object.entries(resumen.por_categoria)
      .filter(([, valor]) => valor > 0)
      .map(([categoria, valor]) => ({
        name: obtenerCategoria(categoria as Parameters<typeof obtenerCategoria>[0]).etiqueta,
        value: valor,
        color: obtenerCategoria(categoria as Parameters<typeof obtenerCategoria>[0]).color,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6)
  }, [resumen])

  const servicioPrincipalMoneda = suscripciones[0]?.moneda ?? 'ARS'

  return (
    <div className="flex flex-col min-h-screen">
      <Encabezado
        titulo="Dashboard"
        descripcion="Resumen de tus suscripciones activas"
        accion={{ etiqueta: 'Nueva suscripción', onClick: () => navigate('/suscripciones?nueva=true') }}
      />

      <div className="flex-1 p-8 space-y-8">

        {/* Métricas principales */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {cargando ? (
              Array.from({ length: 4 }).map((_, i) => <EsqueletoTarjeta key={i} />)
            ) : (
              <>
                <TarjetaMetrica
                  titulo="Gasto mensual"
                  valor={formatearMoneda(resumen?.gasto_mensual_total ?? 0, servicioPrincipalMoneda)}
                  descripcion="Suma de suscripciones activas"
                  icono={DollarSign}
                  colorIcono="#7c6af7"
                />
                <TarjetaMetrica
                  titulo="Gasto anual estimado"
                  valor={formatearMoneda(resumen?.gasto_anual_estimado ?? 0, servicioPrincipalMoneda)}
                  descripcion="Proyección a 12 meses"
                  icono={TrendingDown}
                  colorIcono="#3b82f6"
                />
                <TarjetaMetrica
                  titulo="Suscripciones activas"
                  valor={String(resumen?.total_activas ?? 0)}
                  descripcion={`${resumen?.total_pausadas ?? 0} pausadas, ${resumen?.total_canceladas ?? 0} canceladas`}
                  icono={CreditCard}
                  colorIcono="#22c55e"
                />
                <TarjetaMetrica
                  titulo="Ahorro potencial"
                  valor={formatearMoneda(resumen?.ahorro_potencial_mensual ?? 0, servicioPrincipalMoneda)}
                  descripcion="Servicios con poco uso"
                  icono={AlertTriangle}
                  colorIcono="#f59e0b"
                />
              </>
            )}
          </div>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Próximas renovaciones */}
          <section className="xl:col-span-2">
            <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: '#1a1a1d', borderColor: '#2a2a2f' }}>
              <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#2a2a2f' }}>
                <div className="flex items-center gap-2">
                  <Clock size={16} style={{ color: '#7c6af7' }} />
                  <h2 className="text-sm font-semibold" style={{ color: '#e8e8ed' }}>Próximas renovaciones</h2>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(124,106,247,0.15)', color: '#7c6af7' }}>
                    14 días
                  </span>
                </div>
                <button
                  onClick={() => navigate('/calendario')}
                  className="flex items-center gap-1 text-xs transition-colors"
                  style={{ color: '#8b8b97' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#e8e8ed'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#8b8b97'}
                >
                  Ver calendario <ArrowRight size={13} />
                </button>
              </div>

              {cargandoRenovaciones ? (
                <div className="divide-y" style={{ borderColor: '#2a2a2f' }}>
                  {Array.from({ length: 3 }).map((_, i) => <EsqueletoFila key={i} />)}
                </div>
              ) : renovaciones.length === 0 ? (
                <div className="py-12 text-center">
                  <Calendar size={32} className="mx-auto mb-3" style={{ color: '#4a4a55' }} />
                  <p className="text-sm" style={{ color: '#8b8b97' }}>Sin renovaciones en los próximos 14 días</p>
                </div>
              ) : (
                <div className="divide-y" style={{ borderColor: '#222226' }}>
                  {renovaciones.map(s => {
                    const dias = calcularDiasHastaRenovacion(s.fecha_renovacion)
                    const urgente = dias <= 3
                    const categoria = obtenerCategoria(s.categoria)
                    return (
                      <div
                        key={s.id}
                        className="flex items-center gap-4 px-5 py-3.5 transition-colors cursor-pointer"
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.02)'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
                        onClick={() => navigate('/suscripciones')}
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold"
                          style={{ backgroundColor: `${categoria.color}20`, color: categoria.color }}>
                          {s.nombre[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate" style={{ color: '#e8e8ed' }}>{s.nombre}</p>
                          <p className="text-xs" style={{ color: '#8b8b97' }}>{formatearFecha(s.fecha_renovacion)}</p>
                        </div>
                        <EstadoBadge estado={s.estado} tamaño="sm" />
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-semibold" style={{ color: '#e8e8ed' }}>
                            {formatearMoneda(s.precio, s.moneda)}
                          </p>
                          <p className="text-xs" style={{ color: urgente ? '#ef4444' : '#8b8b97' }}>
                            {etiquetaDiasRestantes(dias)}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </section>

          {/* Gráfico por categoría */}
          <section>
            <div className="rounded-xl border h-full" style={{ backgroundColor: '#1a1a1d', borderColor: '#2a2a2f' }}>
              <div className="flex items-center gap-2 px-5 py-4 border-b" style={{ borderColor: '#2a2a2f' }}>
                <h2 className="text-sm font-semibold" style={{ color: '#e8e8ed' }}>Por categoría</h2>
              </div>
              {cargando ? (
                <div className="flex items-center justify-center h-48">
                  <div className="w-8 h-8 rounded-full border-2 border-t-transparent animar-giro"
                    style={{ borderColor: '#7c6af7', borderTopColor: 'transparent' }} />
                </div>
              ) : datosGrafico.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48">
                  <p className="text-sm" style={{ color: '#8b8b97' }}>Sin datos aún</p>
                </div>
              ) : (
                <div className="p-4">
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie
                        data={datosGrafico}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={70}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {datosGrafico.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1e1e22',
                          border: '1px solid #2a2a2f',
                          borderRadius: '8px',
                          color: '#e8e8ed',
                          fontSize: '12px',
                        }}
                        formatter={(value) => [formatearMoneda(Number(value ?? 0), servicioPrincipalMoneda), '']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 mt-2">
                    {datosGrafico.map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: item.color }} />
                          <span className="text-xs" style={{ color: '#8b8b97' }}>{item.name}</span>
                        </div>
                        <span className="text-xs font-medium" style={{ color: '#e8e8ed' }}>
                          {formatearMoneda(item.value, servicioPrincipalMoneda)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Servicios con bajo uso */}
        {!cargando && resumen && resumen.ahorro_potencial_mensual > 0 && (
          <section>
            <div className="rounded-xl border p-5" style={{ backgroundColor: '#1a1a1d', borderColor: 'rgba(245,158,11,0.2)' }}>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={16} style={{ color: '#f59e0b' }} />
                <h2 className="text-sm font-semibold" style={{ color: '#e8e8ed' }}>Oportunidades de ahorro</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {suscripciones
                  .filter(s => s.estado === 'activa' && (s.nivel_uso === 'sin_uso' || s.nivel_uso === 'bajo'))
                  .slice(0, 3)
                  .map(s => {
                    const categoria = obtenerCategoria(s.categoria)
                    return (
                      <div key={s.id} className="flex items-center gap-3 p-3 rounded-lg"
                        style={{ backgroundColor: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)' }}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold"
                          style={{ backgroundColor: `${categoria.color}20`, color: categoria.color }}>
                          {s.nombre[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate" style={{ color: '#e8e8ed' }}>{s.nombre}</p>
                          <p className="text-xs" style={{ color: '#f59e0b' }}>
                            Uso {s.nivel_uso === 'sin_uso' ? 'nulo' : 'bajo'}
                          </p>
                        </div>
                        <p className="text-sm font-semibold flex-shrink-0" style={{ color: '#e8e8ed' }}>
                          {formatearMoneda(s.precio, s.moneda)}
                        </p>
                      </div>
                    )
                  })}
              </div>
              <p className="text-xs mt-4" style={{ color: '#8b8b97' }}>
                Podrías ahorrar hasta{' '}
                <span className="font-semibold" style={{ color: '#f59e0b' }}>
                  {formatearMoneda(resumen.ahorro_potencial_mensual, servicioPrincipalMoneda)}/mes
                </span>{' '}
                cancelando servicios que no usás.
              </p>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
