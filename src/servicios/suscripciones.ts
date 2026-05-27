import { supabase } from '@/configuracion/supabase'
import type { Suscripcion, SuscripcionNueva, SuscripcionActualizada, FiltrosSuscripcion } from '@/tipos'

export async function obtenerSuscripciones(filtros?: FiltrosSuscripcion): Promise<Suscripcion[]> {
  let query = supabase
    .from('suscripciones')
    .select('*')

  if (filtros?.estados?.length) {
    query = query.in('estado', filtros.estados)
  }
  if (filtros?.categorias?.length) {
    query = query.in('categoria', filtros.categorias)
  }
  if (filtros?.monedas?.length) {
    query = query.in('moneda', filtros.monedas)
  }
  if (filtros?.frecuencias?.length) {
    query = query.in('frecuencia', filtros.frecuencias)
  }
  if (filtros?.nivel_uso?.length) {
    query = query.in('nivel_uso', filtros.nivel_uso)
  }
  if (filtros?.busqueda) {
    query = query.ilike('nombre', `%${filtros.busqueda}%`)
  }

  const orden = filtros?.ordenar_por ?? 'fecha_renovacion'
  const asc = filtros?.orden !== 'desc'
  query = query.order(orden, { ascending: asc })

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as Suscripcion[]
}

export async function crearSuscripcion(datos: SuscripcionNueva): Promise<Suscripcion> {
  const { data, error } = await supabase
    .from('suscripciones')
    .insert([datos])
    .select()
    .single()

  if (error) throw error
  return data as Suscripcion
}

export async function actualizarSuscripcion(id: string, datos: SuscripcionActualizada): Promise<Suscripcion> {
  const { data, error } = await supabase
    .from('suscripciones')
    .update(datos)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Suscripcion
}

export async function eliminarSuscripcion(id: string): Promise<void> {
  const { error } = await supabase
    .from('suscripciones')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function obtenerSuscripcion(id: string): Promise<Suscripcion> {
  const { data, error } = await supabase
    .from('suscripciones')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Suscripcion
}

export async function obtenerProximasRenovaciones(dias = 30): Promise<Suscripcion[]> {
  const hoy = new Date().toISOString().split('T')[0]
  const limite = new Date(Date.now() + dias * 86400000).toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('suscripciones')
    .select('*')
    .eq('estado', 'activa')
    .gte('fecha_renovacion', hoy)
    .lte('fecha_renovacion', limite)
    .order('fecha_renovacion', { ascending: true })

  if (error) throw error
  return (data ?? []) as Suscripcion[]
}
