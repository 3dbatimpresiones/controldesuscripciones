import { useState, useEffect } from 'react'
import { X, Link, AlertCircle } from 'lucide-react'
import type { Suscripcion, SuscripcionNueva } from '@/tipos'
import { CATEGORIAS } from '@/configuracion/categorias'
import { MONEDAS, FRECUENCIAS, NIVELES_USO, ESTADOS_SUSCRIPCION, TIPOS_METODO_PAGO } from '@/configuracion/constantes'
import { validarContenidoSeguro } from '@/utilidades/seguridad'
import { AlertaSeguridad } from '@/componentes/comunes/AlertaSeguridad'
import { fechaHoy } from '@/utilidades/fechas'

interface Props {
  suscripcion?: Suscripcion | null
  onGuardar: (datos: SuscripcionNueva) => Promise<void>
  onCerrar: () => void
  cargando?: boolean
}

const INICIAL: SuscripcionNueva = {
  nombre: '',
  descripcion: '',
  categoria: 'otro',
  precio: 0,
  moneda: 'ARS',
  frecuencia: 'mensual',
  fecha_inicio: fechaHoy(),
  fecha_renovacion: fechaHoy(),
  estado: 'activa',
  nivel_uso: 'medio',
  proyecto: '',
  notas: '',
  url_servicio: '',
  url_cancelacion: '',
}

