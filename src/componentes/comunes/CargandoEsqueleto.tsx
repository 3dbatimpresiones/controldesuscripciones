interface EsqueletoProps {
  className?: string
}

export function Esqueleto({ className = '' }: EsqueletoProps) {
  return (
    <div className={`rounded animar-pulso ${className}`}
      style={{ backgroundColor: '#2a2a2f' }} />
  )
}

export function EsqueletoTarjeta() {
  return (
    <div className="p-5 rounded-xl border" style={{ backgroundColor: '#1a1a1d', borderColor: '#2a2a2f' }}>
      <div className="flex items-start justify-between mb-4">
        <Esqueleto className="w-9 h-9 rounded-lg" />
        <Esqueleto className="w-16 h-5 rounded-full" />
      </div>
      <Esqueleto className="w-24 h-3 rounded mb-2" />
      <Esqueleto className="w-32 h-7 rounded" />
    </div>
  )
}

export function EsqueletoFila() {
  return (
    <div className="flex items-center gap-4 p-4 border-b" style={{ borderColor: '#2a2a2f' }}>
      <Esqueleto className="w-9 h-9 rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Esqueleto className="w-40 h-4 rounded" />
        <Esqueleto className="w-24 h-3 rounded" />
      </div>
      <Esqueleto className="w-20 h-5 rounded-full" />
      <Esqueleto className="w-16 h-4 rounded" />
      <Esqueleto className="w-20 h-3 rounded" />
    </div>
  )
}
