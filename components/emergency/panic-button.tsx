'use client'

import { useState, useCallback } from 'react'
import { AlertTriangle, Phone, MapPin, X, Loader2, Siren, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useAppStore } from '@/store/app-store'
import type { ServicioSalud } from '@/types'

interface NearbyService extends ServicioSalud {
  distance: number
}

// Calcula la distancia entre dos puntos usando la fórmula de Haversine
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

export function PanicButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [nearbyServices, setNearbyServices] = useState<NearbyService[]>([])
  const [locationError, setLocationError] = useState<string | null>(null)

  const servicios = useAppStore((state) => state.servicios)
  const user = useAppStore((state) => state.user)

  const findNearbyEmergencyServices = useCallback((lat: number, lng: number) => {
    // Filtrar servicios de urgencia (hospitales, clínicas con urgencias, etc.)
    const emergencyTypes = ['hospital', 'urgencias', 'clinica']
    
    const servicesWithDistance = servicios
      .filter(s => emergencyTypes.includes(s.tipo))
      .map(service => ({
        ...service,
        distance: calculateDistance(lat, lng, service.latitud, service.longitud)
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5) // Los 5 más cercanos

    return servicesWithDistance
  }, [servicios])

  const handlePanicClick = useCallback(() => {
    setIsOpen(true)
    setIsLoading(true)
    setLocationError(null)
    setIsSent(false)

    if (!navigator.geolocation) {
      setLocationError('Tu navegador no soporta geolocalización')
      setIsLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setUserLocation({ lat: latitude, lng: longitude })
        const nearby = findNearbyEmergencyServices(latitude, longitude)
        setNearbyServices(nearby)
        setIsLoading(false)
      },
      (error) => {
        let errorMessage = 'No se pudo obtener tu ubicación'
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permiso de ubicación denegado. Por favor, habilita la ubicación en tu navegador.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Información de ubicación no disponible'
            break
          case error.TIMEOUT:
            errorMessage = 'Tiempo de espera agotado al obtener la ubicación'
            break
        }
        setLocationError(errorMessage)
        setIsLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }, [findNearbyEmergencyServices])

  const handleSendEmergency = useCallback(async () => {
    setIsSending(true)
    
    // Simular envío de notificaciones a servicios de emergencia
    // En producción, esto se conectaría a un backend real
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSending(false)
    setIsSent(true)
  }, [])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    setIsLoading(false)
    setIsSending(false)
    setIsSent(false)
    setUserLocation(null)
    setNearbyServices([])
    setLocationError(null)
  }, [])

  const handleCallService = useCallback((telefono: string) => {
    window.location.href = `tel:${telefono.replace(/\s/g, '')}`
  }, [])

  return (
    <>
      {/* Botón de Pánico Flotante */}
      <button
        onClick={handlePanicClick}
        className="fixed bottom-24 right-4 z-50 md:bottom-6 md:right-6 group"
        aria-label="Botón de emergencia"
      >
        <div className="relative">
          {/* Efecto de pulso */}
          <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75" />
          
          {/* Botón principal */}
          <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-700 shadow-lg shadow-red-500/50 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-red-500/60">
            <Siren className="w-8 h-8 text-white" />
          </div>
          
          {/* Etiqueta */}
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Emergencia
          </span>
        </div>
      </button>

      {/* Modal de Emergencia */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-6 h-6" />
              {isSent ? 'Alerta Enviada' : 'Emergencia Médica'}
            </DialogTitle>
            <DialogDescription>
              {isSent 
                ? 'Los servicios de emergencia han sido notificados de tu ubicación.'
                : 'Notificaremos a los servicios de urgencia más cercanos de tu ubicación actual.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Estado de carga */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-8 gap-3">
                <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
                <p className="text-sm text-muted-foreground">Obteniendo tu ubicación...</p>
              </div>
            )}

            {/* Error de ubicación */}
            {locationError && (
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg p-4">
                <p className="text-sm text-red-600 dark:text-red-400">{locationError}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={handlePanicClick}
                >
                  Reintentar
                </Button>
              </div>
            )}

            {/* Confirmación de envío exitoso */}
            {isSent && (
              <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div>
                    <h4 className="font-semibold text-green-700 dark:text-green-400">Notificación Enviada</h4>
                    <p className="text-sm text-green-600 dark:text-green-500">
                      {nearbyServices.length} servicio(s) de emergencia han sido alertados
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Ubicación del usuario */}
            {userLocation && !isLoading && (
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span className="font-medium">Tu ubicación:</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Lat: {userLocation.lat.toFixed(6)}, Lng: {userLocation.lng.toFixed(6)}
                </p>
                {user && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Usuario: {user.nombre} ({user.telefono})
                  </p>
                )}
              </div>
            )}

            {/* Lista de servicios cercanos */}
            {nearbyServices.length > 0 && !isLoading && (
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">
                  Servicios de urgencia cercanos ({nearbyServices.length})
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {nearbyServices.map((service) => (
                    <div
                      key={service.id_servicio}
                      className="flex items-center justify-between bg-background border rounded-lg p-3 gap-2"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{service.nombre}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {service.direccion}
                        </p>
                        <p className="text-xs text-red-600 font-medium mt-1">
                          {service.distance < 1 
                            ? `${(service.distance * 1000).toFixed(0)} m` 
                            : `${service.distance.toFixed(2)} km`}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="shrink-0"
                        onClick={() => handleCallService(service.telefono)}
                      >
                        <Phone className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Botones de acción */}
            {userLocation && !isLoading && !isSent && (
              <div className="flex flex-col gap-2 pt-2">
                <Button
                  onClick={handleSendEmergency}
                  disabled={isSending || nearbyServices.length === 0}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Enviando alerta...
                    </>
                  ) : (
                    <>
                      <Siren className="w-4 h-4 mr-2" />
                      Notificar a todos los servicios
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSending}
                >
                  Cancelar
                </Button>
              </div>
            )}

            {/* Botón de cerrar después de enviar */}
            {isSent && (
              <Button
                onClick={handleClose}
                className="w-full"
              >
                Cerrar
              </Button>
            )}

            {/* Número de emergencia nacional */}
            <div className="border-t pt-4 mt-4">
              <p className="text-xs text-muted-foreground text-center mb-2">
                Línea Nacional de Emergencias
              </p>
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => handleCallService('123')}
              >
                <Phone className="w-4 h-4 mr-2" />
                Llamar al 123
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