export function FormularioSuscripcion({ suscripcion, onGuardar, onCerrar, cargando }: Props) {
  const [form, setForm] = useState<SuscripcionNueva>(INICIAL)
  const [advertencias, setAdvertencias] = useState<string[]>([])
  const [errores, setErrores] = useState<Partial<Record<keyof SuscripcionNueva, string>>>({})

  useEffect(() => {
    if (suscripcion) {
      setForm({
        nombre: suscripcion.nombre,
        descripcion: suscripcion.descripcion ?? '',
        categoria: suscripcion.categoria,
        precio: suscripcion.precio,
        moneda: suscripcion.moneda,
        frecuencia: suscripcion.frecuencia,
        fecha_inicio: suscripcion.fecha_inicio,
        fecha_renovacion: suscripcion.fecha_renovacion,
        estado: suscripcion.estado,
        nivel_uso: suscripcion.nivel_uso,
        proyecto: suscripcion.proyecto ?? '',
        notas: suscripcion.notas ?? '',
        url_servicio: suscripcion.url_servicio ?? '',
        url_cancelacion: suscripcion.url_cancelacion ?? '',
        metodo_pago: suscripcion.metodo_pago,
      })
    }
  }, [suscripcion])

  const actualizar = (campo: keyof SuscripcionNueva, valor: string | number) => {
    setForm(prev => ({ ...prev, [campo]: valor }))

    if (typeof valor === 'string' && valor.length > 3) {
      const resultado = validarContenidoSeguro(valor)
      if (!resultado.esSeguro) {
        setAdvertencias(resultado.advertencias)
      } else if (advertencias.length > 0) {
        setAdvertencias([])
      }
    }

    if (errores[campo]) {
      setErrores(prev => ({ ...prev, [campo]: undefined }))
    }
  }

  const validar = (): boolean => {
    const nuevosErrores: typeof errores = {}
    if (!form.nombre.trim()) nuevosErrores.nombre = 'El nombre es obligatorio'
    if (form.precio <= 0) nuevosErrores.precio = 'El precio debe ser mayor a 0'
    if (!form.fecha_inicio) nuevosErrores.fecha_inicio = 'La fecha de inicio es obligatoria'
    if (!form.fecha_renovacion) nuevosErrores.fecha_renovacion = 'La fecha de renovación es obligatoria'
    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validar()) return
    await onGuardar(form)
  }

  const inputClass = "w-full px-3 py-2 rounded-lg text-sm border outline-none transition-all"
  const inputStyle = {
    backgroundColor: '#141416',
    borderColor: '#2a2a2f',
    color: '#e8e8ed',
  }
  const labelClass = "block text-xs font-medium mb-1.5"
  const labelStyle = { color: '#8b8b97' }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border"
        style={{ backgroundColor: '#1a1a1d', borderColor: '#2a2a2f' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 z-10"
          style={{ backgroundColor: '#1a1a1d', borderColor: '#2a2a2f' }}>
          <div>
            <h2 className="text-base font-semibold" style={{ color: '#e8e8ed' }}>
              {suscripcion ? 'Editar suscripción' : 'Nueva suscripción'}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: '#8b8b97' }}>
              Completá los datos del servicio
            </p>
          </div>
          <button onClick={onCerrar} className="p-2 rounded-lg transition-colors"
            style={{ color: '#8b8b97' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.color = '#e8e8ed'
              ;(e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.06)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.color = '#8b8b97'
              ;(e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
            }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={manejarSubmit} className="p-6 space-y-6">

          {advertencias.length > 0 && (
            <AlertaSeguridad advertencias={advertencias} onCerrar={() => setAdvertencias([])} />
          )}

          {/* Información básica */}
          <fieldset>
            <legend className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: '#4a4a55' }}>
              Información básica
            </legend>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className={labelClass} style={labelStyle}>Nombre del servicio *</label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={e => actualizar('nombre', e.target.value)}
                  placeholder="ej: Netflix, ChatGPT, Adobe CC..."
                  className={inputClass}
                  style={{ ...inputStyle, borderColor: errores.nombre ? '#ef4444' : '#2a2a2f' }}
                />
                {errores.nombre && (
                  <p className="flex items-center gap-1 text-xs mt-1" style={{ color: '#ef4444' }}>
                    <AlertCircle size={12} /> {errores.nombre}
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass} style={labelStyle}>Descripción</label>
                <input
                  type="text"
                  value={form.descripcion}
                  onChange={e => actualizar('descripcion', e.target.value)}
                  placeholder="Descripción breve del servicio"
                  className={inputClass}
                  style={inputStyle}
                />
              </div>

              <div>
                <label className={labelClass} style={labelStyle}>Categoría</label>
                <select
                  value={form.categoria}
                  onChange={e => actualizar('categoria', e.target.value)}
                  className={inputClass}
                  style={inputStyle}
                >
                  {CATEGORIAS.map(c => (
                    <option key={c.nombre} value={c.nombre}>{c.etiqueta}</option>
                  ))}
                </select>
              </div>
            </div>
          </fieldset>

          {/* Precio y facturación */}
          <fieldset>
            <legend className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: '#4a4a55' }}>
              Precio y facturación
            </legend>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass} style={labelStyle}>Precio *</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.precio || ''}
                  onChange={e => actualizar('precio', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className={inputClass}
                  style={{ ...inputStyle, borderColor: errores.precio ? '#ef4444' : '#2a2a2f' }}
                />
                {errores.precio && (
                  <p className="flex items-center gap-1 text-xs mt-1" style={{ color: '#ef4444' }}>
                    <AlertCircle size={12} /> {errores.precio}
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass} style={labelStyle}>Moneda</label>
                <select
                  value={form.moneda}
                  onChange={e => actualizar('moneda', e.target.value)}
                  className={inputClass}
                  style={inputStyle}
                >
                  {MONEDAS.map(m => (
                    <option key={m.valor} value={m.valor}>{m.valor} — {m.etiqueta}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass} style={labelStyle}>Frecuencia de cobro</label>
                <select
                  value={form.frecuencia}
                  onChange={e => actualizar('frecuencia', e.target.value)}
                  className={inputClass}
                  style={inputStyle}
                >
                  {FRECUENCIAS.map(f => (
                    <option key={f.valor} value={f.valor}>{f.etiqueta}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass} style={labelStyle}>Estado</label>
                <select
                  value={form.estado}
                  onChange={e => actualizar('estado', e.target.value)}
                  className={inputClass}
                  style={inputStyle}
                >
                  {ESTADOS_SUSCRIPCION.map(e => (
                    <option key={e.valor} value={e.valor}>{e.etiqueta}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass} style={labelStyle}>Fecha de inicio *</label>
                <input
                  type="date"
                  value={form.fecha_inicio}
                  onChange={e => actualizar('fecha_inicio', e.target.value)}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>

              <div>
                <label className={labelClass} style={labelStyle}>Próxima renovación *</label>
                <input
                  type="date"
                  value={form.fecha_renovacion}
                  onChange={e => actualizar('fecha_renovacion', e.target.value)}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
            </div>
          </fieldset>

          {/* Método de pago */}
          <fieldset>
            <legend className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: '#4a4a55' }}>
              Método de pago <span style={{ color: '#4a4a55', fontWeight: 'normal', textTransform: 'none' }}>(solo alias, sin datos sensibles)</span>
            </legend>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass} style={labelStyle}>Alias descriptivo</label>
                <input
                  type="text"
                  value={form.metodo_pago?.alias ?? ''}
                  onChange={e => setForm(prev => ({
                    ...prev,
                    metodo_pago: { ...prev.metodo_pago, alias: e.target.value, tipo: prev.metodo_pago?.tipo ?? 'otro' }
                  }))}
                  placeholder="ej: Visa personal, MercadoPago..."
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>Tipo</label>
                <select
                  value={form.metodo_pago?.tipo ?? ''}
                  onChange={e => setForm(prev => ({
                    ...prev,
                    metodo_pago: { ...prev.metodo_pago, alias: prev.metodo_pago?.alias ?? '', tipo: e.target.value as Parameters<typeof setForm>[0] extends (prev: SuscripcionNueva) => SuscripcionNueva ? never : never }
                  }))}
                  className={inputClass}
                  style={inputStyle}
                >
                  <option value="">Seleccionar...</option>
                  {TIPOS_METODO_PAGO.map(t => (
                    <option key={t.valor} value={t.valor}>{t.etiqueta}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>Últimos 4 dígitos (opcional)</label>
                <input
                  type="text"
                  maxLength={4}
                  value={form.metodo_pago?.ultimos_cuatro ?? ''}
                  onChange={e => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 4)
                    setForm(prev => ({
                      ...prev,
                      metodo_pago: { ...prev.metodo_pago, alias: prev.metodo_pago?.alias ?? '', tipo: prev.metodo_pago?.tipo ?? 'otro', ultimos_cuatro: val }
                    }))
                  }}
                  placeholder="1234"
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
            </div>
          </fieldset>

          {/* Uso y organización */}
          <fieldset>
            <legend className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: '#4a4a55' }}>
              Uso y organización
            </legend>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass} style={labelStyle}>Nivel de uso</label>
                <select
                  value={form.nivel_uso}
                  onChange={e => actualizar('nivel_uso', e.target.value)}
                  className={inputClass}
                  style={inputStyle}
                >
                  {NIVELES_USO.map(n => (
                    <option key={n.valor} value={n.valor}>{n.etiqueta}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass} style={labelStyle}>Proyecto asociado</label>
                <input
                  type="text"
                  value={form.proyecto ?? ''}
                  onChange={e => actualizar('proyecto', e.target.value)}
                  placeholder="ej: 3DBAT, Kimera3D..."
                  className={inputClass}
                  style={inputStyle}
                />
              </div>

              <div className="col-span-2">
                <label className={labelClass} style={labelStyle}>Notas</label>
                <textarea
                  value={form.notas ?? ''}
                  onChange={e => actualizar('notas', e.target.value)}
                  placeholder="Notas adicionales sobre este servicio..."
                  rows={2}
                  className={`${inputClass} resize-none`}
                  style={inputStyle}
                />
              </div>
            </div>
          </fieldset>

          {/* Links */}
          <fieldset>
            <legend className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: '#4a4a55' }}>
              Links útiles
            </legend>
            <div className="space-y-3">
              <div>
                <label className={labelClass} style={labelStyle}>
                  <span className="flex items-center gap-1"><Link size={11} /> URL del servicio</span>
                </label>
                <input
                  type="url"
                  value={form.url_servicio ?? ''}
                  onChange={e => actualizar('url_servicio', e.target.value)}
                  placeholder="https://..."
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>
                  <span className="flex items-center gap-1"><Link size={11} /> URL de cancelación</span>
                </label>
                <input
                  type="url"
                  value={form.url_cancelacion ?? ''}
                  onChange={e => actualizar('url_cancelacion', e.target.value)}
                  placeholder="https://..."
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
            </div>
          </fieldset>

          {/* Acciones */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t" style={{ borderColor: '#2a2a2f' }}>
            <button
              type="button"
              onClick={onCerrar}
              className="px-4 py-2 rounded-lg text-sm transition-colors"
              style={{ color: '#8b8b97', backgroundColor: 'transparent' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.05)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={cargando}
              className="px-5 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
              style={{ backgroundColor: '#7c6af7', color: '#fff' }}
              onMouseEnter={e => !cargando && ((e.currentTarget as HTMLElement).style.backgroundColor = '#6b59e8')}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = '#7c6af7'}
            >
              {cargando ? 'Guardando...' : suscripcion ? 'Guardar cambios' : 'Crear suscripción'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
