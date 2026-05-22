'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { useAppStore } from '@/store/app-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { TIPO_COLORS, TIPO_LABELS, type TipoServicio, type ServicioSalud } from '@/types'
import { Plus, Pencil, Trash2, Image as ImageIcon, MapPin } from 'lucide-react'

const tipos: TipoServicio[] = ['hospital', 'clinica', 'farmacia', 'laboratorio', 'urgencias', 'eps', 'otro']

// Dynamic import for the map picker
const MapPicker = dynamic(
  () => import('@/components/admin/map-picker').then(mod => mod.MapPicker),
  { 
    ssr: false,
    loading: () => <div className="h-48 bg-muted rounded-lg animate-pulse" />
  }
)

interface ServiceFormData {
  nombre: string
  tipo: TipoServicio
  direccion: string
  latitud: number
  longitud: number
  horario: string
  telefono: string
  descripcion: string
  id_categoria: string
}

const defaultFormData: ServiceFormData = {
  nombre: '',
  tipo: 'clinica',
  direccion: '',
  latitud: 10.9639,
  longitud: -74.7964,
  horario: '',
  telefono: '',
  descripcion: '',
  id_categoria: 'cat-1'
}

export default function AdminServiciosPage() {
  const { servicios, categorias, addService, updateService, deleteService, getServiceImages } = useAppStore()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<ServicioSalud | null>(null)
  const [formData, setFormData] = useState<ServiceFormData>(defaultFormData)
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [selectedServiceForImages, setSelectedServiceForImages] = useState<string | null>(null)

  const handleOpenDialog = (service?: ServicioSalud) => {
    if (service) {
      setEditingService(service)
      setFormData({
        nombre: service.nombre,
        tipo: service.tipo,
        direccion: service.direccion,
        latitud: service.latitud,
        longitud: service.longitud,
        horario: service.horario,
        telefono: service.telefono,
        descripcion: service.descripcion,
        id_categoria: service.id_categoria
      })
    } else {
      setEditingService(null)
      setFormData(defaultFormData)
    }
    setDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingService) {
      updateService(editingService.id_servicio, formData)
    } else {
      addService(formData)
    }
    
    setDialogOpen(false)
    setEditingService(null)
    setFormData(defaultFormData)
  }

  const handleMapClick = (lat: number, lng: number) => {
    setFormData(prev => ({ ...prev, latitud: lat, longitud: lng }))
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Gestión de Servicios</h1>
          <p className="text-muted-foreground">
            Administra los servicios médicos de la plataforma
          </p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar servicio
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingService ? 'Editar servicio' : 'Agregar nuevo servicio'}
              </DialogTitle>
              <DialogDescription>
                Completa la información del servicio médico
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre *</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo *</Label>
                  <Select
                    value={formData.tipo}
                    onValueChange={(value: TipoServicio) => setFormData(prev => ({ ...prev, tipo: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tipos.map((tipo) => (
                        <SelectItem key={tipo} value={tipo}>
                          {TIPO_LABELS[tipo]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoria">Categoría *</Label>
                <Select
                  value={formData.id_categoria}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, id_categoria: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((cat) => (
                      <SelectItem key={cat.id_categoria} value={cat.id_categoria}>
                        {cat.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección *</Label>
                <Input
                  id="direccion"
                  value={formData.direccion}
                  onChange={(e) => setFormData(prev => ({ ...prev, direccion: e.target.value }))}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono *</Label>
                  <Input
                    id="telefono"
                    value={formData.telefono}
                    onChange={(e) => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="horario">Horario *</Label>
                  <Input
                    id="horario"
                    value={formData.horario}
                    onChange={(e) => setFormData(prev => ({ ...prev, horario: e.target.value }))}
                    placeholder="Lunes a Viernes: 8:00 AM - 5:00 PM"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                  rows={3}
                />
              </div>

              {/* Coordinates */}
              <div className="space-y-2">
                <Label>Ubicación (haz clic en el mapa para seleccionar)</Label>
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <div>
                    <Label htmlFor="latitud" className="text-xs text-muted-foreground">Latitud</Label>
                    <Input
                      id="latitud"
                      type="number"
                      step="any"
                      value={formData.latitud}
                      onChange={(e) => setFormData(prev => ({ ...prev, latitud: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="longitud" className="text-xs text-muted-foreground">Longitud</Label>
                    <Input
                      id="longitud"
                      type="number"
                      step="any"
                      value={formData.longitud}
                      onChange={(e) => setFormData(prev => ({ ...prev, longitud: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                </div>
                <MapPicker
                  lat={formData.latitud}
                  lng={formData.longitud}
                  onLocationSelect={handleMapClick}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingService ? 'Guardar cambios' : 'Crear servicio'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="hidden md:table-cell">Dirección</TableHead>
              <TableHead className="hidden lg:table-cell">Teléfono</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {servicios.map((servicio) => {
              const images = getServiceImages(servicio.id_servicio)
              
              return (
                <TableRow key={servicio.id_servicio}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="font-medium">{servicio.nombre}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      style={{ 
                        backgroundColor: TIPO_COLORS[servicio.tipo] + '20', 
                        color: TIPO_COLORS[servicio.tipo] 
                      }}
                    >
                      {TIPO_LABELS[servicio.tipo]}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground max-w-xs truncate">
                    {servicio.direccion}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">
                    {servicio.telefono}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedServiceForImages(servicio.id_servicio)
                          setImageDialogOpen(true)
                        }}
                        title="Gestionar imágenes"
                      >
                        <ImageIcon className="h-4 w-4" />
                        {images.length > 0 && (
                          <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                            {images.length}
                          </span>
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(servicio)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar servicio?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción eliminará permanentemente {servicio.nombre} y todos sus datos asociados.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteService(servicio.id_servicio)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Image Management Dialog */}
      <ImageManagementDialog
        open={imageDialogOpen}
        onOpenChange={setImageDialogOpen}
        serviceId={selectedServiceForImages}
      />
    </div>
  )
}

// Image Management Dialog Component
function ImageManagementDialog({ 
  open, 
  onOpenChange, 
  serviceId 
}: { 
  open: boolean
  onOpenChange: (open: boolean) => void
  serviceId: string | null
}) {
  const { getServiceImages, getServiceById, addImage, deleteImage, setMainImage } = useAppStore()
  const [newImageUrl, setNewImageUrl] = useState('')
  const [newImageDesc, setNewImageDesc] = useState('')

  if (!serviceId) return null

  const service = getServiceById(serviceId)
  const images = getServiceImages(serviceId)

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return
    
    addImage({
      id_servicio: serviceId,
      url_imagen: newImageUrl,
      descripcion: newImageDesc || 'Imagen del servicio',
      es_principal: images.length === 0
    })
    
    setNewImageUrl('')
    setNewImageDesc('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Gestionar imágenes</DialogTitle>
          <DialogDescription>
            {service?.nombre}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Add new image */}
          <div className="space-y-2">
            <Label>Agregar nueva imagen</Label>
            <Input
              placeholder="URL de la imagen"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
            />
            <Input
              placeholder="Descripción (opcional)"
              value={newImageDesc}
              onChange={(e) => setNewImageDesc(e.target.value)}
            />
            <Button onClick={handleAddImage} disabled={!newImageUrl.trim()} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Agregar imagen
            </Button>
          </div>

          {/* Existing images */}
          {images.length > 0 ? (
            <div className="space-y-2">
              <Label>Imágenes actuales</Label>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {images.map((img) => (
                  <div 
                    key={img.id_imagen} 
                    className="flex items-center gap-2 p-2 border rounded-lg"
                  >
                    <img 
                      src={img.url_imagen} 
                      alt={img.descripcion}
                      className="h-12 w-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{img.descripcion}</p>
                      {img.es_principal && (
                        <Badge variant="secondary" className="text-xs">Principal</Badge>
                      )}
                    </div>
                    <div className="flex gap-1">
                      {!img.es_principal && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setMainImage(serviceId, img.id_imagen)}
                        >
                          Hacer principal
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-destructive"
                        onClick={() => deleteImage(img.id_imagen)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No hay imágenes para este servicio
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
