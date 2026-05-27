import type { Categoria, CategoriaNombre } from '@/tipos'

export const CATEGORIAS: Categoria[] = [
  { id: 'streaming', nombre: 'streaming', etiqueta: 'Streaming', color: '#ef4444', icono: 'Play' },
  { id: 'musica', nombre: 'musica', etiqueta: 'Música', color: '#8b5cf6', icono: 'Music' },
  { id: 'productividad', nombre: 'productividad', etiqueta: 'Productividad', color: '#3b82f6', icono: 'Briefcase' },
  { id: 'almacenamiento', nombre: 'almacenamiento', etiqueta: 'Almacenamiento', color: '#06b6d4', icono: 'HardDrive' },
  { id: 'diseno', nombre: 'diseno', etiqueta: 'Diseño', color: '#f59e0b', icono: 'Palette' },
  { id: 'desarrollo', nombre: 'desarrollo', etiqueta: 'Desarrollo', color: '#10b981', icono: 'Code2' },
  { id: 'ia', nombre: 'ia', etiqueta: 'Inteligencia Artificial', color: '#7c6af7', icono: 'Brain' },
  { id: 'comunicacion', nombre: 'comunicacion', etiqueta: 'Comunicación', color: '#f97316', icono: 'MessageSquare' },
  { id: 'seguridad', nombre: 'seguridad', etiqueta: 'Seguridad', color: '#84cc16', icono: 'Shield' },
  { id: 'educacion', nombre: 'educacion', etiqueta: 'Educación', color: '#ec4899', icono: 'BookOpen' },
  { id: 'negocios', nombre: 'negocios', etiqueta: 'Negocios', color: '#64748b', icono: 'Building2' },
  { id: 'gaming', nombre: 'gaming', etiqueta: 'Gaming', color: '#a855f7', icono: 'Gamepad2' },
  { id: 'finanzas', nombre: 'finanzas', etiqueta: 'Finanzas', color: '#22c55e', icono: 'DollarSign' },
  { id: 'salud', nombre: 'salud', etiqueta: 'Salud', color: '#f43f5e', icono: 'Heart' },
  { id: 'otro', nombre: 'otro', etiqueta: 'Otro', color: '#6b7280', icono: 'Grid3x3' },
]

export const MAPA_CATEGORIAS: Record<CategoriaNombre, Categoria> = Object.fromEntries(
  CATEGORIAS.map(c => [c.nombre, c])
) as Record<CategoriaNombre, Categoria>

export const obtenerCategoria = (nombre: CategoriaNombre): Categoria =>
  MAPA_CATEGORIAS[nombre] ?? MAPA_CATEGORIAS['otro']
