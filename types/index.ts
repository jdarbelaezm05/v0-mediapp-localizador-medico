export interface Usuario {
  id_usuario: string
  nombre: string
  correo: string
  contrasena: string
  rol: 'usuario' | 'admin'
  telefono: string
  fecha_registro: Date
  ubicacion_actual: {
    lat: number
    lng: number
  } | null
}

export interface CategoriaServicio {
  id_categoria: string
  nombre: string
  descripcion: string
}

export interface ServicioSalud {
  id_servicio: string
  nombre: string
  tipo: 'hospital' | 'clinica' | 'farmacia' | 'laboratorio' | 'urgencias' | 'eps' | 'otro'
  direccion: string
  latitud: number
  longitud: number
  horario: string
  telefono: string
  descripcion: string
  fecha_registro: Date
  id_categoria: string
}

export interface ImagenServicio {
  id_imagen: string
  id_servicio: string
  url_imagen: string
  descripcion: string
  es_principal: boolean
}

export interface Comentario {
  id_comentario: string
  texto: string
  calificacion: number
  fecha: Date
  id_usuario: string
  id_servicio: string
}

export interface Favorito {
  id_favorito: string
  id_usuario: string
  id_servicio: string
  fecha_agregado: Date
}

export type TipoServicio = ServicioSalud['tipo']

export const TIPO_COLORS: Record<TipoServicio, string> = {
  hospital: '#EF4444',
  clinica: '#0EA5E9',
  farmacia: '#10B981',
  laboratorio: '#F59E0B',
  urgencias: '#DC2626',
  eps: '#8B5CF6',
  otro: '#6B7280'
}

export const TIPO_LABELS: Record<TipoServicio, string> = {
  hospital: 'Hospital',
  clinica: 'Clínica',
  farmacia: 'Farmacia',
  laboratorio: 'Laboratorio',
  urgencias: 'Urgencias',
  eps: 'EPS',
  otro: 'Otro'
}
