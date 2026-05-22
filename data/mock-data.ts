import type { Usuario, CategoriaServicio, ServicioSalud, ImagenServicio, Comentario, Favorito } from '@/types'

// Categorías de servicio
export const categorias: CategoriaServicio[] = [
  {
    id_categoria: 'cat-1',
    nombre: 'Hospitales',
    descripcion: 'Centros hospitalarios con atención integral y especializada'
  },
  {
    id_categoria: 'cat-2',
    nombre: 'Clínicas',
    descripcion: 'Clínicas privadas con servicios médicos especializados'
  },
  {
    id_categoria: 'cat-3',
    nombre: 'Farmacias',
    descripcion: 'Establecimientos de venta de medicamentos y productos farmacéuticos'
  },
  {
    id_categoria: 'cat-4',
    nombre: 'Laboratorios',
    descripcion: 'Laboratorios clínicos para análisis y diagnóstico'
  }
]

// Usuarios mock (contraseñas: "password123" hasheadas con bcrypt)
export const usuarios: Usuario[] = [
  {
    id_usuario: 'user-1',
    nombre: 'Admin Sistema',
    correo: 'admin@mediapp.com',
    contrasena: '$2a$10$rQnM1234567890abcdefghijklmnopqrstuvwxyzABCDEFGH', // password123
    rol: 'admin',
    telefono: '+57 300 123 4567',
    fecha_registro: new Date('2024-01-01'),
    ubicacion_actual: { lat: 10.9639, lng: -74.7964 }
  },
  {
    id_usuario: 'user-2',
    nombre: 'María García',
    correo: 'maria@email.com',
    contrasena: '$2a$10$rQnM1234567890abcdefghijklmnopqrstuvwxyzABCDEFGH',
    rol: 'usuario',
    telefono: '+57 301 234 5678',
    fecha_registro: new Date('2024-02-15'),
    ubicacion_actual: { lat: 10.9785, lng: -74.8123 }
  },
  {
    id_usuario: 'user-3',
    nombre: 'Carlos Rodríguez',
    correo: 'carlos@email.com',
    contrasena: '$2a$10$rQnM1234567890abcdefghijklmnopqrstuvwxyzABCDEFGH',
    rol: 'usuario',
    telefono: '+57 302 345 6789',
    fecha_registro: new Date('2024-03-20'),
    ubicacion_actual: null
  }
]

