'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Usuario, ServicioSalud, CategoriaServicio, Comentario, Favorito, ImagenServicio, TipoServicio } from '@/types'
import { usuarios as initialUsuarios, servicios as initialServicios, categorias, comentarios as initialComentarios, favoritos as initialFavoritos, imagenes } from '@/data/mock-data'

interface AuthState {
  user: Usuario | null
  isAuthenticated: boolean
}

interface FilterState {
  searchQuery: string
  selectedCategories: string[]
  selectedTipos: TipoServicio[]
  minCalificacion: number
  abiertoAhora: boolean
}

interface AppState extends AuthState, FilterState {
  // Data
  usuarios: Usuario[]
  servicios: ServicioSalud[]
  categorias: CategoriaServicio[]
  comentarios: Comentario[]
  favoritos: Favorito[]
  imagenes: ImagenServicio[]
  
  // Auth actions
  login: (correo: string, contrasena: string) => Promise<boolean>
  register: (userData: Omit<Usuario, 'id_usuario' | 'fecha_registro' | 'ubicacion_actual' | 'rol'>) => Promise<boolean>
  logout: () => void
  
  // Filter actions
  setSearchQuery: (query: string) => void
  setSelectedCategories: (categories: string[]) => void
  setSelectedTipos: (tipos: TipoServicio[]) => void
  setMinCalificacion: (rating: number) => void
  setAbiertoAhora: (abierto: boolean) => void
  resetFilters: () => void
  
  // Service actions
  getFilteredServices: () => ServicioSalud[]
  getServiceById: (id: string) => ServicioSalud | undefined
  getServiceImages: (id: string) => ImagenServicio[]
  getServiceComments: (id: string) => (Comentario & { usuario: Usuario })[]
  getServiceAverageRating: (id: string) => number
  addService: (service: Omit<ServicioSalud, 'id_servicio' | 'fecha_registro'>) => void
  updateService: (id: string, service: Partial<ServicioSalud>) => void
  deleteService: (id: string) => void
  
  // Image actions
  addImage: (image: Omit<ImagenServicio, 'id_imagen'>) => void
  deleteImage: (id: string) => void
  setMainImage: (serviceId: string, imageId: string) => void
  
  // Comment actions
  addComment: (comment: Omit<Comentario, 'id_comentario' | 'fecha'>) => void
  deleteComment: (id: string) => void
  getUserComments: (userId: string) => (Comentario & { servicio: ServicioSalud })[]
  
  // Favorite actions
  addFavorite: (serviceId: string) => void
  removeFavorite: (serviceId: string) => void
  isFavorite: (serviceId: string) => boolean
  getUserFavorites: () => ServicioSalud[]
  
  // User actions (admin)
  getAllUsers: () => Usuario[]
  toggleUserRole: (userId: string) => void
  deleteUser: (userId: string) => void
  updateUser: (userId: string, data: Partial<Usuario>) => void
  
  // Stats
  getStats: () => {
    totalUsuarios: number
    totalServicios: number
    totalComentarios: number
    serviciosPorCategoria: { categoria: string; cantidad: number }[]
    serviciosPorTipo: { tipo: string; cantidad: number }[]
    topServicios: (ServicioSalud & { calificacion: number })[]
  }
}

