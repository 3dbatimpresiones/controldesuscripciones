import type { Moneda, FrecuenciaCobro } from '@/tipos'

export const MONEDAS: { valor: Moneda; etiqueta: string; simbolo: string }[] = [
  { valor: 'ARS', etiqueta: 'Peso Argentino', simbolo: '$' },
  { valor: 'USD', etiqueta: 'Dólar Estadounidense', simbolo: 'US$' },
  { valor: 'EUR', etiqueta: 'Euro', simbolo: '€' },
  { valor: 'BRL', etiqueta: 'Real Brasileño', simbolo: 'R$' },
  { valor: 'CLP', etiqueta: 'Peso Chileno', simbolo: 'CLP$' },
  { valor: 'MXN', etiqueta: 'Peso Mexicano', simbolo: 'MX$' },
  { valor: 'COP', etiqueta: 'Peso Colombiano', simbolo: 'COL$' },
  { valor: 'PEN', etiqueta: 'Sol Peruano', simbolo: 'S/' },
  { valor: 'UYU', etiqueta: 'Peso Uruguayo', simbolo: '$U' },
]

export const FRECUENCIAS: { valor: FrecuenciaCobro; etiqueta: string; multiplicador_mensual: number }[] = [
  { valor: 'mensual', etiqueta: 'Mensual', multiplicador_mensual: 1 },
  { valor: 'trimestral', etiqueta: 'Trimestral', multiplicador_mensual: 1 / 3 },
  { valor: 'semestral', etiqueta: 'Semestral', multiplicador_mensual: 1 / 6 },
  { valor: 'anual', etiqueta: 'Anual', multiplicador_mensual: 1 / 12 },
  { valor: 'semanal', etiqueta: 'Semanal', multiplicador_mensual: 4.33 },
  { valor: 'unico', etiqueta: 'Pago Único', multiplicador_mensual: 0 },
]

export const NIVELES_USO = [
  { valor: 'alto', etiqueta: 'Alto', color: 'text-green-400' },
  { valor: 'medio', etiqueta: 'Medio', color: 'text-yellow-400' },
  { valor: 'bajo', etiqueta: 'Bajo', color: 'text-orange-400' },
  { valor: 'sin_uso', etiqueta: 'Sin Uso', color: 'text-red-400' },
] as const

export const ESTADOS_SUSCRIPCION = [
  { valor: 'activa', etiqueta: 'Activa', color: 'text-green-400' },
  { valor: 'pausada', etiqueta: 'Pausada', color: 'text-yellow-400' },
  { valor: 'cancelada', etiqueta: 'Cancelada', color: 'text-gray-400' },
  { valor: 'vencida', etiqueta: 'Vencida', color: 'text-red-400' },
] as const

export const TIPOS_METODO_PAGO = [
  { valor: 'tarjeta_credito', etiqueta: 'Tarjeta de Crédito' },
  { valor: 'tarjeta_debito', etiqueta: 'Tarjeta de Débito' },
  { valor: 'transferencia', etiqueta: 'Transferencia' },
  { valor: 'paypal', etiqueta: 'PayPal' },
  { valor: 'mercadopago', etiqueta: 'MercadoPago' },
  { valor: 'crypto', etiqueta: 'Criptomoneda' },
  { valor: 'efectivo', etiqueta: 'Efectivo' },
  { valor: 'otro', etiqueta: 'Otro' },
] as const

export const DIAS_ALERTA_DISPONIBLES = [1, 3, 7, 14, 30]

export const PATRON_TARJETA = /\b(?:\d[ -]?){13,19}\b/
export const PATRON_POSIBLE_CONTRASEÑA = /password|passwd|contraseña|secret|token|api[_-]?key/i
export const PATRON_CVV = /\b\d{3,4}\b/
