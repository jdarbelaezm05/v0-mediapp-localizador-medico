'use client'

import { useEffect, useState } from 'react'

interface MapPickerProps {
  lat: number
  lng: number
  onLocationSelect: (lat: number, lng: number) => void
}

export function MapPicker({ lat, lng, onLocationSelect }: MapPickerProps) {
  const [mounted, setMounted] = useState(false)
  const [leafletLoaded, setLeafletLoaded] = useState(false)
  const [L, setL] = useState<typeof import('leaflet') | null>(null)
  const [ReactLeaflet, setReactLeaflet] = useState<typeof import('react-leaflet') | null>(null)

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

  if (!mounted || !leafletLoaded || !L || !ReactLeaflet) {
    return <div className="h-48 bg-muted rounded-lg animate-pulse" />
  }

  const { MapContainer, TileLayer, Marker, useMapEvents } = ReactLeaflet

  // Create a simple marker icon
  const markerIcon = L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 24px;
        height: 24px;
        background-color: #0EA5E9;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  })

  function ClickHandler() {
    useMapEvents({
      click: (e) => {
        onLocationSelect(e.latlng.lat, e.latlng.lng)
      }
    })
    return null
  }

  return (
    <div className="h-48 rounded-lg overflow-hidden border">
      <MapContainer
        center={[lat, lng]}
        zoom={14}
        className="w-full h-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]} icon={markerIcon} />
        <ClickHandler />
      </MapContainer>
    </div>
  )
}
