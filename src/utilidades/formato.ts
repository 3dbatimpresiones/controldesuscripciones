import type { Moneda } from '@/tipos'
import { MONEDAS } from '@/configuracion/constantes'

export function formatearMoneda(monto: number, moneda: Moneda): string {
  const config = MONEDAS.find(m => m.valor === moneda)
  const simbolo = config?.simbolo ?? moneda

  if (monto >= 1_000_000) {
    return `${simbolo} ${(monto / 1_000_000).toFixed(1)}M`
  }
  if (monto >= 1_000) {
    return `${simbolo} ${monto.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
  }
  return `${simbolo} ${monto.toFixed(2)}`
}

export function formatearPorcentaje(valor: number, total: number): string {
  if (total === 0) return '0%'
  return `${Math.round((valor / total) * 100)}%`
}

export function truncarTexto(texto: string, maxCaracteres: number): string {
  if (texto.length <= maxCaracteres) return texto
  return `${texto.slice(0, maxCaracteres)}...`
}

export function cn(...clases: (string | undefined | null | false)[]): string {
  return clases.filter(Boolean).join(' ')
}
