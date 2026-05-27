import { format, formatDistanceToNow, parseISO, addMonths, addYears, addWeeks, addQuarters } from 'date-fns'
import { es } from 'date-fns/locale'
import type { FrecuenciaCobro } from '@/tipos'

export function formatearFecha(fecha: string | Date, patron = 'dd/MM/yyyy'): string {
  const d = typeof fecha === 'string' ? parseISO(fecha) : fecha
  return format(d, patron, { locale: es })
}

export function formatearFechaRelativa(fecha: string | Date): string {
  const d = typeof fecha === 'string' ? parseISO(fecha) : fecha
  return formatDistanceToNow(d, { addSuffix: true, locale: es })
}

export function calcularProximaRenovacion(fechaInicio: string, frecuencia: FrecuenciaCobro): string {
  const inicio = parseISO(fechaInicio)
  const hoy = new Date()

  let proxima = inicio
  while (proxima <= hoy) {
    switch (frecuencia) {
      case 'mensual': proxima = addMonths(proxima, 1); break
      case 'anual': proxima = addYears(proxima, 1); break
      case 'semestral': proxima = addMonths(proxima, 6); break
      case 'trimestral': proxima = addQuarters(proxima, 1); break
      case 'semanal': proxima = addWeeks(proxima, 1); break
      case 'unico': return format(inicio, 'yyyy-MM-dd')
    }
  }

  return format(proxima, 'yyyy-MM-dd')
}

export function etiquetaDiasRestantes(dias: number): string {
  if (dias < 0) return 'Vencida'
  if (dias === 0) return 'Hoy'
  if (dias === 1) return 'Mañana'
  if (dias <= 7) return `En ${dias} días`
  if (dias <= 30) return `En ${Math.round(dias / 7)} semanas`
  return `En ${Math.round(dias / 30)} meses`
}

export function fechaHoy(): string {
  return format(new Date(), 'yyyy-MM-dd')
}
