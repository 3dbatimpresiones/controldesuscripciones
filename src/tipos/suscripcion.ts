export type EstadoSuscripcion = 'activa' | 'pausada' | 'cancelada' | 'vencida'

export type FrecuenciaCobro = 'mensual' | 'anual' | 'semestral' | 'trimestral' | 'semanal' | 'unico'

export type NivelUso = 'alto' | 'medio' | 'bajo' | 'sin_uso'

export type Moneda = 'ARS' | 'USD' | 'EUR' | 'BRL' | 'CLP' | 'MXN' | 'COP' | 'PEN' | 'UYU'

export type CategoriaNombre =
  | 'streaming'
  | 'musica'
  | 'productividad'
  | 'almacenamiento'
  | 'diseno'
  | 'desarrollo'
  | 'ia'
  | 'comunicacion'
  | 'seguridad'
  | 'educacion'
  | 'negocios'
  | 'gaming'
  | 'finanzas'
  | 'salud'
  | 'otro'

export interface Categoria {
  id: string
  nombre: CategoriaNombre
  etiqueta: string
  color: string
  icono: string
}

export interface MetodoPago {
  alias: string
  tipo: 'tarjeta_credito' | 'tarjeta_debito' | 'transferencia' | 'paypal' | 'mercadopago' | 'crypto' | 'efectivo' | 'otro'
  ultimos_cuatro?: string
}

export interface Suscripcion {
  id: string
  usuario_id: string
  nombre: string
  descripcion?: string
  categoria: CategoriaNombre
  precio: number
  moneda: Moneda
  frecuencia: FrecuenciaCobro
  fecha_inicio: string
  fecha_renovacion: string
  estado: EstadoSuscripcion
  metodo_pago?: MetodoPago
  nivel_uso: NivelUso
  proyecto?: string
  notas?: string
  url_servicio?: string
  url_cancelacion?: string
  creado_en: string
  actualizado_en: string
}

export type SuscripcionNueva = Omit<Suscripcion, 'id' | 'usuario_id' | 'creado_en' | 'actualizado_en'>

export type SuscripcionActualizada = Partial<SuscripcionNueva>

export interface FiltrosSuscripcion {
  busqueda?: string
  categorias?: CategoriaNombre[]
  estados?: EstadoSuscripcion[]
  monedas?: Moneda[]
  frecuencias?: FrecuenciaCobro[]
  nivel_uso?: NivelUso[]
  ordenar_por?: 'nombre' | 'precio' | 'fecha_renovacion' | 'creado_en'
  orden?: 'asc' | 'desc'
}

export interface ResumenFinanciero {
  gasto_mensual_total: number
  gasto_anual_estimado: number
  por_moneda: Record<Moneda, number>
  total_activas: number
  total_pausadas: number
  total_canceladas: number
  por_categoria: Record<CategoriaNombre, number>
  ahorro_potencial_mensual: number
  ahorro_potencial_anual: number
}

export interface RenovacionProxima {
  suscripcion: Suscripcion
  dias_restantes: number
  es_urgente: boolean
}
