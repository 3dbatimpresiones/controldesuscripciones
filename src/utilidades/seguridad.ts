import { PATRON_TARJETA, PATRON_POSIBLE_CONTRASEÑA, PATRON_CVV } from '@/configuracion/constantes'

export interface ResultadoValidacion {
  esSeguro: boolean
  advertencias: string[]
}

export function validarContenidoSeguro(texto: string): ResultadoValidacion {
  const advertencias: string[] = []

  if (PATRON_TARJETA.test(texto)) {
    advertencias.push('Se detectó lo que podría ser un número de tarjeta. No guardes datos financieros sensibles.')
  }

  if (PATRON_POSIBLE_CONTRASEÑA.test(texto)) {
    advertencias.push('Se detectó una posible contraseña o credencial. Esta app no almacena contraseñas.')
  }

  const numerosConsecutivos = texto.replace(/\D/g, '')
  if (numerosConsecutivos.length >= 13 && numerosConsecutivos.length <= 19) {
    if (!advertencias.some(a => a.includes('tarjeta'))) {
      advertencias.push('Se detectó una secuencia numérica larga. Verificá que no sea un número de tarjeta.')
    }
  }

  return {
    esSeguro: advertencias.length === 0,
    advertencias,
  }
}

export function validarUltimoCuatro(valor: string): boolean {
  return /^\d{4}$/.test(valor)
}

export function sanitizarTexto(texto: string): string {
  return texto.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
              .replace(/javascript:/gi, '')
              .trim()
}

export function _validarCVV(valor: string): boolean {
  return PATRON_CVV.test(valor)
}