// Servicios de salud en Barranquilla
export const servicios: ServicioSalud[] = [
  {
    id_servicio: 'serv-1',
    nombre: 'Hospital Universidad del Norte',
    tipo: 'hospital',
    direccion: 'Calle 30, Autopista al Aeropuerto, al lado del Parque Muvdi, Barranquilla',
    latitud: 10.9632,
    longitud: -74.8012,
    horario: 'Lunes a Domingo: 24 horas',
    telefono: '+57 605 350 9509',
    descripcion: 'Hospital universitario de alta complejidad con servicios de urgencias, hospitalización y especialidades médicas.',
    fecha_registro: new Date('2024-01-10'),
    id_categoria: 'cat-1'
  },
  {
    id_servicio: 'serv-2',
    nombre: 'Clínica Portoazul',
    tipo: 'clinica',
    direccion: 'Vía Puerto Colombia Km 2, Barranquilla',
    latitud: 11.0156,
    longitud: -74.8523,
    horario: 'Lunes a Viernes: 6:00 AM - 8:00 PM, Sábados: 7:00 AM - 2:00 PM',
    telefono: '+57 605 385 5500',
    descripcion: 'Clínica especializada en servicios ambulatorios, consultas externas y procedimientos quirúrgicos programados.',
    fecha_registro: new Date('2024-01-15'),
    id_categoria: 'cat-2'
  },
  {
    id_servicio: 'serv-3',
    nombre: 'Farmacia Drogas La Rebaja',
    tipo: 'farmacia',
    direccion: 'Calle 72 # 53-23, Barranquilla',
    latitud: 10.9891,
    longitud: -74.7989,
    horario: 'Lunes a Sábado: 7:00 AM - 10:00 PM, Domingos: 8:00 AM - 8:00 PM',
    telefono: '+57 605 356 4321',
    descripcion: 'Cadena de farmacias con amplio surtido de medicamentos, productos de cuidado personal y atención farmacéutica.',
    fecha_registro: new Date('2024-01-20'),
    id_categoria: 'cat-3'
  },
  {
    id_servicio: 'serv-4',
    nombre: 'Laboratorio Clínico Colcan',
    tipo: 'laboratorio',
    direccion: 'Carrera 65 # 72-46, San Francisco, Barranquilla',
    latitud: 10.9878,
    longitud: -74.8145,
    horario: 'Lunes a Viernes: 6:00 AM - 6:00 PM, Sábados: 6:00 AM - 12:00 PM',
    telefono: '+57 605 368 5500',
    descripcion: 'Laboratorio clínico con tecnología de punta para análisis clínicos, patología y medicina molecular.',
    fecha_registro: new Date('2024-02-01'),
    id_categoria: 'cat-4'
  },
  {
    id_servicio: 'serv-5',
    nombre: 'Clínica del Caribe',
    tipo: 'urgencias',
    direccion: 'Calle 80 # 49C-65, Barranquilla',
    latitud: 10.9956,
    longitud: -74.8056,
    horario: 'Lunes a Domingo: 24 horas',
    telefono: '+57 605 330 0000',
    descripcion: 'Centro de urgencias y emergencias médicas con atención inmediata las 24 horas del día.',
    fecha_registro: new Date('2024-02-10'),
    id_categoria: 'cat-1'
  },
  {
    id_servicio: 'serv-6',
    nombre: 'Nueva EPS - Sede Norte',
    tipo: 'eps',
    direccion: 'Calle 84 # 47-65, Barranquilla',
    latitud: 11.0012,
    longitud: -74.8034,
    horario: 'Lunes a Viernes: 7:00 AM - 5:00 PM, Sábados: 8:00 AM - 12:00 PM',
    telefono: '+57 1 307 7001',
    descripcion: 'Sede administrativa de Nueva EPS para afiliaciones, autorizaciones y servicios al usuario.',
    fecha_registro: new Date('2024-02-15'),
    id_categoria: 'cat-2'
  },
  {
    id_servicio: 'serv-7',
    nombre: 'Farmacia Cruz Verde Buenavista',
    tipo: 'farmacia',
    direccion: 'Calle 98 # 52-155, Local 107, Barranquilla',
    latitud: 11.0089,
    longitud: -74.7967,
    horario: 'Lunes a Domingo: 7:00 AM - 11:00 PM',
    telefono: '+57 605 345 6789',
    descripcion: 'Farmacia con servicio de domicilio, inyectología y amplio portafolio de medicamentos genéricos y de marca.',
    fecha_registro: new Date('2024-03-01'),
    id_categoria: 'cat-3'
  },
  {
    id_servicio: 'serv-8',
    nombre: 'Centro Médico Andes',
    tipo: 'clinica',
    direccion: 'Calle 57 # 25-61, Barranquilla',
    latitud: 10.9745,
    longitud: -74.7901,
    horario: 'Lunes a Viernes: 7:00 AM - 7:00 PM, Sábados: 7:00 AM - 1:00 PM',
    telefono: '+57 605 378 9012',
    descripcion: 'Centro médico con múltiples especialidades, consulta externa y servicios de diagnóstico por imagen.',
    fecha_registro: new Date('2024-03-10'),
    id_categoria: 'cat-2'
  }
]

