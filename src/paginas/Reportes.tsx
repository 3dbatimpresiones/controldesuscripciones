import { useMemo } from 'react'
import { BarChart3 } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { Encabezado } from '@/componentes/diseno/Encabezado'
import { useSuscripciones } from '@/hooks/useSuscripciones'
import { formatearMoneda, calcularPrecioMensual, obtenerCategoria } from '@/utilidades'
import { MONEDAS } from '@/configuracion/constantes'
import type { Moneda } from '@/tipos'

const ESTILO_TOOLTIP = {
  backgroundColor: '#1e1e22',
  border: '1px solid #2a2a2f',
  borderRadius: '8px',
  color: '#e8e8ed',
  fontSize: '12px',
}

export function Reportes() {
  const { suscripciones, resumen, cargando } = useSuscripciones()

  const datosPorCategoria = useMemo(() => {
    if (!resumen) return []
    return Object.entries(resumen.por_categoria)
      .filter(([, v]) => v > 0)
      .map(([cat, valor]) => {
        const categoria = obtenerCategoria(cat as Parameters<typeof obtenerCategoria>[0])
        return { nombre: categoria.etiqueta, valor, color: categoria.color }
      })
      .sort((a, b) => b.valor - a.valor)
  }, [resumen])

  const datosPorMoneda = useMemo(() => {
    if (!resumen) return []
    return Object.entries(resumen.por_moneda)
      .filter(([, v]) => v > 0)
      .map(([moneda, valor]) => {
        const config = MONEDAS.find(m => m.valor === moneda)
        return { nombre: moneda, simbolo: config?.simbolo ?? moneda, valor }
      })
  }, [resumen])

  const activas = suscripciones.filter(s => s.estado === 'activa')
  const monedaPrincipal: Moneda = (activas[0]?.moneda as Moneda) ?? 'ARS'

  if (cargando) {
    return (
      <div className="flex flex-col min-h-screen">
        <Encabezado titulo="Reportes" descripcion="Análisis de tus gastos en suscripciones" />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 animar-giro"
            style={{ borderColor: '#7c6af7', borderTopColor: 'transparent' }} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Encabezado titulo="Reportes" descripcion="Análisis detallado de tus gastos en suscripciones" />

      <div className="flex-1 p-8 space-y-6">

        {/* Resumen rápido */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { titulo: 'Total activas', valor: String(resumen?.total_activas ?? 0), sub: 'suscripciones' },
            { titulo: 'Gasto mensual', valor: formatearMoneda(resumen?.gasto_mensual_total ?? 0, monedaPrincipal), sub: 'estimado' },
            { titulo: 'Gasto anual', valor: formatearMoneda(resumen?.gasto_anual_estimado ?? 0, monedaPrincipal), sub: 'proyectado' },
            { titulo: 'Ahorro potencial', valor: formatearMoneda(resumen?.ahorro_potencial_mensual ?? 0, monedaPrincipal), sub: 'por mes' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl border" style={{ backgroundColor: '#1a1a1d', borderColor: '#2a2a2f' }}>
              <p className="text-xs mb-1" style={{ color: '#8b8b97' }}>{item.titulo}</p>
              <p className="text-xl font-semibold" style={{ color: '#e8e8ed' }}>{item.valor}</p>
              <p className="text-xs mt-0.5" style={{ color: '#4a4a55' }}>{item.sub}</p>
            </div>
          ))}
        </div>

        {/* Gráfico de barras por categoría */}
        {datosPorCategoria.length > 0 && (
          <div className="rounded-xl border p-5" style={{ backgroundColor: '#1a1a1d', borderColor: '#2a2a2f' }}>
            <h2 className="text-sm font-semibold mb-5" style={{ color: '#e8e8ed' }}>Gasto mensual por categoría</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={datosPorCategoria} barSize={28}>
                <XAxis
                  dataKey="nombre"
                  tick={{ fontSize: 11, fill: '#8b8b97' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#8b8b97' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={v => formatearMoneda(v, monedaPrincipal)}
                />
                <Tooltip
                  contentStyle={ESTILO_TOOLTIP}
                  formatter={(v) => [formatearMoneda(Number(v ?? 0), monedaPrincipal), 'Mensual']}
                  cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                />
                <Bar dataKey="valor" radius={[4, 4, 0, 0]}>
                  {datosPorCategoria.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* Distribución por categoría (pie) */}
          {datosPorCategoria.length > 0 && (
            <div className="rounded-xl border p-5" style={{ backgroundColor: '#1a1a1d', borderColor: '#2a2a2f' }}>
              <h2 className="text-sm font-semibold mb-4" style={{ color: '#e8e8ed' }}>Distribución por categoría</h2>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={datosPorCategoria}
                    cx="50%"
                    cy="45%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="valor"
                    nameKey="nombre"
                  >
                    {datosPorCategoria.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={ESTILO_TOOLTIP}
                    formatter={(v) => [formatearMoneda(Number(v ?? 0), monedaPrincipal), '']}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={value => <span style={{ color: '#8b8b97', fontSize: '11px' }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Por moneda */}
          {datosPorMoneda.length > 0 && (
            <div className="rounded-xl border p-5" style={{ backgroundColor: '#1a1a1d', borderColor: '#2a2a2f' }}>
              <h2 className="text-sm font-semibold mb-4" style={{ color: '#e8e8ed' }}>Gasto por moneda</h2>
              <div className="space-y-3">
                {datosPorMoneda.map((item, i) => {
                  const total = datosPorMoneda.reduce((t, m) => t + m.valor, 0)
                  const porcentaje = total > 0 ? (item.valor / total) * 100 : 0
                  const COLORES = ['#7c6af7', '#3b82f6', '#22c55e', '#f59e0b', '#ef4444']
                  const color = COLORES[i % COLORES.length]
                  return (
                    <div key={item.nombre}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium px-2 py-0.5 rounded"
                            style={{ backgroundColor: `${color}20`, color }}>
                            {item.nombre}
                          </span>
                          <span className="text-xs" style={{ color: '#8b8b97' }}>
                            {item.simbolo} {item.valor.toFixed(2)}/mes
                          </span>
                        </div>
                        <span className="text-xs font-medium" style={{ color: '#8b8b97' }}>
                          {porcentaje.toFixed(0)}%
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#2a2a2f' }}>
                        <div className="h-full rounded-full transition-all"
                          style={{ width: `${porcentaje}%`, backgroundColor: color }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Tabla detallada */}
        {activas.length > 0 && (
          <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: '#1a1a1d', borderColor: '#2a2a2f' }}>
            <div className="px-5 py-4 border-b" style={{ borderColor: '#2a2a2f' }}>
              <h2 className="text-sm font-semibold" style={{ color: '#e8e8ed' }}>Detalle por servicio</h2>
            </div>
            <div className="divide-y" style={{ borderColor: '#222226' }}>
              {[...activas]
                .sort((a, b) => calcularPrecioMensual(b) - calcularPrecioMensual(a))
                .map(s => {
                  const cat = obtenerCategoria(s.categoria)
                  const mensual = calcularPrecioMensual(s)
                  const anual = mensual * 12
                  const totalMensual = activas.reduce((t, x) => t + (x.moneda === s.moneda ? calcularPrecioMensual(x) : 0), 0)
                  const porcentaje = totalMensual > 0 ? (mensual / totalMensual) * 100 : 0
                  return (
                    <div key={s.id} className="flex items-center gap-4 px-5 py-3.5 transition-colors"
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.02)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
                    >
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold"
                        style={{ backgroundColor: `${cat.color}20`, color: cat.color }}>
                        {s.nombre[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium" style={{ color: '#e8e8ed' }}>{s.nombre}</p>
                        <p className="text-xs" style={{ color: '#4a4a55' }}>{cat.etiqueta}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-semibold" style={{ color: '#e8e8ed' }}>
                          {formatearMoneda(mensual, s.moneda)}/mes
                        </p>
                        <p className="text-xs" style={{ color: '#4a4a55' }}>
                          {formatearMoneda(anual, s.moneda)}/año
                        </p>
                      </div>
                      <div className="w-16 text-right flex-shrink-0">
                        <span className="text-xs font-medium" style={{ color: '#7c6af7' }}>
                          {porcentaje.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        )}

        {activas.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24">
            <BarChart3 size={32} className="mb-3" style={{ color: '#4a4a55' }} />
            <p className="text-sm" style={{ color: '#8b8b97' }}>Sin datos suficientes para mostrar reportes</p>
          </div>
        )}
      </div>
    </div>
  )
}
