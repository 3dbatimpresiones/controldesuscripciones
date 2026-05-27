import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Search,
  Filter,
  Grid3X3,
  List,
  ExternalLink,
  Edit2,
  Trash2,
  MoreVertical,
  X,
} from 'lucide-react'
import { Encabezado } from '@/componentes/diseno/Encabezado'
import { EstadoBadge, UsoBadge } from '@/componentes/comunes/EstadoBadge'
import { EsqueletoFila } from '@/componentes/comunes/CargandoEsqueleto'
import { FormularioSuscripcion } from '@/componentes/suscripciones/FormularioSuscripcion'
import { useSuscripciones } from '@/hooks/useSuscripciones'
import { formatearMoneda, formatearFecha, etiquetaDiasRestantes, calcularDiasHastaRenovacion, obtenerCategoria } from '@/utilidades'
import type { Suscripcion, SuscripcionNueva, FiltrosSuscripcion, CategoriaNombre } from '@/tipos'
import { CATEGORIAS } from '@/configuracion/categorias'

export function Suscripciones() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [suscripcionEditar, setSuscripcionEditar] = useState<Suscripcion | null>(null)
  const [guardando, setGuardando] = useState(false)
  const [vista, setVista] = useState<'lista' | 'grilla'>('lista')
  const [busqueda, setBusqueda] = useState('')
  const [filtros, setFiltros] = useState<FiltrosSuscripcion>({})
  const [menuAbierto, setMenuAbierto] = useState<string | null>(null)
  const [confirmarEliminar, setConfirmarEliminar] = useState<Suscripcion | null>(null)

  const { suscripciones, cargando, crear, actualizar, eliminar } = useSuscripciones({
    ...filtros,
    busqueda,
  })

  useEffect(() => {
    if (searchParams.get('nueva') === 'true') {
      setMostrarFormulario(true)
      setSearchParams({})
    }
  }, [searchParams, setSearchParams])

  const manejarGuardar = async (datos: SuscripcionNueva) => {
    setGuardando(true)
    try {
      if (suscripcionEditar) {
        await actualizar(suscripcionEditar.id, datos)
      } else {
        await crear(datos)
      }
      setMostrarFormulario(false)
      setSuscripcionEditar(null)
    } finally {
      setGuardando(false)
    }
  }

  const manejarEditar = (s: Suscripcion) => {
    setSuscripcionEditar(s)
    setMostrarFormulario(true)
    setMenuAbierto(null)
  }

  const manejarEliminar = async () => {
    if (!confirmarEliminar) return
    await eliminar(confirmarEliminar.id)
    setConfirmarEliminar(null)
  }

  const toggleCategoria = (cat: CategoriaNombre) => {
    setFiltros(prev => {
      const cats = prev.categorias ?? []
      const nuevas = cats.includes(cat) ? cats.filter(c => c !== cat) : [...cats, cat]
      return { ...prev, categorias: nuevas.length ? nuevas : undefined }
    })
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Encabezado
        titulo="Suscripciones"
        descripcion={`${suscripciones.length} servicio${suscripciones.length !== 1 ? 's' : ''} registrado${suscripciones.length !== 1 ? 's' : ''}`}
        accion={{
          etiqueta: 'Nueva suscripción',
          onClick: () => { setSuscripcionEditar(null); setMostrarFormulario(true) }
        }}
      />

      <div className="flex-1 p-8">

        {/* Barra de búsqueda y controles */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#4a4a55' }} />
            <input
              type="text"
              placeholder="Buscar suscripciones..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm border outline-none transition-all"
              style={{ backgroundColor: '#1a1a1d', borderColor: '#2a2a2f', color: '#e8e8ed' }}
              onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = '#7c6af7'}
              onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = '#2a2a2f'}
            />
            {busqueda && (
              <button onClick={() => setBusqueda('')} className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: '#4a4a55' }}>
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 p-1 rounded-lg" style={{ backgroundColor: '#1a1a1d', border: '1px solid #2a2a2f' }}>
            <button
              onClick={() => setVista('lista')}
              className="p-2 rounded-md transition-colors"
              style={{ backgroundColor: vista === 'lista' ? '#2a2a2f' : 'transparent', color: vista === 'lista' ? '#e8e8ed' : '#4a4a55' }}
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setVista('grilla')}
              className="p-2 rounded-md transition-colors"
              style={{ backgroundColor: vista === 'grilla' ? '#2a2a2f' : 'transparent', color: vista === 'grilla' ? '#e8e8ed' : '#4a4a55' }}
            >
              <Grid3X3 size={16} />
            </button>
          </div>
        </div>

        {/* Filtros por categoría */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <Filter size={14} style={{ color: '#4a4a55' }} />
          {CATEGORIAS.slice(0, 8).map(cat => {
            const activa = filtros.categorias?.includes(cat.nombre)
            return (
              <button
                key={cat.nombre}
                onClick={() => toggleCategoria(cat.nombre)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all"
                style={{
                  backgroundColor: activa ? `${cat.color}20` : '#1a1a1d',
                  borderColor: activa ? cat.color : '#2a2a2f',
                  color: activa ? cat.color : '#8b8b97',
                  border: '1px solid',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cat.color }} />
                {cat.etiqueta}
              </button>
            )
          })}
          {filtros.categorias?.length ? (
            <button
              onClick={() => setFiltros(prev => ({ ...prev, categorias: undefined }))}
              className="text-xs px-2 py-1 rounded-full"
              style={{ color: '#ef4444', backgroundColor: 'rgba(239,68,68,0.08)' }}
            >
              Limpiar filtros
            </button>
          ) : null}
        </div>

        {/* Lista o grilla */}
        {cargando ? (
          <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: '#1a1a1d', borderColor: '#2a2a2f' }}>
            {Array.from({ length: 5 }).map((_, i) => <EsqueletoFila key={i} />)}
          </div>
        ) : suscripciones.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ backgroundColor: 'rgba(124,106,247,0.08)', border: '1px solid rgba(124,106,247,0.15)' }}>
              <Search size={24} style={{ color: '#7c6af7' }} />
            </div>
            <p className="text-base font-medium mb-1" style={{ color: '#e8e8ed' }}>
              {busqueda ? 'Sin resultados' : 'Todavía no tenés suscripciones'}
            </p>
            <p className="text-sm mb-6" style={{ color: '#8b8b97' }}>
              {busqueda ? `No encontramos servicios con "${busqueda}"` : 'Empezá registrando tu primer servicio'}
            </p>
            {!busqueda && (
              <button
                onClick={() => { setSuscripcionEditar(null); setMostrarFormulario(true) }}
                className="px-5 py-2.5 rounded-lg text-sm font-medium"
                style={{ backgroundColor: '#7c6af7', color: '#fff' }}
              >
                Agregar suscripción
              </button>
            )}
          </div>
        ) : vista === 'lista' ? (
          <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: '#1a1a1d', borderColor: '#2a2a2f' }}>
            {/* Encabezados */}
            <div className="grid grid-cols-12 px-5 py-3 border-b text-xs font-medium"
              style={{ borderColor: '#2a2a2f', color: '#4a4a55' }}>
              <div className="col-span-4">Servicio</div>
              <div className="col-span-2">Estado</div>
              <div className="col-span-2">Precio</div>
              <div className="col-span-2">Renovación</div>
              <div className="col-span-1">Uso</div>
              <div className="col-span-1"></div>
            </div>

            {suscripciones.map(s => {
              const dias = calcularDiasHastaRenovacion(s.fecha_renovacion)
              const categoria = obtenerCategoria(s.categoria)
              return (
                <div key={s.id} className="grid grid-cols-12 items-center px-5 py-3.5 border-b transition-colors relative"
                  style={{ borderColor: '#222226' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
                >
                  {/* Servicio */}
                  <div className="col-span-4 flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold"
                      style={{ backgroundColor: `${categoria.color}20`, color: categoria.color }}>
                      {s.nombre[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: '#e8e8ed' }}>{s.nombre}</p>
                      <p className="text-xs truncate" style={{ color: '#4a4a55' }}>{categoria.etiqueta}</p>
                    </div>
                  </div>

                  {/* Estado */}
                  <div className="col-span-2">
                    <EstadoBadge estado={s.estado} tamaño="sm" />
                  </div>

                  {/* Precio */}
                  <div className="col-span-2">
                    <p className="text-sm font-semibold" style={{ color: '#e8e8ed' }}>
                      {formatearMoneda(s.precio, s.moneda)}
                    </p>
                    <p className="text-xs" style={{ color: '#4a4a55' }}>
                      {s.frecuencia === 'mensual' ? '/mes' :
                        s.frecuencia === 'anual' ? '/año' :
                        s.frecuencia === 'semestral' ? '/6m' :
                        s.frecuencia === 'trimestral' ? '/trim' :
                        s.frecuencia === 'semanal' ? '/sem' : 'único'}
                    </p>
                  </div>

                  {/* Renovación */}
                  <div className="col-span-2">
                    <p className="text-sm" style={{ color: '#e8e8ed' }}>{formatearFecha(s.fecha_renovacion)}</p>
                    <p className="text-xs" style={{ color: dias <= 3 && dias >= 0 ? '#ef4444' : dias <= 7 ? '#f59e0b' : '#4a4a55' }}>
                      {etiquetaDiasRestantes(dias)}
                    </p>
                  </div>

                  {/* Uso */}
                  <div className="col-span-1">
                    <UsoBadge nivel={s.nivel_uso} />
                  </div>

                  {/* Acciones */}
                  <div className="col-span-1 flex items-center justify-end gap-1 relative">
                    {s.url_servicio && (
                      <a href={s.url_servicio} target="_blank" rel="noopener noreferrer"
                        className="p-1.5 rounded-md transition-colors"
                        style={{ color: '#4a4a55' }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#e8e8ed'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#4a4a55'}
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                    <button
                      onClick={() => setMenuAbierto(menuAbierto === s.id ? null : s.id)}
                      className="p-1.5 rounded-md transition-colors"
                      style={{ color: '#4a4a55' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#e8e8ed'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#4a4a55'}
                    >
                      <MoreVertical size={14} />
                    </button>

                    {menuAbierto === s.id && (
                      <div className="absolute right-0 top-full mt-1 w-36 rounded-lg border shadow-xl z-20 py-1"
                        style={{ backgroundColor: '#1e1e22', borderColor: '#2a2a2f' }}>
                        <button
                          onClick={() => manejarEditar(s)}
                          className="flex items-center gap-2 w-full px-3 py-2 text-xs transition-colors"
                          style={{ color: '#e8e8ed' }}
                          onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.05)'}
                          onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
                        >
                          <Edit2 size={13} /> Editar
                        </button>
                        <button
                          onClick={() => { setConfirmarEliminar(s); setMenuAbierto(null) }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-xs transition-colors"
                          style={{ color: '#ef4444' }}
                          onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(239,68,68,0.08)'}
                          onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
                        >
                          <Trash2 size={13} /> Eliminar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          /* Vista grilla */
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {suscripciones.map(s => {
              const dias = calcularDiasHastaRenovacion(s.fecha_renovacion)
              const categoria = obtenerCategoria(s.categoria)
              return (
                <div key={s.id} className="p-5 rounded-xl border transition-all"
                  style={{ backgroundColor: '#1a1a1d', borderColor: '#2a2a2f' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = '#3a3a45'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = '#2a2a2f'}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold"
                        style={{ backgroundColor: `${categoria.color}20`, color: categoria.color }}>
                        {s.nombre[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: '#e8e8ed' }}>{s.nombre}</p>
                        <p className="text-xs" style={{ color: '#4a4a55' }}>{categoria.etiqueta}</p>
                      </div>
                    </div>
                    <EstadoBadge estado={s.estado} tamaño="sm" />
                  </div>

                  <div className="flex items-end justify-between mb-3">
                    <div>
                      <p className="text-xl font-semibold tracking-tight" style={{ color: '#e8e8ed' }}>
                        {formatearMoneda(s.precio, s.moneda)}
                      </p>
                      <p className="text-xs" style={{ color: '#4a4a55' }}>{s.frecuencia}</p>
                    </div>
                    <UsoBadge nivel={s.nivel_uso} />
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t"
                    style={{ borderColor: '#222226' }}>
                    <div>
                      <p className="text-xs" style={{ color: '#4a4a55' }}>Renovación</p>
                      <p className="text-xs font-medium" style={{ color: dias <= 7 && dias >= 0 ? '#f59e0b' : '#8b8b97' }}>
                        {etiquetaDiasRestantes(dias)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {s.url_servicio && (
                        <a href={s.url_servicio} target="_blank" rel="noopener noreferrer"
                          className="p-1.5 rounded-md" style={{ color: '#4a4a55' }}>
                          <ExternalLink size={13} />
                        </a>
                      )}
                      <button onClick={() => manejarEditar(s)} className="p-1.5 rounded-md" style={{ color: '#4a4a55' }}>
                        <Edit2 size={13} />
                      </button>
                      <button onClick={() => setConfirmarEliminar(s)} className="p-1.5 rounded-md" style={{ color: '#4a4a55' }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Modal formulario */}
      {mostrarFormulario && (
        <FormularioSuscripcion
          suscripcion={suscripcionEditar}
          onGuardar={manejarGuardar}
          onCerrar={() => { setMostrarFormulario(false); setSuscripcionEditar(null) }}
          cargando={guardando}
        />
      )}

      {/* Modal confirmar eliminación */}
      {confirmarEliminar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-sm p-6 rounded-2xl border"
            style={{ backgroundColor: '#1a1a1d', borderColor: '#2a2a2f' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
              style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <Trash2 size={18} style={{ color: '#ef4444' }} />
            </div>
            <h3 className="text-base font-semibold mb-1" style={{ color: '#e8e8ed' }}>
              Eliminar suscripción
            </h3>
            <p className="text-sm mb-6" style={{ color: '#8b8b97' }}>
              ¿Estás seguro de que querés eliminar <strong style={{ color: '#e8e8ed' }}>{confirmarEliminar.nombre}</strong>? Esta acción no se puede deshacer.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setConfirmarEliminar(null)}
                className="flex-1 px-4 py-2 rounded-lg text-sm"
                style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: '#8b8b97' }}
              >
                Cancelar
              </button>
              <button
                onClick={manejarEliminar}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium"
                style={{ backgroundColor: '#ef4444', color: '#fff' }}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cerrar menú contextual */}
      {menuAbierto && (
        <div className="fixed inset-0 z-10" onClick={() => setMenuAbierto(null)} />
      )}
    </div>
  )
}
