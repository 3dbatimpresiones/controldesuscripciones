export interface ConfiguracionApp {
  cotizacion_usd_ars: number
  cotizacion_usd_eur: number
  moneda_principal: string
  alertas_activadas: boolean
  dias_alerta_anticipacion: number[]
  tema: 'oscuro' | 'claro' | 'sistema'
  idioma: 'es'
}

export interface ConfiguracionAlerta {
  dias_antes: number
  activa: boolean
  canales: ('email' | 'push' | 'whatsapp')[]
}

export const CONFIGURACION_DEFECTO: ConfiguracionApp = {
  cotizacion_usd_ars: 1000,
  cotizacion_usd_eur: 0.92,
  moneda_principal: 'ARS',
  alertas_activadas: true,
  dias_alerta_anticipacion: [7, 3, 1],
  tema: 'oscuro',
  idioma: 'es',
}
