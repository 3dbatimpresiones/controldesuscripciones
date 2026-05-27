import { useState, useEffect } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/configuracion/supabase'
import * as authService from '@/servicios/auth'

interface EstadoAuth {
  usuario: User | null
  cargando: boolean
  error: string | null
}

export function useAuth() {
  const [estado, setEstado] = useState<EstadoAuth>({
    usuario: null,
    cargando: true,
    error: null,
  })

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setEstado({ usuario: data.session?.user ?? null, cargando: false, error: null })
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_evento, sesion) => {
      setEstado({ usuario: sesion?.user ?? null, cargando: false, error: null })
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const iniciarSesion = async (email: string, contrasena: string) => {
    setEstado(e => ({ ...e, cargando: true, error: null }))
    try {
      await authService.iniciarSesionEmail(email, contrasena)
    } catch (err) {
      setEstado(e => ({
        ...e,
        cargando: false,
        error: err instanceof Error ? err.message : 'Error al iniciar sesión',
      }))
    }
  }

  const registrarse = async (email: string, contrasena: string) => {
    setEstado(e => ({ ...e, cargando: true, error: null }))
    try {
      await authService.registrarse(email, contrasena)
    } catch (err) {
      setEstado(e => ({
        ...e,
        cargando: false,
        error: err instanceof Error ? err.message : 'Error al registrarse',
      }))
    }
  }

  const cerrarSesion = async () => {
    await authService.cerrarSesion()
  }

  return {
    ...estado,
    iniciarSesion,
    registrarse,
    cerrarSesion,
    autenticado: !!estado.usuario,
  }
}