// Imágenes de servicios
export const imagenes: ImagenServicio[] = [
  { id_imagen: 'img-1', id_servicio: 'serv-1', url_imagen: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800', descripcion: 'Fachada del hospital', es_principal: true },
  { id_imagen: 'img-2', id_servicio: 'serv-1', url_imagen: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800', descripcion: 'Área de recepción', es_principal: false },
  { id_imagen: 'img-3', id_servicio: 'serv-2', url_imagen: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800', descripcion: 'Entrada principal de la clínica', es_principal: true },
  { id_imagen: 'img-4', id_servicio: 'serv-2', url_imagen: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800', descripcion: 'Sala de espera', es_principal: false },
  { id_imagen: 'img-5', id_servicio: 'serv-3', url_imagen: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800', descripcion: 'Interior de la farmacia', es_principal: true },
  { id_imagen: 'img-6', id_servicio: 'serv-4', url_imagen: 'https://images.unsplash.com/photo-1579165466741-7f35e4755660?w=800', descripcion: 'Laboratorio clínico', es_principal: true },
  { id_imagen: 'img-7', id_servicio: 'serv-5', url_imagen: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800', descripcion: 'Área de urgencias', es_principal: true },
  { id_imagen: 'img-8', id_servicio: 'serv-6', url_imagen: 'https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=800', descripcion: 'Oficina EPS', es_principal: true },
  { id_imagen: 'img-9', id_servicio: 'serv-7', url_imagen: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=800', descripcion: 'Mostrador de farmacia', es_principal: true },
  { id_imagen: 'img-10', id_servicio: 'serv-8', url_imagen: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800', descripcion: 'Centro médico', es_principal: true }
]

// Comentarios (2 por servicio)
export const comentarios: Comentario[] = [
  { id_comentario: 'com-1', texto: 'Excelente atención del personal médico. Las instalaciones son muy modernas.', calificacion: 5, fecha: new Date('2024-03-15'), id_usuario: 'user-2', id_servicio: 'serv-1' },
  { id_comentario: 'com-2', texto: 'Buena atención pero los tiempos de espera son largos.', calificacion: 4, fecha: new Date('2024-03-20'), id_usuario: 'user-3', id_servicio: 'serv-1' },
  { id_comentario: 'com-3', texto: 'Muy profesionales y el lugar está muy limpio.', calificacion: 5, fecha: new Date('2024-03-18'), id_usuario: 'user-2', id_servicio: 'serv-2' },
  { id_comentario: 'com-4', texto: 'Buenas instalaciones, precio un poco elevado.', calificacion: 4, fecha: new Date('2024-03-22'), id_usuario: 'user-3', id_servicio: 'serv-2' },
  { id_comentario: 'com-5', texto: 'Siempre tienen todo lo que necesito. Muy recomendada.', calificacion: 5, fecha: new Date('2024-03-10'), id_usuario: 'user-2', id_servicio: 'serv-3' },
  { id_comentario: 'com-6', texto: 'Buenos precios y atención rápida.', calificacion: 4, fecha: new Date('2024-03-25'), id_usuario: 'user-3', id_servicio: 'serv-3' },
  { id_comentario: 'com-7', texto: 'Resultados rápidos y personal muy amable.', calificacion: 5, fecha: new Date('2024-03-12'), id_usuario: 'user-2', id_servicio: 'serv-4' },
  { id_comentario: 'com-8', texto: 'Buen laboratorio, aunque un poco difícil de encontrar parqueadero.', calificacion: 4, fecha: new Date('2024-03-28'), id_usuario: 'user-3', id_servicio: 'serv-4' },
  { id_comentario: 'com-9', texto: 'Me atendieron inmediatamente. Excelente servicio de urgencias.', calificacion: 5, fecha: new Date('2024-03-14'), id_usuario: 'user-2', id_servicio: 'serv-5' },
  { id_comentario: 'com-10', texto: 'Atención rápida y efectiva.', calificacion: 5, fecha: new Date('2024-03-30'), id_usuario: 'user-3', id_servicio: 'serv-5' },
  { id_comentario: 'com-11', texto: 'Buena atención al usuario, trámites ágiles.', calificacion: 4, fecha: new Date('2024-03-16'), id_usuario: 'user-2', id_servicio: 'serv-6' },
  { id_comentario: 'com-12', texto: 'Mucha gente pero organizados.', calificacion: 3, fecha: new Date('2024-04-01'), id_usuario: 'user-3', id_servicio: 'serv-6' },
  { id_comentario: 'com-13', texto: 'Muy buena farmacia, tienen servicio a domicilio.', calificacion: 5, fecha: new Date('2024-03-19'), id_usuario: 'user-2', id_servicio: 'serv-7' },
  { id_comentario: 'com-14', texto: 'Precios competitivos y buen servicio.', calificacion: 4, fecha: new Date('2024-04-02'), id_usuario: 'user-3', id_servicio: 'serv-7' },
  { id_comentario: 'com-15', texto: 'Médicos muy profesionales, lo recomiendo.', calificacion: 5, fecha: new Date('2024-03-21'), id_usuario: 'user-2', id_servicio: 'serv-8' },
  { id_comentario: 'com-16', texto: 'Buena ubicación y variedad de especialistas.', calificacion: 4, fecha: new Date('2024-04-03'), id_usuario: 'user-3', id_servicio: 'serv-8' }
]

// Favoritos iniciales
export const favoritos: Favorito[] = [
  { id_favorito: 'fav-1', id_usuario: 'user-2', id_servicio: 'serv-1', fecha_agregado: new Date('2024-03-15') },
  { id_favorito: 'fav-2', id_usuario: 'user-2', id_servicio: 'serv-3', fecha_agregado: new Date('2024-03-16') },
  { id_favorito: 'fav-3', id_usuario: 'user-3', id_servicio: 'serv-2', fecha_agregado: new Date('2024-03-20') }
]
