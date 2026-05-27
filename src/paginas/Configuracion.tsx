import { useState } from 'react'
import { Settings, DollarSign, Bell, Shield, Download } from 'lucide-react'
import { Encabezado } from '@/componentes/diseno/Encabezado'
import { DIAS_ALERTA_DISPONIBLES } from '@/configuracion/constantes'

export function Configuracion() {
  const [cotizacionUsd, setCotizacionUsd] = useState(1000)
  const [alertasActivas, setAlertasActivas] = useState(true)
  const [diasAlerta, setDiasAlerta] = useState([1, 3, 7])

  const toggleDia = (dia: number) => {
    setDiasAlerta(prev =>
      prev.includes(dia) ? prev.filter(d => d !== dia) : [...prev, dia].sort((a, b) => a - b)
    )
  }

  const inputClass = "px-3 py-2 rounded-lg text-sm border outline-none w-full"
  const inputStyle = { backgroundColor: '#141416', borderColor: '#2a2a2f', color: '#e8e8ed' }

  const Seccion = ({ titulo, descripcion, icono: Icono, children }: {
    titulo: string
    descripcion: string
    icono: typeof Settings
    children: React.ReactNode
  }) => (
    <div className="rounded-xl border" style={{ backgroundColor: '#1a1a1d', borderColor: '#2a2a2f' }}>
      <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: '#2a2a2f' }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: 'rgba(124,106,247,0.12)', border: '1px solid rgba(124,106,247,0.2)' }}>
          <Icono size={15} style={{ color: '#7c6af7' }} />
        </div>
        <div>
          <h2 className="text-sm font-semibold" style={{ color: '#e8e8ed' }}>{titulo}</h2>
          <p className="text-xs" style={{ color: '#8b8b97' }}>{descripcion}</p>
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )

  return (
    <div className="flex flex-col min-h-screen">
      <Encabezado titulo="Configuración" descripcion="Personalizá la aplicación a tu gusto" />

      <div className="flex-1 p-8 space-y-5 max-w-2xl">

        <Seccion titulo="Cotizaciones" descripcion="Tipos de cambio para conversión de monedas" icono={DollarSign}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#8b8b97' }}>
                USD → ARS (cotización informal)
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm" style={{ color: '#8b8b97' }}>$</span>
                <input
                  type="number"
                  value={cotizacionUsd}
                  onChange={e => setCotizacionUsd(Number(e.target.value))}
                  className={inputClass}
                  style={inputStyle}
                />
                <span className="text-sm flex-shrink-0" style={{ color: '#8b8b97' }}>ARS / 1 USD</span>
              </div>
            </div>
            <p className="text-xs" style={{ color: '#4a4a55' }}>
              Esta cotización se usa para convertir precios en USD a ARS en los reportes.
              Actualizala manualmente cuando sea necesario.
            </p>
          </div>
        </Seccion>

        <Seccion titulo="Alertas" descripcion="Configurá cuándo querés ser notificado" icono={Bell}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: '#e8e8ed' }}>Alertas activas</p>
                <p className="text-xs" style={{ color: '#8b8b97' }}>Recibí recordatorios antes de las renovaciones</p>
              </div>
              <button
                onClick={() => setAlertasActivas(!alertasActivas)}
                className="relative w-11 h-6 rounded-full transition-all"
                style={{ backgroundColor: alertasActivas ? '#7c6af7' : '#2a2a2f' }}
              >
                <span className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-all"
                  style={{
                    backgroundColor: '#fff',
                    transform: alertasActivas ? 'translateX(20px)' : 'translateX(0)',
                  }} />
              </button>
            </div>

            {alertasActivas && (
              <div>
                <p className="text-xs font-medium mb-3" style={{ color: '#8b8b97' }}>
                  Alertar con anticipación de:
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  {DIAS_ALERTA_DISPONIBLES.map(dia => {
                    const activo = diasAlerta.includes(dia)
                    return (
                      <button
                        key={dia}
                        onClick={() => toggleDia(dia)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                        style={{
                          backgroundColor: activo ? 'rgba(124,106,247,0.15)' : '#141416',
                          borderColor: activo ? 'rgba(124,106,247,0.4)' : '#2a2a2f',
                          color: activo ? '#7c6af7' : '#8b8b97',
                          border: '1px solid',
                        }}
                      >
                        {dia === 1 ? '1 día' : `${dia} días`}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </Seccion>

        <Seccion titulo="Privacidad y seguridad" descripcion="Información sobre cómo protegemos tus datos" icono={Shield}>
          <div className="space-y-3">
            {[
              'No almacenamos contraseñas ni credenciales de ningún servicio',
              'No guardamos números completos de tarjetas, tokens ni datos financieros sensibles',
              'Solo almacenamos información administrativa descriptiva de tus suscripciones',
              'Tus datos están protegidos con Row Level Security en Supabase',
              'La aplicación detecta y advierte si intentás ingresar información sensible',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                  style={{ backgroundColor: '#22c55e' }} />
                <p className="text-xs" style={{ color: '#8b8b97' }}>{item}</p>
              </div>
            ))}
          </div>
        </Seccion>

        <Seccion titulo="Datos" descripcion="Exportá tu información" icono={Download}>
          <div className="space-y-3">
            <p className="text-xs" style={{ color: '#8b8b97' }}>
              Podés exportar todas tus suscripciones en formato CSV para usarlas en otras herramientas.
            </p>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm border transition-colors"
              style={{ borderColor: '#2a2a2f', color: '#8b8b97', backgroundColor: 'transparent' }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = '#7c6af7'
                ;(e.currentTarget as HTMLElement).style.color = '#7c6af7'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = '#2a2a2f'
                ;(e.currentTarget as HTMLElement).style.color = '#8b8b97'
              }}
            >
              <Download size={15} />
              Exportar como CSV
            </button>
            <p className="text-xs" style={{ color: '#4a4a55' }}>
              La exportación estará disponible en la próxima versión.
            </p>
          </div>
        </Seccion>

      </div>
    </div>
  )
}
