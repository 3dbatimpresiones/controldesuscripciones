import { supabase } from '@/configuracion/supabase'
import type { User, Session } from '@supabase/supabase-js'

export async function iniciarSesionEmail(email: string, contrasena: string): Promise<{ usuario: User; sesion: Session }> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password: contrasena })
  if (error) throw error
  return { usuario: data.user, sesion: data.session }
}

export async function registrarse(email: string, contrasena: string): Promise<{ usuario: User | null }> {
  const { data, error } = await supabase.auth.signUp({ email, password: contrasena })
  if (error) throw error
  return { usuario: data.user }
}

export async function cerrarSesion(): Promise<void> {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function obtenerSesionActual(): Promise<Session | null> {
  const { data } = await supabase.auth.getSession()
  return data.session
}

export async function recuperarContrasena(email: string): Promise<void> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/nueva-contrasena`,
  })
  if (error) throw error
}
