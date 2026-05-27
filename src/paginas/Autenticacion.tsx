import { useState } from 'react'
import { Zap, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

type Modo = 'login' | 'registro' | 'recuperar'

export function Autenticacion() {
  const { iniciarSesion, registrarse, error, cargando } = useAuth()
  const [modo, setModo] = useState<Modo>('login')
  const [email, setEmail] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [mostrarContrasena, setMostrarContrasena] = useState(false)
  const [mensajeExito, setMensajeExito] = useState('')

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMensajeExito('')

    if (modo === 'login') {
      await iniciarSesion(email, contrasena)
    } else if (modo === 'registro') {
      await registrarse(email, contrasena)
      setMensajeExito('Cuenta creada. Revisá tu email para confirmar tu cuenta.')
    }
  }

  const inputClass = "w-full px-4 py-3 rounded-xl text-sm border outline-none transition-all"
  const inputStyle = { backgroundColor: '#0f0f10', borderColor: '#2a2a2f', color: '#e8e8ed' }

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: '#141416' }}>

      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-2xl items-center justify-center mb-4"
            style={{ backgroundColor: 'rgba(124,106,247,0.15)', border: '1px solid rgba(124,106,247,0.25)' }}>
            <Zap size={22} style={{ color: '#7c6af7' }} />
          </div>
          <h1 className="text-2xl font-semibold mb-1" style={{ color: '#e8e8ed' }}>Substrack</h1>
          <p className="text-sm" style={{ color: '#8b8b97' }}>
            {modo === 'login' ? 'Iniciá sesión en tu cuenta' :
              modo === 'registro' ? 'Creá tu cuenta gratuita' :
              'Recuperá tu contraseña'}
          </p>
        </div>

        {/* Card */}
        <div className="p-6 rounded-2xl border" style={{ backgroundColor: '#1a1a1d', borderColor: '#2a2a2f' }}>

          {mensajeExito && (
            <div className="flex items-center gap-2 p-3 rounded-lg mb-4"
              style={{ backgroundColor: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
              <p className="text-sm" style={{ color: '#22c55e' }}>{mensajeExito}</p>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg mb-4"
              style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <AlertCircle size={15} className="flex-shrink-0 mt-0.5" style={{ color: '#ef4444' }} />
              <p className="text-sm" style={{ color: '#ef4444' }}>
                {error.includes('Invalid login credentials')
                  ? 'Email o contraseña incorrectos'
                  : error.includes('Email not confirmed')
                  ? 'Confirmá tu email antes de iniciar sesión'
                  : error.includes('already registered')
                  ? 'Este email ya está registrado'
                  : error}
              </p>
            </div>
          )}

          <form onSubmit={manejarSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: '#8b8b97' }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                autoComplete="email"
                className={inputClass}
                style={inputStyle}
                onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = '#7c6af7'}
                onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = '#2a2a2f'}
              />
            </div>

            {modo !== 'recuperar' && (
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: '#8b8b97' }}>Contraseña</label>
                <div className="relative">
                  <input
                    type={mostrarContrasena ? 'text' : 'password'}
                    value={contrasena}
                    onChange={e => setContrasena(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    autoComplete={modo === 'login' ? 'current-password' : 'new-password'}
                    className={`${inputClass} pr-11`}
                    style={inputStyle}
                    onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = '#7c6af7'}
                    onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = '#2a2a2f'}
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarContrasena(!mostrarContrasena)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: '#4a4a55' }}
                  >
                    {mostrarContrasena ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={cargando}
              className="w-full py-3 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
              style={{ backgroundColor: '#7c6af7', color: '#fff' }}
              onMouseEnter={e => !cargando && ((e.currentTarget as HTMLElement).style.backgroundColor = '#6b59e8')}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = '#7c6af7'}
            >
              {cargando ? 'Cargando...' :
                modo === 'login' ? 'Iniciar sesión' :
                modo === 'registro' ? 'Crear cuenta' :
                'Enviar email de recuperación'}
            </button>
          </form>

          {/* Links secundarios */}
          <div className="mt-5 space-y-2 text-center">
            {modo === 'login' && (
              <>
                <button
                  onClick={() => setModo('recuperar')}
                  className="text-xs block w-full transition-colors"
                  style={{ color: '#4a4a55' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#8b8b97'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#4a4a55'}
                >
                  ¿Olvidaste tu contraseña?
                </button>
                <button
                  onClick={() => setModo('registro')}
                  className="text-xs block w-full transition-colors"
                  style={{ color: '#8b8b97' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#e8e8ed'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#8b8b97'}
                >
                  ¿No tenés cuenta? <span style={{ color: '#7c6af7' }}>Registrate gratis</span>
                </button>
              </>
            )}
            {(modo === 'registro' || modo === 'recuperar') && (
              <button
                onClick={() => setModo('login')}
                className="text-xs transition-colors"
                style={{ color: '#8b8b97' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#e8e8ed'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#8b8b97'}
              >
                ← Volver al inicio de sesión
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: '#2a2a2f' }}>
          Substrack — Gestor de suscripciones personales
        </p>
      </div>
    </div>
  )
}
