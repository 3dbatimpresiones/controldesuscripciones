import type { Suscripcion, ResumenFinanciero, CategoriaNombre, Moneda } from '@/tipos'
import { FRECUENCIAS } from '@/configuracion/constantes'

export function calcularPrecioMensual(suscripcion: Suscripcion): number {
  const frecuencia = FRECUENCIAS.find(f => f.valor === suscripcion.frecuencia)
  if (!frecuencia || frecuencia.multiplicador_mensual === 0) return 0
  return suscripcion.precio * frecuencia.multiplicador_mensual
}

export function calcularPrecioAnual(suscripcion: Suscripcion): number {
  return calcularPrecioMensual(suscripcion) * 12
}

export function calcularResumen(suscripciones: Suscripcion[]): ResumenFinanciero {
  const activas = suscripciones.filter(s => s.estado === 'activa')
  const pausadas = suscripciones.filter(s => s.estado === 'pausada')
  const canceladas = suscripciones.filter(s => s.estado === 'cancelada')

  const gastoMensual = activas.reduce((total, s) => total + calcularPrecioMensual(s), 0)

  const porMoneda: Record<string, number> = {}
  activas.forEach(s => {
    const mensual = calcularPrecioMensual(s)
    porMoneda[s.moneda] = (porMoneda[s.moneda] ?? 0) + mensual
  })

  const porCategoria: Record<string, number> = {}
  activas.forEach(s => {
    const mensual = calcularPrecioMensual(s)
    porCategoria[s.categoria] = (porCategoria[s.categoria] ?? 0) + mensual
  })

  const sinUsoOBajoUso = activas.filter(s => s.nivel_uso === 'sin_uso' || s.nivel_uso === 'bajo')
  const ahorroPotencialMensual = sinUsoOBajoUso.reduce((t, s) => t + calcularPrecioMensual(s), 0)

  return {
    gasto_mensual_total: gastoMensual,
    gasto_anual_estimado: gastoMensual * 12,
    por_moneda: porMoneda as Record<Moneda, number>,
    total_activas: activas.length,
    total_pausadas: pausadas.length,
    total_canceladas: canceladas.length,
    por_categoria: porCategoria as Record<CategoriaNombre, number>,
    ahorro_potencial_mensual: ahorroPotencialMensual,
    ahorro_potencial_anual: ahorroPotencialMensual * 12,
  }
}

export function calcularDiasHastaRenovacion(fechaRenovacion: string): number {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const renovacion = new Date(fechaRenovacion)
  renovacion.setHours(0, 0, 0, 0)
  return Math.ceil((renovacion.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))
}

export function esRenovacionUrgente(fechaRenovacion: string, diasUmbral = 7): boolean {
  const dias = calcularDiasHastaRenovacion(fechaRenovacion)
  return dias >= 0 && dias <= diasUmbral
}
