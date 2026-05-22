'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { useAppStore } from '@/store/app-store'
import { TIPO_COLORS, TIPO_LABELS, type TipoServicio } from '@/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, MapPin, ExternalLink } from 'lucide-react'

interface ServiceMapProps {
  selectedServiceId?: string
}

export function ServiceMap({ selectedServiceId }: ServiceMapProps) {
  const [mounted, setMounted] = useState(false)
  const [leafletLoaded, setLeafletLoaded] = useState(false)
  const [L, setL] = useState<typeof import('leaflet') | null>(null)
  const [ReactLeaflet, setReactLeaflet] = useState<typeof import('react-leaflet') | null>(null)
  
  const { getFilteredServices, getServiceAverageRating } = useAppStore()
  const services = getFilteredServices()

  // Barranquilla center coordinates
  const defaultCenter: [number, number] = [10.9639, -74.7964]
  const [mapCenter, setMapCenter] = useState<[number, number]>(defaultCenter)

  // Load Leaflet only on client side
  useEffect(() => {
    setMounted(true)
    
    const loadLeaflet = async () => {
      const leaflet = await import('leaflet')
      const reactLeaflet = await import('react-leaflet')
      await import('leaflet/dist/leaflet.css')
      
      setL(leaflet)
      setReactLeaflet(reactLeaflet)
      setLeafletLoaded(true)
    }
    
    loadLeaflet()
  }, [])

  useEffect(() => {
    if (selectedServiceId) {
      const service = services.find(s => s.id_servicio === selectedServiceId)
      if (service) {
        setMapCenter([service.latitud, service.longitud])
      }
    }
  }, [selectedServiceId, services])

  if (!mounted || !leafletLoaded || !L || !ReactLeaflet) {
    return (
      <div className="w-full h-full bg-muted animate-pulse flex items-center justify-center">
        <div className="text-muted-foreground">Cargando mapa...</div>
      </div>
    )
  }

  const { MapContainer, TileLayer, Marker, Popup } = ReactLeaflet

  // Custom marker icon creator
  const createCustomIcon = (tipo: TipoServicio) => {
    const color = TIPO_COLORS[tipo]
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          width: 32px;
          height: 32px;
          background-color: ${color};
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    })
  }

  return (
    <MapContainer
      center={mapCenter}
      zoom={13}
      className="w-full h-full"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {services.map((service) => {
        const rating = getServiceAverageRating(service.id_servicio)
        const icon = createCustomIcon(service.tipo)
        
        return (
          <Marker
            key={service.id_servicio}
            position={[service.latitud, service.longitud]}
            icon={icon}
          >
            <Popup>
              <div className="min-w-[240px] p-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-foreground text-sm leading-tight">
                    {service.nombre}
                  </h3>
                  <Badge 
                    variant="secondary" 
                    className="shrink-0 text-xs"
                    style={{ backgroundColor: TIPO_COLORS[service.tipo] + '20', color: TIPO_COLORS[service.tipo] }}
                  >
                    {TIPO_LABELS[service.tipo]}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                  <MapPin className="h-3 w-3" />
                  <span className="line-clamp-1">{service.direccion}</span>
                </div>
                
                {rating > 0 && (
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-sm">{rating.toFixed(1)}</span>
                  </div>
                )}
                
                <Button size="sm" className="w-full" asChild>
                  <Link href={`/servicios/${service.id_servicio}`}>
                    Ver detalles
                    <ExternalLink className="ml-2 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}