const initialFilters: FilterState = {
  searchQuery: '',
  selectedCategories: [],
  selectedTipos: [],
  minCalificacion: 0,
  abiertoAhora: false
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      usuarios: initialUsuarios,
      servicios: initialServicios,
      categorias: categorias,
      comentarios: initialComentarios,
      favoritos: initialFavoritos,
      imagenes: imagenes,
      ...initialFilters,

      // Auth actions
      login: async (correo: string, contrasena: string) => {
        const { usuarios } = get()
        // Mock password check - in real app, use bcrypt.compare
        const user = usuarios.find(u => u.correo.toLowerCase() === correo.toLowerCase())
        if (user && contrasena === 'password123') {
          set({ user, isAuthenticated: true })
          return true
        }
        return false
      },

      register: async (userData) => {
        const { usuarios } = get()
        if (usuarios.some(u => u.correo.toLowerCase() === userData.correo.toLowerCase())) {
          return false
        }
        const newUser: Usuario = {
          ...userData,
          id_usuario: `user-${Date.now()}`,
          rol: 'usuario',
          fecha_registro: new Date(),
          ubicacion_actual: null
        }
        set({ usuarios: [...usuarios, newUser], user: newUser, isAuthenticated: true })
        return true
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
      },

      // Filter actions
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedCategories: (categories) => set({ selectedCategories: categories }),
      setSelectedTipos: (tipos) => set({ selectedTipos: tipos }),
      setMinCalificacion: (rating) => set({ minCalificacion: rating }),
      setAbiertoAhora: (abierto) => set({ abiertoAhora: abierto }),
      resetFilters: () => set(initialFilters),

      // Service actions
      getFilteredServices: () => {
        const { servicios, searchQuery, selectedCategories, selectedTipos, minCalificacion, comentarios } = get()
        
        return servicios.filter(servicio => {
          // Search filter
          if (searchQuery) {
            const query = searchQuery.toLowerCase()
            if (!servicio.nombre.toLowerCase().includes(query) && 
                !servicio.tipo.toLowerCase().includes(query) &&
                !servicio.direccion.toLowerCase().includes(query)) {
              return false
            }
          }
          
          // Category filter
          if (selectedCategories.length > 0 && !selectedCategories.includes(servicio.id_categoria)) {
            return false
          }
          
          // Type filter
          if (selectedTipos.length > 0 && !selectedTipos.includes(servicio.tipo)) {
            return false
          }
          
          // Rating filter
          if (minCalificacion > 0) {
            const serviceComments = comentarios.filter(c => c.id_servicio === servicio.id_servicio)
            const avgRating = serviceComments.length > 0
              ? serviceComments.reduce((sum, c) => sum + c.calificacion, 0) / serviceComments.length
              : 0
            if (avgRating < minCalificacion) {
              return false
            }
          }
          
          return true
        })
      },

      getServiceById: (id) => {
        return get().servicios.find(s => s.id_servicio === id)
      },

      getServiceImages: (id) => {
        return get().imagenes
          .filter(i => i.id_servicio === id)
          .sort((a, b) => (b.es_principal ? 1 : 0) - (a.es_principal ? 1 : 0))
      },

      getServiceComments: (id) => {
        const { comentarios, usuarios } = get()
        return comentarios
          .filter(c => c.id_servicio === id)
          .map(c => ({
            ...c,
            usuario: usuarios.find(u => u.id_usuario === c.id_usuario)!
          }))
          .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
      },

      getServiceAverageRating: (id) => {
        const comments = get().comentarios.filter(c => c.id_servicio === id)
        if (comments.length === 0) return 0
        return comments.reduce((sum, c) => sum + c.calificacion, 0) / comments.length
      },

      addService: (service) => {
        const newService: ServicioSalud = {
          ...service,
          id_servicio: `serv-${Date.now()}`,
          fecha_registro: new Date()
        }
        set({ servicios: [...get().servicios, newService] })
      },

      updateService: (id, data) => {
        set({
          servicios: get().servicios.map(s =>
            s.id_servicio === id ? { ...s, ...data } : s
          )
        })
      },

      deleteService: (id) => {
        set({
          servicios: get().servicios.filter(s => s.id_servicio !== id),
          imagenes: get().imagenes.filter(i => i.id_servicio !== id),
          comentarios: get().comentarios.filter(c => c.id_servicio !== id),
          favoritos: get().favoritos.filter(f => f.id_servicio !== id)
        })
      },

      // Image actions
      addImage: (image) => {
        const newImage: ImagenServicio = {
          ...image,
          id_imagen: `img-${Date.now()}`
        }
        set({ imagenes: [...get().imagenes, newImage] })
      },

      deleteImage: (id) => {
        set({ imagenes: get().imagenes.filter(i => i.id_imagen !== id) })
      },

      setMainImage: (serviceId, imageId) => {
        set({
          imagenes: get().imagenes.map(i => ({
            ...i,
            es_principal: i.id_servicio === serviceId ? i.id_imagen === imageId : i.es_principal
          }))
        })
      },

      // Comment actions
      addComment: (comment) => {
        const newComment: Comentario = {
          ...comment,
          id_comentario: `com-${Date.now()}`,
          fecha: new Date()
        }
        set({ comentarios: [...get().comentarios, newComment] })
      },

      deleteComment: (id) => {
        set({ comentarios: get().comentarios.filter(c => c.id_comentario !== id) })
      },

      getUserComments: (userId) => {
        const { comentarios, servicios } = get()
        return comentarios
          .filter(c => c.id_usuario === userId)
          .map(c => ({
            ...c,
            servicio: servicios.find(s => s.id_servicio === c.id_servicio)!
          }))
          .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
      },

      // Favorite actions
      addFavorite: (serviceId) => {
        const { user, favoritos } = get()
        if (!user) return
        if (favoritos.some(f => f.id_usuario === user.id_usuario && f.id_servicio === serviceId)) return
        
        const newFavorite: Favorito = {
          id_favorito: `fav-${Date.now()}`,
          id_usuario: user.id_usuario,
          id_servicio: serviceId,
          fecha_agregado: new Date()
        }
        set({ favoritos: [...favoritos, newFavorite] })
      },

      removeFavorite: (serviceId) => {
        const { user, favoritos } = get()
        if (!user) return
        set({
          favoritos: favoritos.filter(
            f => !(f.id_usuario === user.id_usuario && f.id_servicio === serviceId)
          )
        })
      },

      isFavorite: (serviceId) => {
        const { user, favoritos } = get()
        if (!user) return false
        return favoritos.some(f => f.id_usuario === user.id_usuario && f.id_servicio === serviceId)
      },

      getUserFavorites: () => {
        const { user, favoritos, servicios } = get()
        if (!user) return []
        const userFavoriteIds = favoritos
          .filter(f => f.id_usuario === user.id_usuario)
          .map(f => f.id_servicio)
        return servicios.filter(s => userFavoriteIds.includes(s.id_servicio))
      },

      // User actions (admin)
      getAllUsers: () => get().usuarios,

      toggleUserRole: (userId) => {
        set({
          usuarios: get().usuarios.map(u =>
            u.id_usuario === userId
              ? { ...u, rol: u.rol === 'admin' ? 'usuario' : 'admin' }
              : u
          )
        })
      },

      deleteUser: (userId) => {
        const { user } = get()
        if (user?.id_usuario === userId) return // Can't delete yourself
        set({
          usuarios: get().usuarios.filter(u => u.id_usuario !== userId),
          comentarios: get().comentarios.filter(c => c.id_usuario !== userId),
          favoritos: get().favoritos.filter(f => f.id_usuario !== userId)
        })
      },

      updateUser: (userId, data) => {
        const { user } = get()
        set({
          usuarios: get().usuarios.map(u =>
            u.id_usuario === userId ? { ...u, ...data } : u
          ),
          user: user?.id_usuario === userId ? { ...user, ...data } : user
        })
      },

      // Stats
      getStats: () => {
        const { usuarios, servicios, comentarios, categorias } = get()
        
        const serviciosPorCategoria = categorias.map(cat => ({
          categoria: cat.nombre,
          cantidad: servicios.filter(s => s.id_categoria === cat.id_categoria).length
        }))
        
        const tipoCount: Record<string, number> = {}
        servicios.forEach(s => {
          tipoCount[s.tipo] = (tipoCount[s.tipo] || 0) + 1
        })
        const serviciosPorTipo = Object.entries(tipoCount).map(([tipo, cantidad]) => ({
          tipo,
          cantidad
        }))
        
        const serviciosConCalificacion = servicios.map(s => {
          const serviceComments = comentarios.filter(c => c.id_servicio === s.id_servicio)
          const calificacion = serviceComments.length > 0
            ? serviceComments.reduce((sum, c) => sum + c.calificacion, 0) / serviceComments.length
            : 0
          return { ...s, calificacion }
        })
        
        const topServicios = [...serviciosConCalificacion]
          .sort((a, b) => b.calificacion - a.calificacion)
          .slice(0, 5)
        
        return {
          totalUsuarios: usuarios.length,
          totalServicios: servicios.length,
          totalComentarios: comentarios.length,
          serviciosPorCategoria,
          serviciosPorTipo,
          topServicios
        }
      }
    }),
    {
      name: 'mediapp-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        usuarios: state.usuarios,
        servicios: state.servicios,
        comentarios: state.comentarios,
        favoritos: state.favoritos,
        imagenes: state.imagenes
      })
    }
  )
)
