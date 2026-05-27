import { useState, useEffect, useCallback } from 'react'
import type { Suscripcion, SuscripcionNueva, SuscripcionActualizada, FiltrosSuscripcion, ResumenFinanciero } from '@/tipos'
import * as servicios from '@/servicios/suscripciones'
import { calcularResumen } from '@/utilidades/calculos'

interface EstadoSuscripciones {
  suscripciones: Suscripcion[]
  cargando: boolean
  error: string | null
  resumen: ResumenFinanciero | null
}

export function useSuscripciones(filtros?: FiltrosSuscripcion) {
  const [estado, setEstado] = useState<EstadoSuscripciones>({
    suscripciones: [],
    cargando: true,
    error: null,
    resumen: null,
  })

  const cargar = useCallback(async () => {
    setEstado(e => ({ ...e, cargando: true, error: null }))
    try {
      const datos = await servicios.obtenerSuscripciones(filtros)
      setEstado({
        suscripciones: datos,
        cargando: false,
        error: null,
        resumen: calcularResumen(datos),
      })
    } catch (err) {
      setEstado(e => ({
        ...e,
        cargando: false,
        error: err instanceof Error ? err.message : 'Error al cargar suscripciones',
      }))
    }
  }, [JSON.stringify(filtros)])

  useEffect(() => { cargar() }, [cargar])

  const crear = useCallback(async (datos: SuscripcionNueva): Promise<Suscripcion> => {
    const nueva = await servicios.crearSuscripcion(datos)
    await cargar()
    return nueva
  }, [cargar])

  const actualizar = useCallback(async (id: string, datos: SuscripcionActualizada): Promise<Suscripcion> => {
    const actualizada = await servicios.actualizarSuscripcion(id, datos)
    await cargar()
    return actualizada
  }, [cargar])

  const eliminar = useCallback(async (id: string): Promise<void> => {
    await servicios.eliminarSuscripcion(id)
    await cargar()
  }, [cargar])

  return {
    ...estado,
    cargar,
    crear,
    actualizar,
    eliminar,
  }
}

export function useProximasRenovaciones(dias = 30) {
  const [renovaciones, setRenovaciones] = useState<Suscripcion[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    servicios.obtenerProximasRenovaciones(dias)
      .then(setRenovaciones)
      .catch(console.error)
      .finally(() => setCargando(false))
  }, [dias])

  return { renovaciones, cargando }
}
