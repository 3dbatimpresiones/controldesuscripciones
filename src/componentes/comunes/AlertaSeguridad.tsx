import { ShieldAlert, X } from 'lucide-react'

interface AlertaSeguridadProps {
  advertencias: string[]
  onCerrar?: () => void
}

export function AlertaSeguridad({ advertencias, onCerrar }: AlertaSeguridadProps) {
  if (advertencias.length === 0) return null

  return (
    <div className="flex items-start gap-3 p-4 rounded-lg border"
      style={{
        backgroundColor: 'rgba(239,68,68,0.08)',
        borderColor: 'rgba(239,68,68,0.25)',
      }}>
      <ShieldAlert size={18} className="flex-shrink-0 mt-0.5" style={{ color: '#ef4444' }} />
      <div className="flex-1">
        <p className="text-sm font-medium mb-1" style={{ color: '#ef4444' }}>
          Posible información sensible detectada
        </p>
        <ul className="space-y-0.5">
          {advertencias.map((adv, i) => (
            <li key={i} className="text-xs" style={{ color: '#f87171' }}>• {adv}</li>
          ))}
        </ul>
        <p className="text-xs mt-2" style={{ color: '#8b8b97' }}>
          Esta aplicación no almacena contraseñas, tokens ni datos financieros sensibles.
        </p>
      </div>
      {onCerrar && (
        <button onClick={onCerrar} style={{ color: '#8b8b97' }}>
          <X size={16} />
        </button>
      )}
    </div>
  )
}
